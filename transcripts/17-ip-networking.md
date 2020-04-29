# Networking

## Link Layer

### ARP (Address Resolution Protocol)

*ARP* or Address Resolution Protocol is used to map a network address like the
IP address to the ethernet address (MAC, Media Access Control address or
hardware address). Routers use MAC addresses to enable communication inside
networks (w/in subnets) so that computers within a local area network talk to
each other. 

Here's the ARP output and routing table on my Fedora virtual machine
(**10.163.34.118**) running on my desktop via a bridged connection:

```
$ ip neigh show
10.163.34.59 dev enp0s3 lladdr fc:4d:d4:39:f8:e8 REACHABLE
10.163.34.1 dev enp0s3 lladdr 2c:5a:0f:26:2d:c0 REACHABLE
$ ip route show
default via 10.163.34.1 dev enp0s3 proto dhcp metric 100 
10.163.34.0/24 dev enp0s3 proto kernel scope link src 10.163.34.118 metric 100
```

Where:

- **10.163.34.59** is the IP address of my physical desktop, and **fc:4d...**
  is the hardware address for that machine
- **10.163.34.1** is the first usable address on subnet, and is likely the
  router; likewise, **2c:5a...** is the hardware address for that router
- **10.163.34.0** is called the **network address**, which is a unique
  identifier IP address for the subnet


In short, for network traffic to get to the internet, the Fedora machine must
know where the router (another computer) is located on the network and must
know what hardware address that router's has.

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
computer that's connected to that router, then it will likely have an IP
address beginning with **192.168.X.X**. This a standard IP address range for
a home router. The **10.X.X.X** private range can, by design, can assign many
more IP addresses, which is why you'll see that IP range on bigger networks,
like UK's.

At work, my IP address on my desktop is **10.163.34.59/24** (``ip a``), via
a wired connection (eno1) and my office neighbor's IP address is
**10.163.34.65/24**. We're both on the same subnet, but if we both, using our
respective wired connected computers, Google 'what's my IP address', then we
both get back a public IP address of **128.163.8.25**. This is the same for the
virtual machine I'm using that's running Fedora 30, connected via a bridge
network.

Thus, w/o any additional information, we know that all traffic coming from our
computers and going out to the Internet looks like it's coming from the same IP
address (**128.163.8.25**). And in reverse, all traffic coming from outside our
network first goes to **128.163.8.25** before it's routed to our respective
computers.

On the other hand, my laptop, just a few feet away from me, is connected to UK
wireless (eduroam), and not wired, and has this IP address: **10.47.34.150/16**
(wlp3s0). You can see there's a different pattern with this IP address. The
reason it has a different pattern is because this laptop is on an different
subnet and it's one that allows more hosts to connect to it, which makes sense,
since we can't necessarily predict how many wireless devices will need to
connect via it. In the meantime, if I use a browser on this laptop and ask
Google for my IP address, it tells me: **128.163.238.148**, which shares the
same IP pattern as the one above.

### Routing

On my virtual machine on my desktop (bridge connection), I can see the network
information for my machine (some output removed / truncated for clarity) with
the ``ip`` command:

```
$ ip a
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:d8:4a:29 brd ff:ff:ff:ff:ff:ff
    inet 10.163.34.118/24 brd 10.163.34.255 scope global dynamic noprefixroute enp0s3
       valid_lft 690726sec preferred_lft 690726sec
    inet6 fe80::7eb3:b403:91d5:c491/64 scope link dadfailed tentative noprefixroute 
       valid_lft forever preferred_lft forever
    inet6 fe80::f084:e92e:908e:2d0c/64 scope link noprefixroute 
       valid_lft forever preferred_lft forever
```

Alternatively, we can use ``ifconfig``, but this command is slowly being
replaced by the ``ip`` command and is not available by default on Ubuntu
anymore:

```
$ ifconfig
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.163.34.118  netmask 255.255.255.0  broadcast 10.163.34.255
        inet6 fe80::f084:e92e:908e:2d0c  prefixlen 64  scopeid 0x20<link>
        inet6 fe80::7eb3:b403:91d5:c491  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:d8:4a:29  txqueuelen 1000  (Ethernet)
        RX packets 23713  bytes 6743999 (6.4 MiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3270  bytes 306122 (298.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

The above two commands report IP information a little differently. The ``ip a``
reports that my IP address is:

``inet 10.163.34.118/24``

That information includes both the IP address, the netmask information, and the
broadcast information. That is, that **/24** is important info.

With ``ifconfig``, the information is reported in three parts:

- inet 10.163.34.118
- netmask 255.255.255.0
- broadcast 10.163.34.255

We'll learn how to interpret and derive this information next week.

In the meantime, here's the routing table on my Fedora Bridge VM:

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
2. In the second ``ip route`` output, you'll notice the IP address
   **169.254.0.0/16**. This is called the [link-local][2] address. This is
   a local address that is assigned to a device in the absence of either static
   or dynamic IP assignment (via, e.g., a router).
3. The **192.168.122.0/24** info is from VirtualBox.

Here's kind of visual diagram of what this network looks like:

![network diagram](network.png)

### Using the ``ip`` command

The ``ip`` command can do more than simply provide us information about our
network. We can also use it to turn a connection to the network on or off
Here's how to disable and then enable a connection on a machine. Note that
**enp0s3** is the name of my network card/device. You'd have to replace it with
the name of yours. If it's a wireless card, it should begin with a 'w':

```
sudo ip link set enp0s3 down
sudo ip link set enp0s3 up
```

### IPv6 subnetting

We're not going to get into subnetting with IPv6, but if you're interested,
this is a nice article: [IPv6 subnetting overview][3]

### ICMP

*ICMP* or Internet Control Message Protocol is a protocol used to send error
messages, e.g., to check if a host is down. When we use *ping*, we're using the
ICMP protocol. Data is not usually sent over this protocol.

## Transport Layer

*TCP* or Transmission Control Protocol is responsible for the transmission of
data and for making sure the data arrives at its destination w/o errors.

*UDP* or User Datagram Protocol performs a similar function as TCP, but it
doesn't error check. If data is lost, then it's lost but it's still sent. UDP
is useful for conducting voice over internet calls or for streaming video, such
as through YouTube. In fact, YouTube uses a type of UDP transmission called
QUIC, which adds a level of encryption to the protocol. QUIC was developed by
Google and is the main part of the next generation of [HTTP/3][4]. In the near
future, we'll all be using IP/UDP instead of IP/TCP as the primary method of
exchanging data over the Internet.

The above protocols, as well as others, each contain [header][5] information.
The first part of the header contains the source address, then comes the
destination address, and so forth. Aside from a few other parts, this is the
primary information in an IP header.

TCP and UDP headers will contain a bit more information, including port 
information for both source and destination, sequence (SYN) information for 
data packets, acknowledgment (ACK) information for the ACK number, as well as 
data and error checking if it's TCP.

A *port* associates a process with a network service. Ports provide a way to
distinguish and filter all traffic through an IP address. E.g., all traffic
going to IP address X.X.X.X:80 indicates that this is http traffic for the http
service. Note that the port info is attached to the end of the IP address via
a colon. Other common ports include:

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

See also the Wikipedia page: [List of TCP and UDP port numbers][1]

[1]:https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
[2]:https://tools.ietf.org/html/rfc3927.html
[3]:https://supportforums.cisco.com/document/66991/ipv6-subnetting-overview-and-case-study
[4]:https://en.wikipedia.org/wiki/HTTP/3
[5]:https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
