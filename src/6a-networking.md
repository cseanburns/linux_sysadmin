# Networking

By the end of this section, you should be able to:

1. Describe the link, internet, transport, and application layers of the Internet Protocol Suite.
2. Inspect a DigitalOcean Droplet's interfaces, IP addresses, neighbors, and routes.
3. Distinguish loopback, public, and private addresses and explain the role of a VPC.
4. Compare TCP and UDP, identify common ports, and inspect listening services.
5. Observe a small amount of your own network traffic with `tcpdump`.
6. Use binary notation, subnet masks, and CIDR prefixes to calculate IPv4 subnet boundaries and host counts.

## Getting Started

System administrators configure and monitor networks, diagnose connectivity problems, and control access to services.
On DigitalOcean, the provider manages the underlying network infrastructure, while you manage networking and services inside your **Droplet**, a virtual Linux server.
A useful starting question is: *Which address, interface, route, and service does this connection use?*

For this lesson, use your Droplet server with public IPv4 connectivity and an SSH connection.
Run the Linux commands **inside the Droplet**, unless instructed otherwise.
DigitalOcean also offers private-only Droplets; those require a different access setup and are outside this exercise.
The addresses shown here are examples, not values to copy into your network configuration.

Keep your SSH session open. This lesson inspects networking; it does not require changing addresses, routes, interfaces, or firewall rules.
Disabling the interface carrying SSH can disconnect you before you can re-enable it.

## The Internet Protocol Suite

The Internet Protocol Suite, often called **TCP/IP**, describes how protocols work together in layers.
The seven-layer OSI model is a related reference model, but its layers do not map one-to-one onto this four-layer model.

 | Layer       | Main task                                         | Examples                              |
 | -------     | -----------                                       | ----------                            |
 | Application | Define communication for a particular service     | HTTP, DNS, SSH                        |
 | Transport   | Carry communication between application endpoints | TCP, UDP                              |
 | Internet    | Address and route packets between networks        | IPv4, IPv6                            |
 | Link        | Carry frames across a local link                  | Ethernet, virtual Ethernet interfaces |

For example, an SSH client creates application data, TCP carries it in segments, IP carries those segments in packets, and the local link carries those packets in frames.
At the destination, these layers deliver the data to the SSH server.
The web is one application of the internet; it is not the entire internet.
DNS commonly resolves domain names to IP addresses, and SSH provides remote access to your Droplet.

### Link Layer

#### Interfaces and MAC Addresses

Inspect the interfaces on your Droplet:

```bash
ip -brief link
ip link
```

An **interface** is a system's connection to a network.
On a Droplet, Ethernet interfaces are virtual rather than physical cards you install.
The `link/ether` value is an Ethernet interface's **MAC address**, used for delivery on its local link.

You will normally see:

- `lo`: the **loopback interface**, used by the system to communicate with itself. It is not an Ethernet interface; its displayed all-zero link address is not a physical MAC address.
- `eth0`: the public-facing interface on a standard Droplet.
- `eth1`: the VPC interface for private communication with other resources in the VPC.

Inspect your actual output rather than assuming the names or number of interfaces.
DigitalOcean's [network troubleshooting guide][do_network] explains the usual interface arrangement.

#### ARP and Neighbors

For IPv4 on Ethernet, **ARP** (Address Resolution Protocol) discovers the MAC address associated with an IP address on the local link.
For a destination beyond that link, the host normally needs the next-hop router's MAC address, not the remote server's MAC address.
IPv6 uses Neighbor Discovery instead of ARP.

```bash
ip -4 neigh
```

This displays cached IPv4 neighbor entries, often including a gateway.
It is not an inventory of every device on the network, and it can be empty before relevant traffic has occurred.
States such as `REACHABLE` and `STALE` describe the cache entry; `STALE` alone does not mean a device is offline.

ARP does **not** assign IP addresses.
Address assignment is a separate task, handled through mechanisms such as DHCP or provider-supplied configuration.
An Ethernet switch normally forwards frames using MAC addresses; a router forwards IP packets between networks.

### Internet Layer

#### Addresses on Your Droplet

IP provides addressing and packet delivery across networks.
IPv4 addresses contain 32 bits; IPv6 addresses contain 128 bits.
An interface can have multiple IP addresses, and a machine can have several interfaces.

```bash
ip -brief address
ip -4 address show
```

`ip a` is a shorter form of `ip address`; `a` abbreviates the command's `address` object.
Look for `inet` for IPv4 and `inet6` for IPv6.
A suffix such as `/20` is the network prefix length, explained below.

Compare this output with your Droplet's **Networking** information in the DigitalOcean control panel.
Identify the public IPv4 address you use for SSH and the private address associated with its **Virtual Private Cloud (VPC)**.
You may see additional addresses.
Match the displayed values to the control panel rather than assuming every address on `eth0` is public.

 | Address type                             | Purpose                                                                                          |
 | --------------                           | ---------                                                                                        |
 | Loopback, typically `127.0.0.1` or `::1` | Communication within the same machine                                                            |
 | Public IPv4                              | Addressing on the public internet; reachability still depends on routes, firewalls, and services |
 | Private IPv4                             | Communication over private networks, such as a VPC; not routed on the public internet            |

`127.0.0.1` on your laptop refers to your laptop; the same address inside an SSH session refers to the Droplet.
The entire `127.0.0.0/8` range is reserved for IPv4 loopback.

The private IPv4 ranges are:

 | CIDR block       | Start address   | End address       |
 | ------------     | --------------- | -------------     |
 | `10.0.0.0/8`     | `10.0.0.0`      | `10.255.255.255`  |
 | `172.16.0.0/12`  | `172.16.0.0`    | `172.31.255.255`  |
 | `192.168.0.0/16` | `192.168.0.0`   | `192.168.255.255` |

Only `172.16` through `172.31` belong to that private block, not every address beginning with `172`.
An address outside these three ranges is not necessarily public: loopback and other special-purpose ranges also exist.
An organization's chosen subnet can be much smaller than the containing private block.
A `10.x.x.x/24` subnet has the same address count as a `192.168.x.x/24` subnet.

A VPC provides private networking for your cloud resources.
Your laptop normally cannot reach a Droplet's VPC address directly over the internet; use the public address for the course SSH connection.
A private address does not encrypt traffic or replace firewall rules.

#### Public Addresses and NAT

At home, your laptop might use `192.168.1.20/24`, while your router uses a public address for internet access.
**Network Address Translation (NAT)** can let multiple devices share that public address by translating addresses and, commonly, port numbers.
Replies are associated with the existing connections.
Unsolicited incoming traffic does not automatically reach a particular private device.

Do not assume that this home-network arrangement describes your Droplet.
A standard publicly connected Droplet has public addressing as well as VPC addressing.
Also, a private address can be routed between connected private networks; it is not limited to communication within one subnet.

#### Routes: Where Does a Packet Go?

```bash
ip -4 route
ip -4 route get 1.1.1.1
```

The first command displays the IPv4 routing table.
The second asks Linux which route it would use for that destination; it does not send a probe or change a route.
In the output, `dev` names the interface, `via` identifies a next-hop gateway when one is needed, and `src` identifies the selected source address.
A `default` route handles destinations without a more specific matching route.
Traffic to a local VPC destination normally uses the VPC interface, while public internet traffic normally uses the public interface.

**Check your understanding:** Which interface and source address would your Droplet use for `1.1.1.1`?
What evidence in the route output supports your answer?

### Transport Layer

IP carries packets between addresses.
TCP and UDP add transport-layer communication using **ports**.
A port number helps the operating system deliver traffic to the appropriate socket used by an application.

#### TCP and UDP

**TCP** provides a reliable, ordered byte stream using sequence numbers, acknowledgments, and retransmissions.
If delivery cannot continue, a connection can fail; reliability does not mean every connection succeeds.
SSH and HTTP/1.1 or HTTP/2 commonly use TCP.

**UDP** sends datagrams without built-in delivery guarantees, ordering, or retransmission.
It does have a checksum field, although use of that checksum is optional in ordinary IPv4 UDP.
Applications can add their own reliability when needed.
DNS queries often use UDP, and real-time media applications may favor timely delivery over retransmitting old data.
HTTP/3 uses QUIC over UDP; QUIC adds reliable streams and encryption.
Thus, UDP does not necessarily mean unreliable application behavior, and TCP does not itself provide encryption.
See the protocol specifications for [TCP][tcp] and [UDP][udp].

#### Ports and Listening Services

The notation `10.0.5.33:80` means IPv4 address `10.0.5.33`, port `80`.
Port 80 conventionally serves HTTP, but a port number alone does not prove which protocol an application actually speaks.
TCP and UDP have separate port spaces: TCP port 53 and UDP port 53 are distinct endpoints.

 | Port   | Common use                              | Transport           |
 | ------ | ------------                            | -----------         |
 | 21     | FTP control connection                  | TCP                 |
 | 22     | SSH                                     | TCP                 |
 | 25     | SMTP between mail servers               | TCP                 |
 | 53     | DNS                                     | UDP and TCP         |
 | 80     | HTTP                                    | TCP                 |
 | 143    | IMAP, with optional STARTTLS            | TCP                 |
 | 443    | HTTPS                                   | TCP; UDP for HTTP/3 |
 | 587    | Mail submission, commonly with STARTTLS | TCP                 |
 | 993    | IMAP over implicit TLS                  | TCP                 |

To inspect services inside your Droplet:

```bash
sudo ss -lntup
```

Here, `-l` selects listening or bound server sockets, `-n` shows numeric addresses and ports, `-t` selects TCP, `-u` selects UDP, and `-p` shows process information.
For UDP, expect states such as `UNCONN` rather than TCP's `LISTEN`.
In the **Local Address:Port** column, `127.0.0.1` means loopback only, `0.0.0.0` means all local IPv4 addresses, and `[::]` means all local IPv6 addresses.
Whether an IPv6 socket also accepts IPv4 depends on its configuration.

A service bound only to loopback is not directly reachable through the Droplet's public address.
A service listening on a public-facing address may still be blocked by a firewall.
DigitalOcean's **Cloud Firewall** and a firewall inside the Droplet, such as UFW, are separate controls; check both when diagnosing access.
See [DigitalOcean's firewall troubleshooting guidance][do_firewall].

```bash
less /etc/services
```

This file lists conventional service names and ports.
It does not report which services are installed, running, or reachable.

#### Observe TCP Headers with `tcpdump`

An IP header contains source and destination IP addresses.
Inside the IP packet, the TCP or UDP header contains source and destination ports.
TCP also includes sequence numbers, acknowledgments, and flags.
A typical TCP connection begins with **SYN**, **SYN-ACK**, and **ACK**, the three-way handshake.

For a small exercise, capture only a local test connection on your own Droplet.
This avoids depending on an external website's changing IP address and requires no public firewall changes.
Use three SSH terminals connected to the same Droplet. Open all three before starting the exercise.
The exercise assumes Python 3, `curl`, and `tcpdump` are installed. On the course Ubuntu system, if needed:

```bash
sudo apt update
sudo apt install python3 curl tcpdump
```

> These may already be installed on your systems.
> To check before installing, run the commands separately:
>
> - `which python3`
> - `which curl`
> - `which tcpdump`

In **terminal 1**, start a temporary web server bound only to loopback, serving a new empty directory:

```bash
capture_dir=$(mktemp -d)
python3 -m http.server 8000 --bind 127.0.0.1 --directory "$capture_dir"
```

Leave the server running. In **terminal 2**, start the capture in the foreground:

```bash
sudo tcpdump -i lo -nn 'tcp port 8000'
```

Enter your sudo password if prompted.
Wait until tcpdump reports that it is listening on `lo`.
This terminal now displays the capture; use **terminal 3** to request the page:

```bash
curl --noproxy '*' -v http://127.0.0.1:8000/
```

The page's HTML appears in terminal 3, the web server logs the request in terminal 1, and the packet capture appears in terminal 2.
All three commands run on the same Droplet because `127.0.0.1` refers to the machine running the command.

`-i lo` captures loopback traffic, and `-nn` keeps addresses and ports numeric.
The filter `'tcp port 8000'` selects TCP traffic with source or destination port 8000.
The capture continues until you stop it. After the request finishes, return to **terminal 2** and press **Ctrl-C**.
Tcpdump prints a summary of the capture.

The `-v` option makes curl show connection details as well as the page's HTML.
Look for `Trying 127.0.0.1:8000` and a successful connection in terminal 3, and a new `GET /` request in terminal 1.
If tcpdump reports zero packets captured, check that it was listening before you made the request.
Also run `hostname` in all three terminals to check that they are connected to the same Droplet.
Restart the capture and repeat the request if needed.

Look for `Flags [S]`, `Flags [S.]`, and `Flags [.]` at the start of the connection.
In tcpdump's notation, the dot indicates ACK. Subsequent ACK-only packets can also appear.
One endpoint should use port 8000; the client's temporary source port will vary.
This is a local HTTP exchange, so it demonstrates TCP without adding TLS encryption or external routing.

When finished, press **Ctrl-C in terminal 1** to stop the server, then remove the empty directory:

```bash
rmdir "$capture_dir"
```

Capture only traffic you are authorized to inspect.
For command details, consult `man tcpdump`.

## IP Subnetting

A **subnet** is an address range defined by a network prefix.
Subnetting divides a larger address block into smaller blocks; it applies to public as well as private addressing.
Routers connect networks, but subnet calculations describe address boundaries rather than a particular router model.

On DigitalOcean, inspect the VPC range assigned to your resources rather than inventing addresses inside Linux.
The following exercises teach IPv4 arithmetic; they are not instructions to reconfigure the Droplet.

#### IP Meaning

An IPv4 address is 32 bits (8 x 4), or four bytes, in size.
In human readable context, it's usually expressed in the following, decimal-based, notation style:

- **192.168.1.6**
- **172.16.3.44**

Each set of numbers separated by a dot is referred to as an **octet**.
An **octet** is a group of 8 **bits**.
Eight **bits** equals a single **byte**.
By implication, 8 gigabits equals 1 gigabyte, and 8 megabits equals 1 megabyte.
We use these symbols to note the terms:

 | Term    | Symbol   |
 | ------- | -------- |
 | bit     | *b*      |
 | byte    | B        |
 | octet   | *o*      |

Each bit is represented by either a 1 or a 0.
For example, the first address above in binary is:

- **11000000.10101000.00000001.00000110** is **192.168.1.6**

Or:

| Byte     | Decimal Value |
|----------|---------------|
| 11000000 | 192           |
| 10101000 | 168           |
| 00000001 | 1             |
| 00000110 | 6             |

### IP Math

When doing IP math, one easy way to do it is to simply remember that each bit in each of the above bytes is a placeholder for the following values:

```
128 64 32 16 8 4 2 1
```

Alternatively, from low to high:

| base-2        | Output |
|---------------|--------|
| 2<sup>0</sup> | 1      |
| 2<sup>1</sup> | 2      |
| 2<sup>2</sup> | 4      |
| 2<sup>3</sup> | 8      |
| 2<sup>4</sup> | 16     |
| 2<sup>5</sup> | 32     |
| 2<sup>6</sup> | 64     |
| 2<sup>7</sup> | 128    |

It's helpful to work backward.
For IP addresses, all octets are 255 or less (256 total, from 0 to 255) and therefore do not exceed 8 bits or places.
To convert the integer 192 to binary:

```
1 * 2^7 = 128
1 * 2^6 =  64 (128 + 64 = 192)
```

Then STOP.
There are no values left, and so the rest are zeroes.
Thus: 11000000

Our everyday counting system is base-10, but binary is base-2, and thus another way to convert binary to decimal is to multiply each bit (1 or 0) by the power of base two of its placeholder:

```
(0 * 2^0) = 0 +
(0 * 2^1) = 0 +
(0 * 2^2) = 0 +
(0 * 2^3) = 0 +
(0 * 2^4) = 0 +
(0 * 2^5) = 0 +
(1 * 2^6) = 64 +
(1 * 2^7) = 128 = 192
```

Another way to convert to binary: simply subtract the numbers from each value.
As long as there is something remaining or the placeholder equals the remainder of the previous subtraction, then the bit equals 1.
So:

- 192 - 128 = 64 -- therefore the first bit is equal to 1.
- Now take the leftover and subtract it:
- 64 - 64 = 0 -- therefore the second bit is equal to 1.

Since there is nothing remaining, the rest of the bits equal 0.

### Subnetting Examples

Subnetting involves dividing a network into two or more subnets.
When we subnet, we first identify the number of hosts (i.e., the size of the subnet) we will require on the subnet.
For starters, let's assume that we need a subnet that can assign at most 254 IP addresses to the devices attached to it via the router.

The **subnet mask** marks the boundary between network bits and host bits.
It is a bit pattern, not an extra address that consumes a place in the subnet.
The **network address** has all host bits set to zero; the **broadcast address** has all host bits set to one.
In an ordinary IPv4 subnet, these two addresses are not assigned to individual hosts.
A broadcast addresses all hosts on that local subnet; routers generally do not forward it to other subnets.

For our sake, let's work through this process backwards; that is, let's identify and describe a network that we are already connected to and for which we already know a device's private IP address.
We'll work with example private IP addresses that exist on separate subnets.

#### Example IP Address 1: 192.168.1.6/24

Using the private IP address 192.168.1.6, let's derive the network mask and the network address (or ID) from this IP address.
First, convert the decimal notation to binary.
State the mask, which is **/24**, or **255.255.255.0**.
And then derive the network addressing using a **bitwise logical AND** operation:

```
11000000.10101000.00000001.00000110 IP              192.168.1.6
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
11000000.10101000.00000001.00000000 Network Address 192.168.1.0
```

Note the mask has 24 ones followed by 8 zeroes.
The /24 is used as [CIDR][cidr] notation and marks the network portion of the IP address.
The remaining 8 bits are for the host addresses.

- 192.168.1.6/24

For Example 1, we thus have the following subnet information:

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 192.168.1.0   |
| Start Range  | 192.168.1.1   |
| End Range    | 192.168.1.254 |
| Broadcast    | 192.168.1.255 |

#### Example IP Address 2: 10.160.38.75/24

For example 2, let's start off with a private IP address of 10.160.38.75 and a mask of /24:

```
00001010.10100000.00100110.01001011 IP               10.160.38.75
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
00001010.10100000.00100110.00000000 Network Address   10.160.38.0
```

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 10.160.38.0   |
| Start Range  | 10.160.38.1   |
| End Range    | 10.160.38.254 |
| Broadcast    | 10.160.38.255 |

#### Example IP Address 3: 172.16.1.62/24

For example 3, let's start off with a private IP address of 172.16.1.62 and a mask of /24:

```
10101100 00010000 00000001 00111110 IP                172.16.1.62
11111111 11111111 11111111 00000000 Mask            255.255.255.0
-----------------------------------
10101100 00010000 00000001 00000000 Network Address    172.16.1.0
```

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 172.16.1.0    |
| Start Range  | 172.16.1.1    |
| End Range    | 172.16.1.254  |
| Broadcast    | 172.16.1.255  |

#### Determine the Number of Hosts

To determine the number of hosts on a CIDR /24 subnet, we look at the start and end ranges.
In all three of the above examples, the start range begins with X.X.X.1 and ends with X.X.X.254.
Therefore, there are 254 maximum hosts allowed on these subnets because 1 to 254, inclusive of 1 and 254, is 254.

#### Example IP Address 4: 10.0.5.23/16

The first three examples show instances where the CIDR is set to /24.
This only allows 254 maximum hosts on a subnet.
If the CIDR is set to /16, then we can theoretically allow 65,534 hosts on a subnet.

For example 4, let's start off then with a private IP address of 10.0.5.23 and a mask of /16:

```
00001010.00000000.00000101.00010111 IP Address: 10.0.5.23
11111111.11111111.00000000.00000000 Mask:       255.255.0.0
-----------------------------------------------------------
00001010.00000000.00000000.00000000 Network ID: 10.0.0.0
```

| Type         | IP            |
|--------------|---------------|
| IP Address   | 10.0.5.23     |
| Netmask/Mask | 255.255.0.0   |
| Network ID   | 10.0.0.0      |
| Start Range  | 10.0.0.1      |
| End Range    | 10.0.255.254  |
| Broadcast    | 10.0.255.255  |

A /16 leaves 16 host bits, so there are 2^16 = 65,536 total addresses.
Subtract the network address and broadcast address to obtain 65,534 conventional usable host addresses.
The intermediate addresses include values such as `10.0.1.0` and `10.0.1.255`: an address ending in `.0` or `.255` is not automatically a network or broadcast address.
The prefix determines its role.

For the ordinary IPv4 subnets in these examples:

```text
Total addresses = 2^(32 - prefix length)
Conventional usable host addresses = 2^(32 - prefix length) - 2
```

This host formula has exceptions, including /31 point-to-point links and /32 host routes.
Cloud providers also reserve addresses for infrastructure, so the formula does not tell you how many Droplets a VPC can hold.
Consult [DigitalOcean's VPC planning documentation][do_vpc] for provider reservations.

#### Try a /20 Prefix

Suppose a Droplet has the VPC address `10.116.0.2/20`.
Before calculating, predict whether its subnet contains more or fewer addresses than a /24.
Then find its mask, network address, broadcast address, and conventional usable host count.

Hint: /20 leaves 12 host bits.
Its mask is `255.255.240.0`, and the third octet advances in blocks of 16.
Treat this as address arithmetic; do not assign these example addresses to your Droplet.

### IPv6

IPv6 also uses prefix lengths, but its 128-bit addresses use hexadecimal notation.
IPv6 has no broadcast address, so do not apply the IPv4 “subtract two” rule to it.
Detailed IPv6 subnetting is outside this lesson.

## Practice and Review

Record the following from your own Droplet, using your observed values rather than the examples:

1. Its public IPv4 address, VPC IPv4 address and prefix, and loopback address.
2. The interface and next hop selected for a public destination.
3. A listening TCP service and the address to which it is bound.
4. The server and client ports in your local packet capture.
5. The network address and conventional host count for the example `10.116.0.2/20`.

Then explain: if a service is running but you cannot connect from your laptop, what would you check?
Hint: distinguish the destination address, the service's listening address and port, the route, and each firewall.
A failed ping does not prove that a host is down: ICMP can be filtered while SSH or HTTP still works.

In the next section, we extend this discussion to DNS and domain names.

[do_network]:https://docs.digitalocean.com/support/how-do-i-debug-my-droplets-network-configuration/
[do_vpc]:https://docs.digitalocean.com/products/networking/vpc/concepts/plan-your-network/
[do_firewall]:https://docs.digitalocean.com/support/my-firewalls-are-not-working-correctly/
[tcp]:https://www.rfc-editor.org/rfc/rfc9293.html
[udp]:https://www.rfc-editor.org/rfc/rfc768.html
[cidr]:https://www.rfc-editor.org/rfc/rfc4632.html
