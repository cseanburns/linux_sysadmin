# Networking

Wikipedia has a good primer on the [Internet protocol suite][wikiips].

[wikiips]:https://en.wikipedia.org/wiki/Internet_protocol_suite

## Link Layer

### ARP (Address Resolution Protocol)

*ARP* or Address Resolution Protocol is a protocol used to map a network address, like the IP address, to the ethernet address (MAC, Media Access Control address or hardware address). Routers use MAC addresses to enable communication inside networks (w/in subnets) so that computers within a local area network can talk to each other. Networks are designed so that IP addresses must be associated with MAC addresses before systems can communicate over a network.

In order to get ARP info for a system, we can use the ``ip`` command, which uses regular options (like ``-b``) but also various **objects** (see ``man ip`` for details). Here is the IP info, the ARP output, and the routing table on my Fedora virtual machine (**10.0.2.15**) running on my desktop via a NAT connection:

```
ip a
ip neigh show
ip route show
```

Where:

- **10.0.2.15** is the IP address of my fedora server
- **10.0.2.2** is the first usable address on subnet, and is likely the virtual router; likewise, **52:54:00:12:35:02** is the MAC/hardware address for that virtual router
- **10.0.2.0** is called the **network address (signified by the /24 part)**, which is a unique identifier IP address for the subnet

In short, for network traffic to get to the internet, the Fedora machine must know where the router (another computer) is located on the network and must know the router's hardware (MAC) address.

## Internet Layer

### IP (Internet Protocol)

The Internet Protocol, or *IP*, address is a way to uniquely identify a host on a network. If that network is subnetted (i.e., routed), then a host's IP address will have a subnet or private IP address that will not be directly exposed to the Internet.

These IP address ranges are, by design, reserved private address, which means no public internet device will have an IP address within these ranges. The default private address ranges include:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

If you have a router at home, and look at the IP address for your devices connected to that router, like your phone or computer, you will see that it will definitely have an address within one of the ranges above. For example, it might have an IP address beginning with **192.168.X.X**. This a standard IP address range for a home router. The **10.X.X.X** private range can assign many more IP addresses, which is why you'll see that IP range on bigger networks, like UK's. We'll talk more about subnetwork sizes, shortly.

At work, my IP address on my desktop was **10.163.34.59/24** (using the ``ip a`` command), via a wired connection (eno1). I checked my office neighbor's IP address, and on their desktop it reported **10.163.34.65/24**. (Soon I will show you how this indicates that we are both on the same subnet.) If we both, using our respective wired connected computers, Google *[ what's my IP address ]*, we both will get back the same public IP address of **128.163.8.25**. This is the same for the virtual machine I'm using that's running Fedora 30, connected via a bridge network.

Thus, w/o any additional information, we know that all traffic coming from our computers and going out to the Internet looks like it's coming from the same IP address (**128.163.8.25**). And in reverse, all traffic coming from outside our network first goes to **128.163.8.25** before it's routed to our respective computers via the router.

On the other hand, my laptop, just a few feet away from me was connected to UK wireless (eduroam), and had this IP address: **10.47.34.150/16** (wlp3s0). You can see there's a different pattern with this IP address. The reason it has a different pattern is because this laptop is on an different subnet. This wireless subnet allows more hosts to connect to it, which makes sense, since it must allow for more devices (i.e., laptops, phones, etc) to connect via it. In the meantime, if I use a browser on this laptop and ask Google for my IP address, it tells me: **128.163.238.148**, which shares the same IP pattern, even though it's not an exact match, as the public IP address reported above. 

### Routing

Again, on my Fedora VM on my desktop via a NAT connection, I can see the network information for my machine (some output removed / truncated for clarity) with the ``ip`` command:

```
ip a
ip route
```

Since both machines are on the same network, they both state the following path that internet packets take when between systems. All packets originating at from my Fedora VM Bridge clonegg are routed through the subnet defined as **10.163.36.0/24**.

Here's kind of visual diagram of what this network looks like:

![network diagram](network.png)

### Using the ``ip`` command

The ``ip`` command can do more than simply provide us information about our network. We can also use it to turn a connection to the network on or off (and more). Here's how to disable and then enable a connection on a machine. Note that **enp0s3** is the name of my network card/device. You'd have to replace it with the name of yours. If it's a wireless card, it might begin with a 'w':

```
sudo ip link set enp0s3 down
sudo ip link set enp0s3 up
```

### IPv6 subnetting

We're not going to get into subnetting with IPv6, but if you're interested, this is a nice article: [IPv6 subnetting overview][ipv6_subnetting]

[ipv6_subnetting]:https://supportforums.cisco.com/document/66991/ipv6-subnetting-overview-and-case-study

### ICMP

*ICMP* or Internet Control Message Protocol is a protocol used to send error messages, e.g., to check if a host is down. When we use *ping*, we're using the ICMP protocol. Data is not usually sent over this protocol. To ping a remote server, like *google.com*, we can do:

```
ping -c3 google.com
```

## Transport Layer

*TCP* or Transmission Control Protocol is responsible for the transmission of data and for making sure the data arrives at its destination w/o errors. If there are errors, the data is re-transmitted or halted in case of some failure.

*UDP* or User Datagram Protocol performs a similar function as TCP, but it doesn't error check. If data is lost, then it's lost but is still sent. UDP is useful for conducting voice over internet calls or for streaming video, such as through YouTube, because the human brain can tolerate some video and audio loss without losing too much information. In fact, YouTube uses a type of UDP transmission called QUIC, which adds a level of encryption to the protocol. QUIC was developed by Google and is the main part of the next generation of [HTTP/3][http3]. In the near future, it seems that we'll all be using IP/UDP instead of IP/TCP as the primary method of exchanging data over the Internet.

[http3]:https://en.wikipedia.org/wiki/HTTP/3

The above protocols, as well as others, each contain [header][http_headers] information. We can see a lot of this information using the ``tcpdump`` command, which requires ``sudo`` or being **root** to use. The first part of the IP header contains the source address, then comes the destination address, and so forth. Aside from a few other parts, this is the primary information in an IP header.

[http_headers]:https://en.wikipedia.org/wiki/List_of_HTTP_header_fields

```
sudo tcpdump host IP-NUMBER
```

To use it, we first identify the IP number of a host, which we can do with the ``ping`` command, and then run ``tcpdump``:

```
ping -c1 www.google.com
sudo tcpdump host 142.250.191.196
```

While that's running, we can put that IP address in our web browser and watch the output of ``tcpdump``.

TCP and UDP headers will contain more information in those headers. They also include port information and other mandatory fields for both source and destination servers. The SYN, or synchronize, message is sent when a source or client requests a connection. The ACK, or acknowledgment, message is sent in response, along with a SYN message, to acknowledge the request for a connection. Then the client responds with an additional ACK message. This is referred to as the [TCP three-way handshake][tcphandshake]. In addition to the header info, TCP and UDP packets include the data that's being sent (e.g., a webpage) and error checking if it's TCP.

[tcphandshake]:https://www.geeksforgeeks.org/tcp-3-way-handshake-process/

A *port* associates a process with a network service, such as a web service. Ports provide a way to distinguish and filter all traffic through an IP address. E.g., all traffic going to IP address X.X.X.X:80, where the Xs indicate the IP address and the **:80** indicates the port number, indicates that this is http traffic for the http web service, since http is commonly associated with port 80. Note that the port info is attached to the end of the IP address via a colon. Other common ports include:

- 21: FTP
- 22: SSH
- 25: SMTP
- 53: DNS
- 143: IMAP
- 443: HTTPS
- 587: SMTP Secure
- 993: IMAP Secure

There's a complete list of the 317 default ports on your Linux systems. It's located in the following file:

```
less /etc/services
```

And to get a count of the ports, we can invert grep for lines starting with a pound sign or are empty

```
grep -Ev "^#|^$" /etc/services | wc -l
```

See also the Wikipedia page: [List of TCP and UDP port numbers][port_numbers]

[port_numbers]:https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

## IP Subnetting

### Private IP Ranges

Remember, when subnetting, we primarily work with the following private IP ranges:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

### IP Meaning

An IP address is 32 bits (8 x 4), or four bytes, in size. In human readable context, it's usually expressed in the following, decimal-based, notation style:

- **192.168.1.6**
- **172.16.3.44**

Each set of numbers separated by a dot is referred to as an **octet**. An **octet** is a group of 8 **bits**. Eight **bits** equal a single **byte**. Thus, 1 gigabyte equals 8 gigabits, and 1 megabyte equals 8 megabits, just as 1 byte equals 8 bits. We use the symbols to note the terms:

| Term  | Symbol |
|-------|--------|
| bit   | *b*    |
| byte  | B      |
| octet | *o*    |

Each bit is represented by either a 1 or a 0. For example, the first address above in binary is:

- 11000000.10101000.00000001.00000110
- 192.168.1.6

Or:

- 11000000 = 192
- 10101000 = 168
- 00000001 = 1
- 00000110 = 6

### IP Math

When doing IP math, one easy way to do it is to simply remember that each bit in each of the above bytes is a placeholder for the following values:

```
128 64 32 16 8 4 2 1
```

Alternatively, from low to high:

| base-2 | Output |
|--------|--------|
| 2^0    | 1      |
| 2^1    | 2      |
| 2^2    | 4      |
| 2^3    | 8      |
| 2^4    | 16     |
| 2^5    | 32     |
| 2^6    | 64     |
| 2^7    | 128    |

In binary, 192 is equal to 11000000. It's helpful to work backward. For IP addresses, all octets are 255 or less (256 total, from 0 to 255) and therefore do not exceed 8 bits or places. To convert the integer 192 to binary:

```
1 * 2^7 = 128
1 * 2^6 =  64 (128 + 64 = 192)
```

STOP: There are no values left, and so the rest are zeroes.

So: 11000000

Our everyday counting system is base-10, but binary is base-2, and thus another way to convert binary to decimal is to multiple each bit by the power of base two and to the power of its placeholder:

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

Another way: to convert to binary, simply subtract the numbers from each value. As long as there is something remaining or the placeholder equals the remainder of the previous subtraction, then the bit equals 1. So:

- 192 - 128 = 64 -- therefore the first bit is equal to 1.
- Now take the leftover and subtract it:
- 64 - 64 = 0 -- therefore the second bit is equal to 1.

Since there is nothing remaining, the rest of the bits equal 0.

**NOTE**: show more examples

### Subnetting Examples

Subnetting involves dividing a network into two or more subnets. When we subnet, we need to first identify the number of hosts we will require on the subnet. For starters, let's assume that we need a subnet that can assign at most 254 IP addresses to the devices attached to it via the router.

We also need two additional IP addresses: the **subnet mask** and the **network address/ID**. The **network address** identifies the network and the **subnet mask** marks the boundary between the network and the hosts. Knowing or determining the **subnet mask** will allow us to determine how many hosts can exist on a network. Both the **network address** and the **subnet mask** can be written as IP addresses, but they cannot be assigned to computers on a network.

Finally, when we have these IPs, we will also know the **broadcast address**. This is the last IP address in a subnet range, and it cannot be assigned to a connected device. The **broadcast address** is used by a router, for instance, to communicate to all connected devices.

For our sake, let's work backwards. We want to identify and describe a network that we are connected to. Let's work with two example private IP addresses that exist on two separate subnets:

**IP addresses:**

- 192.168.1.6/24:  Some Desktop 1, Subnet A
- 10.160.38.75/24: Some Desktop 1, Subnet B

#### Example 1: 192.168.1.6 : Desktop 1, Subnet A

Let's derive the network mask and the network address (or ID) from this IP address.

```
11000000.10101000.00000001.00000110 IP              192.168.1.6
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
11000000.10101000.00000001.00000000 Network Address 192.168.1.0
```

Note the mask has 24 ones followed by 8 zeroes. That 24 is used as CIDR notation, so:

192.168.1.6/24

#### Example 2: 10.160.38.75 : Desktop 1, Subnet B

```
00001010.10100000.00100110.01001011 IP               10.160.38.75
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
00001010.10100000.00100110.00000000 Network Address   10.160.38.0
```

For Desktop 1, Subnet A, we have the following:

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 192.168.1.0   |
| Start Range  | 192.168.1.1   |
| End Range    | 192.168.1.254 |
| Broadcast    | 192.168.1.255 |

For Desktop 1, Subnet B, we have the following

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 10.160.38.0   |
| Start Range  | 10.160.38.1   |
| End Range    | 10.160.38.254 |
| Broadcast    | 10.160.38.255 |

#### Example 3: 172.16.1.62/24

Derive the network information for 172.16.1.62/24:

```
10101100 00010000 00000001 00100111 IP                172.16.1.62
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

#### Example 4: 10.0.5.23/16

This is an example of a subnet with more possible hosts.

| base-2 | Output |
|--------|--------|
| 2^0    | 1      |
| 2^1    | 2      |
| 2^2    | 4      |
| 2^3    | 8      |
| 2^4    | 16     |
| 2^5    | 32     |
| 2^6    | 64     |
| 2^7    | 128    |

```
10.0.5.23/16

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

Hosts:

| IPs          |         |
|--------------|---------|
| 10.0.0.1     |         |
| 10.0.0.255   | = 256   |
| 10.0.1.1     |         |
| 10.0.255.255 | = 256   |

- Number of Hosts = 256 x 256 = 65536
- Subtract Network ID (1) and Broadcast (1) = 2 IP addresses
- Number of Usable Hosts = 256 x 256 - 2 = 65534
