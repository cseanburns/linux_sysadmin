# Networking

Wikipedia has a good primer on the [Internet protocol suite][wikiips].

[wikiips]:https://en.wikipedia.org/wiki/Internet_protocol_suite

## Link Layer

### ARP (Address Resolution Protocol)

*ARP* or Address Resolution Protocol is a protocol used to map a network address, like the IP address, to the ethernet address (aka, the MAC or Media Access Control address, or the hardware address). Routers use MAC addresses to enable communication inside networks (w/in subnets) so that computers within a local network can talk to each other. Networks are designed so that IP addresses must be associated with MAC addresses before systems can communicate over a network.

To get ARP info for a system, we can use the ``ip`` command, which uses regular options (like ``-b``) but also various **objects** (see ``man ip`` for details). Here is the IP info, the ARP output, and the routing table on my Fedora virtual machine (**10.0.2.15**) running on my desktop via a NAT connection:

```
ip a
ip neigh show
ip route show
```

Where:

- **10.0.2.15** is the IP address of my fedora server
- **10.0.2.2** is the first usable address on subnet, and is likely the virtual router; likewise, **52:54:00:12:35:02** is the MAC/hardware address for that virtual router
- **10.0.2.0** is called the **network address (signified by the /24 part)**, which is a unique identifier IP address for the subnet

The above information is used or created in the following way: A router gets configured to use a specific **network address**, when it's brought online, it searches the network for connected MAC addresses that are assigned to wireless or ethernet cards, it assigns to each of those MAC addresses an available IP address based on the network address,

## Internet Layer

### IP (Internet Protocol)

The Internet Protocol, or *IP*, address is used to uniquely identify a host on a network and place that host at a specific location (its IP **address**). If that network is subnetted (i.e., routed), then a host's IP address will have a subnet or private IP address that will not be directly exposed to the Internet.

These IP address ranges are reserved, private address ranges, which means no public internet device will have an IP address within these ranges. The private address ranges include:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

If you have a router at home, and look at the IP address for at any of your devices connected to that router, like your phone or computer, you will see that it will have an address within one of the ranges above. For example, it might have an IP address beginning with **192.168.X.X**. This a standard IP address range for a home router. The **10.X.X.X** private range can assign many more IP addresses on its network. This is why you'll see that IP range on bigger networks, like UK's. We'll talk more about subnetwork sizes, shortly.

### Example Private IP Usage

At work, at one time, the IP address on my desktop was **10.163.34.59/24** via a wired connection. I checked with my office neighbor and found that their desktop reported an IP address of **10.163.34.65/24**. These are on the same subnet, and later I will show you how this works.

At the time, if we both, using our respective wired connected computers, searched Google for *[ what's my IP address ]*, we will see that we share the same public IP address of **128.163.8.25**.

Without any additional information, this tells us that we know that all traffic coming from our computers and going out to the internet looks like it's coming from the same IP address (**128.163.8.25**). And in reverse, all traffic coming from outside our network first goes to **128.163.8.25** before it's routed to our respective computers via the router.

My laptop tells a different story because it is connected to UK wireless (eduroam). At the time of this writing, the laptop had the IP address **10.47.34.150/16**. You can see there's a different pattern with this IP address. The reason it has a different pattern is because this laptop is on an different subnet. This wireless subnet was configured to allow more hosts to connect to it since it must allow for more devices (i.e., laptops, phones, etc). When I searched Google for my IP address from this laptop, it reported **128.163.238.148**, indicating that UK owns a range of public IP address spaces.

Here's kind of visual diagram of what this network looks like:

| ![network diagram](18-network.png) |
|:--:|
| <b>Fig. 1. This figure contains a network switch, which is used to route traffic within a subnet. It relies solely on MAC addresses and not IP addresses to determine the location of devices on its subnet. The router is capable of transferring data across networks.</b>|

### Using the ``ip`` Command

The ``ip`` command can do more than provide us information about our network. We can also use it to turn a connection to the network on or off (and more). Here is how to disable and then enable a connection on a machine. Note that **enp0s3** is the name of my network card/device. Yours might have a different name.

```
sudo ip link set enp0s3 down
sudo ip link set enp0s3 up
```

## Transport Layer

### UDP, User Datagram Protocol

*UDP* or User Datagram Protocol performs a similar function as TCP, but it does not error check and data may get lost. UDP is useful for conducting voice over internet calls or for streaming video, such as through YouTube, which uses a type of UDP transmission called QUIC that has builtin encryption. 
 
### TCP, Transmission Control Protocol

*TCP* or Transmission Control Protocol is responsible for the transmission of data and for making sure the data arrives at its destination w/o errors. If there are errors, the data is re-transmitted or halted in case of some failure. Much of the data sent over the internet is sent using TCP.

### TCP and UDP Headers

The above protocols send data in data packets (TCP) or datagrams (UDP), but [these terms may be used interchangeably][headers]. Packets for both protocols include header information to help route the data across the internet. TCP includes [ten fields][tcpfields] of header data, and UDP includes [four fields][udpfields].

[headers]:https://www.cloudflare.com/learning/network-layer/what-is-a-packet/
[tcpfields]:https://www.imperva.com/learn/ddos/tcp-transmission-control-protocol/
[udpfields]:https://www.imperva.com/learn/ddos/udp-user-datagram-protocol/

We can see this header data using the ``tcpdump`` command, which requires ``sudo`` or being **root** to use. The first part of the IP header contains the source address, then comes the destination address, and so forth. Aside from a few other parts, this is the primary information in an IP header.

To use ``tcpdump``, we first identify the IP number of a host, which we can do with the ``ping`` command, and then run ``tcpdump``:

```
ping -c1 www.uky.edu
sudo tcpdump host 128.163.35.46
```

While that's running, we can type that IP address in our web browser, or enter **www.uky.edu**, and watch the output of ``tcpdump``.

TCP headers include port information and other mandatory fields for both source and destination servers. The SYN, or synchronize, message is sent when a source or client requests a connection. The ACK, or acknowledgment, message is sent in response, along with a SYN message, to acknowledge the request for a connection. Then the client responds with an additional ACK message. This is referred to as the [TCP three-way handshake][tcphandshake]. In addition to the header info, TCP and UDP packets include the data that's being sent (e.g., a webpage) and error checking if it's TCP.

[tcphandshake]:https://www.geeksforgeeks.org/tcp-3-way-handshake-process/

### Ports

TCP and UDP connections use ports to bind internet traffic to specific IP addresses. Specifically, a *port* associates a process with an application, such as a web service or outgoing email. That is, ports provide a way to distinguish and filter internet traffic through an IP address. E.g., all traffic going to IP address 10.0.5.33:80 means that this is **http** traffic for the http web service, since http is commonly associated with port 80. Note that the port info is attached to the end of the IP address via a colon. 

Common ports include:

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

See also the Wikipedia page: [List of TCP and UDP port numbers][portnumbers]

[portnumbers]:https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

## IP Subnetting

### Private IP Ranges

When subnetting, we generally work with private IP ranges:

| Start Address | End Address     |
|---------------|-----------------|
| 10.0.0.0      | 10.255.255.255  |
| 172.16.0.0    | 172.31.255.255  |
| 192.168.0.0   | 192.168.255.255 |

#### IP Meaning

An IP address is 32 bits (8 x 4), or four bytes, in size. In human readable context, it's usually expressed in the following, decimal-based, notation style:

- **192.168.1.6**
- **172.16.3.44**

Each set of numbers separated by a dot is referred to as an **octet**. An **octet** is a group of 8 **bits**. Eight **bits** equal a single **byte**. By implication, 8 gigabits equals 1 gigabyte, and 8 megabits equals 1 megabyte. We use these symbols to note the terms:

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

STOP: There are no values left, and so the rest are zeroes. So: 11000000

Our everyday counting system is base-10, but binary is base-2, and thus another way to convert binary to decimal is to multiple each bit (1 or 0) by the power of base two of its placeholder:

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

Another way to convert to binary: simply subtract the numbers from each value. As long as there is something remaining or the placeholder equals the remainder of the previous subtraction, then the bit equals 1. So:

- 192 - 128 = 64 -- therefore the first bit is equal to 1.
- Now take the leftover and subtract it:
- 64 - 64 = 0 -- therefore the second bit is equal to 1.

Since there is nothing remaining, the rest of the bits equal 0.

### Subnetting Examples

Subnetting involves dividing a network into two or more subnets. When we subnet, we first identify the number of hosts we will require on the subnet. For starters, let's assume that we need a subnet that can assign at most 254 IP addresses to the devices attached to it via the router.

We need two additional IP addresses: the **subnet mask** and the **network address/ID**. The **network address** identifies the network and the **subnet mask** marks the boundary between the network and the hosts. Knowing or determining the **subnet mask** will allow us to determine how many hosts can exist on a network. Both the **network address** and the **subnet mask** can be written as IP addresses, but they cannot be assigned to computers on a network.

When we have determined these IPs, we will know the **broadcast address**. This is the last IP address in a subnet range, and it cannot be assigned to a connected device. The **broadcast address** is used by a router or other devices to communicate to all connected devices on the subnet.

For our sake, let's work backwards. We want to identify and describe a network that we are connected to. Let's work with two example private IP addresses that exist on two separate subnets.

#### Example 1: 192.168.1.6

Let's derive the network mask and the network address (or ID) from this IP address.

```
11000000.10101000.00000001.00000110 IP              192.168.1.6
11111111.11111111.11111111.00000000 Mask            255.255.255.0
-----------------------------------
11000000.10101000.00000001.00000000 Network Address 192.168.1.0
```

Note the mask has 24 ones followed by 8 zeroes. That 24 is used as CIDR notation:

192.168.1.6/24

For Example 1, we have the following subnet information:

| Type         | IP            |
|--------------|---------------|
| Netmask/Mask | 255.255.255.0 |
| Network ID   | 192.168.1.0   |
| Start Range  | 192.168.1.1   |
| End Range    | 192.168.1.254 |
| Broadcast    | 192.168.1.255 |

#### Example 2: 10.160.38.75

For example 2:

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

#### Example 3: 172.16.1.62/24

For example 3:

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

To determine the number of hosts on a CIDR /24 subnet, we look at the start and end ranges. In all three of the above examples, the start range begins with X.X.X.1 and ends with X.X.X.254. Therefore, there are 254 maximum hosts allowed on these subnets.

#### Example 4: 10.0.5.23/16

The first three examples show instances where the CIDR is set to /24. This only allows 254 maximum hosts on a subnet. If the CIDR is set to /16, then we can theoretically allow 65,534 hosts on a subnet. 

For example 4, then: 10.0.5.23/16

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

### IPv6 subnetting

We're not going to cover IPv6 subnetting, but if you're interested, this is a nice article: [IPv6 subnetting overview][ipv6subnetting]

[ipv6subnetting]:https://supportforums.cisco.com/document/66991/ipv6-subnetting-overview-and-case-study
