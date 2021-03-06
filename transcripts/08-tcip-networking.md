# Networking

## Link Layer

### ARP (Address Resolution Protocol)

*ARP* or Address Resolution Protocol is a protocol used to map a network
address like the IP address to the ethernet address (MAC, Media Access Control
address or hardware address). Routers use MAC addresses to enable communication
inside networks (w/in subnets) so that computers within a local area network
talk to each other. But also, networks are designed so that IP addresses must
be associated with MAC addresses before systems can communicate over a network.

In order to get ARP info for a system, we can use the ``ip`` command. Here's
the ARP output and routing table on my Fedora virtual machine (**10.0.2.15**)
running on my desktop via a bridged connection:

```
$ ip neigh show
10.0.2.2 dev enp0s3 lladdr 52:54:00:12:35:02 REACHABLE
10.0.2.3 dev enp0s3 lladdr 52:54:00:12:35:03 STALE
$ ip route show
default via 10.0.2.2 dev enp0s3 proto dhcp metric 100
10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15 metric 100
```

Where:

- **10.0.2.15** is the IP address of my fedora server **10.0.2.2** is the first
- usable address on subnet, and is likely the
  router; likewise, **52...02** is the hardware address for that virtual router
- **10.0.2.0** is called the **network address**, which is a unique
  identifier IP address for the subnet

In short, for network traffic to get to the internet, the Fedora machine must
know where the router (another computer) is located on the network and must
know what the router's hardware (MAC) address.

## Internet Layer

### IP (Internet Protocol)

*IP* is a way to uniquely identify a host on a network. If that network is
subnetted (i.e., routed), then a host's IP address will have a subnet or
private IP address that will not be directly exposed to the Internet.

There are IP address ranges that are private by default and by design. The
default subnet or private addresses ranges include:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

If you have a router at home, and look at the IP address for your phone or
computer that's connected to that router, then it will have an address within
one of the ranges above, and perhaps it will have an IP address beginning with
**192.168.X.X**. This a standard IP address range for a home router. The
**10.X.X.X** private range can, by design, assign many more IP addresses, which
is why you'll see that IP range on bigger networks, like UK's.

At work, my IP address on my desktop was **10.163.34.59/24** (``ip a``), via
a wired connection (eno1) and my office neighbor's IP address was
**10.163.34.65/24**. This shows that we're both on the same subnet, but if we
both, using our respective wired connected computers, Google 'what's my IP
address', then we both get back a public IP address of **128.163.8.25**. This
is the same for the virtual machine I'm using that's running Fedora 30,
connected via a bridge network.

Thus, w/o any additional information, we know that all traffic coming from our
computers and going out to the Internet looks like it's coming from the same IP
address (**128.163.8.25**). And in reverse, all traffic coming from outside our
network first goes to **128.163.8.25** before it's routed to our respective
computers.

On the other hand, my laptop, just a few feet away from me, was, when
I originally wrote this, connected to UK wireless (eduroam), and not wired, and
had this IP address: **10.47.34.150/16** (wlp3s0). You can see there's
a different pattern with this IP address. The reason it has a different pattern
is because this laptop is on an different subnet and it's one that allows more
hosts to connect to it, which makes sense, since we can't necessarily predict
how many wireless devices will need to connect via it. In the meantime, if
I use a browser on this laptop and ask Google for my IP address, it tells me:
**128.163.238.148**, which shares the same IP pattern as the one above.

### Routing

On my virtual machine on my desktop (NAT connection), I can see the network
information for my machine (some output removed / truncated for clarity) with
the ``ip`` command:

```
$ ip a
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:e1:b5:c8 brd ff:ff:ff:ff:ff:ff
    inet 10.0.2.15/24 brd 10.0.2.255 scope global dynamic noprefixroute enp0s3
       valid_lft 690726sec preferred_lft 690726sec
    inet6 fe80::22da:ba7f:d634:2493/64 scope link dadfailed tentative noprefixroute
       valid_lft forever preferred_lft forever
    inet6 fe80::f084:e92e:908e:2d0c/64 scope link noprefixroute
       valid_lft forever preferred_lft forever
```

In the meantime, here's the routing table on my Fedora VM via a bridged
connection (not NAT):

```
$ ip route
default via 10.163.34.1 dev enp0s3 proto dhcp metric 100
10.163.34.0/24 dev enp0s3 proto kernel scope link src 10.163.34.118 metric 100
```

And then on my physical machine:

```
$ ip route
default via 10.163.34.1 dev eno1 proto dhcp metric 100
10.163.34.0/24 dev eno1 proto kernel scope link src 10.163.34.59 metric 100
169.254.0.0/16 dev eno1 scope link metric 1000
192.168.122.0/24 dev virbr0 proto kernel scope link src 192.168.122.1 linkdown
```

Since both machines are on the same network, they both state the following path:

1. all packets originating at **10.163.34.118** (for Fedora VM) or
   **10.163.34.59** (for physical machine) are routed through **10.163.34.1**
   on the subnet defined as **10.163.34.0/24**.
1  In the second ``ip route`` output, you'll notice the IP address
   **169.254.0.0/16**. This is called the [link-local][rfc3927] address. This is
   a local address that is assigned to a device in the absence of either static
   or dynamic IP assignment (via, e.g., a router).
1. The **192.168.122.0/24** info is from VirtualBox.

Here's kind of visual diagram of what this network looks like:

![network diagram](network.png)

### Using the ``ip`` command

The ``ip`` command can do more than simply provide us information about our
network. We can also use it to turn a connection to the network on or off (and
more). Here's how to disable and then enable a connection on a machine. Note
that **enp0s3** is the name of my network card/device. You'd have to replace it
with the name of yours. If it's a wireless card, it might begin with a 'w':

```
sudo ip link set enp0s3 down
sudo ip link set enp0s3 up
```

### IPv6 subnetting

We're not going to get into subnetting with IPv6, but if you're interested,
this is a nice article: [IPv6 subnetting overview][ipv6_subnetting]

### ICMP

*ICMP* or Internet Control Message Protocol is a protocol used to send error
messages, e.g., to check if a host is down. When we use *ping*, we're using the
ICMP protocol. Data is not usually sent over this protocol.

```
ping google.com
```

## Transport Layer

*TCP* or Transmission Control Protocol is responsible for the transmission of
data and for making sure the data arrives at its destination w/o errors.

*UDP* or User Datagram Protocol performs a similar function as TCP, but it
doesn't error check. If data is lost, then it's lost but is still sent. UDP is
useful for conducting voice over internet calls or for streaming video, such as
through YouTube. In fact, YouTube uses a type of UDP transmission called QUIC,
which adds a level of encryption to the protocol. QUIC was developed by Google
and is the main part of the next generation of [HTTP/3][http3]. In the near future,
it seems that we'll all be using IP/UDP instead of IP/TCP as the primary method
of exchanging data over the Internet.

The above protocols, as well as others, each contain [header][http_headers] information.
We can see a lot of this information using the ``tcpdump`` command, which
requires ``sudo`` or being **root** to use. The first part of the IP header
contains the source address, then comes the destination address, and so forth.
Aside from a few other parts, this is the primary information in an IP header.

```
sudo tcpdump host IP-NUMBER
```

TCP and UDP headers will contain a bit more information, including port
information for both source and destination, sequence (SYN) information for
data packets, acknowledgment (ACK) information for the ACK number, as well as
data and error checking if it's TCP.

A *port* associates a process with a network service. Ports provide a way to
distinguish and filter all traffic through an IP address. E.g., all traffic
going to IP address X.X.X.X:80 indicates that this is http traffic for the http
web service. Note that the port info is attached to the end of the IP address
via a colon. Other common ports include:

- 21: FTP
- 22: SSH
- 25: SMTP
- 53: DNS
- 143: IMAP
- 443: HTTPS
- 587: SMTP Secure
- 993: IMAP Secure

There's a complete list of the 1000s of hard coded ports on your Linux systems
and it's located in the following file:

```
less /etc/services
```

See also the Wikipedia page: [List of TCP and UDP port numbers][port_numbers]

## Some basic IP subnetting

### Private IP Ranges

Remember, when subnetting, we primarily will work with private IP ranges:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

### IP Meaning

An IP address is 32 bits (8 x 4), or four bytes, in size. In human readable
context, it's usually expressed in the following notation style:

- **192.168.1.6**
- **172.16.3.44**

Each set of numbers separated by a dot is referred to as an **octet**, and an
**octet** is a group of 8 **bits**. Eight **bits** also equal a single
**byte**.

| Term  | Symbol |
|-------|--------|
| bit   | *b*    |
| byte  | B      |
| octet | *o*    |

Each bit is represented by either a 1 or a 0. For example, the first address
above in binary is:

- 11000000.10101000.00000001.00000110
- 192.168.1.6

Or:

- 11000000 = 192
- 10101000 = 168
- 00000001 = 1
- 00000110 = 6

### IP Math

When doing IP math, one easy way to do it is to simply remember that each bit
in each of the above bytes is a placeholder for the following values:

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

In binary, 192 is equal to 11000000. It's helpful to work backward. For IP
addresses, all octets are 255 or less (256 total, from 0 to 255) and therefore
do not exceed 8 bits or places:

```
1 * 2^7 = 128
1 * 2^6 =  64 (128 + 64 = 192)
```

STOP: There are no values left, and so the rest are zeroes.

So: 11000000

Our everyday counting system is base-10, but binary is base-2, and so another
way to convert binary to decimal is to multiple each bit by the power of base
two and to the power of its placeholder:

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

Another way: to convert to binary, simply subtract the numbers from each value.
As long as there is something remaining or the placeholder equals the remainder
of the previous subtraction, then the bit equals 1. So:

- 192 - 128 = 64 -- therefore the first bit is equal to 1.
- Now take the leftover and subtract it:
- 64 - 64 = 0 -- therefore the second bit is equal to 1.

Since there is nothing remaining, the rest of the bits equal 0.

**NOTE**: show more examples

### Subnetting

Subnetting involves dividing a network into two or more subnets. When we
subnet, we need to first identify the number of hosts we will require on the
subnet. For starters, let's assume that we need a subnet that can assign at
most 254 IP addresses to the devices attached to it via the router.

We also need two additional IP addresses: the **subnet mask** and the **network
address/ID**. The **network address** identifies the network and the **subnet
mask** marks the boundary between the network and the hosts. Knowing or
determining the **subnet mask** will allow us to determine how many hosts can
exist on a network. Both the **network address** and the **subnet mask** can be
written as IP addresses, but they cannot be assigned to computers on a network.

Finally, when we have these IPs, we will also know the **broadcast address**.
This is the last IP address in a subnet range, and it cannot be assigned to
a connected device. The **broadcast address** is used by a router, for
instance, to communicate to all connected devices, and is comparable to the MAC
address that we learned about in our discussion on the link layer and ARP.

For our sake, let's work backwards, though, and say we want to identify and
describe a network that we are connected to. Let's work with two example
private IP addresses that exist on two separate subnets:

**IP addresses:**

- 192.168.1.6/24:  Some Desktop 1, Subnet A
- 10.160.38.75/24: Some Desktop 1, Subnet B

#### Example 1: 192.168.1.6 : Desktop 1, Subnet A

Let's derive the network mask and the network address (or ID) from this IP
address.

```
11000000.10101000.00000001.00000110 IP              192.168.1.6
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
11000000.10101000.00000001.00000000 Network Address 192.168.1.0
```

Note the mask has 24 ones followed by 8 zeroes. That 24 is used as CIDR
notation, so:

192.168.1.6/24

#### Example 2: 10.160.38.75 : Desktop 1, Subnet B

```
00001010.10100000.00100110.01001011 IP               10.160.38.75
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
00001010.10100000.00100110.00000000 Network Address   10.163.38.0
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
| Network ID   | 10.163.38.0   |
| Start Range  | 10.163.38.1   |
| End Range    | 10.163.38.254 |
| Broadcast    | 10.163.38.255 |

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

[rfc3927]:https://tools.ietf.org/html/rfc3927.html
[ipv6_subnetting]:https://supportforums.cisco.com/document/66991/ipv6-subnetting-overview-and-case-study
[http3]:https://en.wikipedia.org/wiki/HTTP/3
[http_headers]:https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
[port_numbers]:https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

