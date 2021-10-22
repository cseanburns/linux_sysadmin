## Linux Firewalls

See NFTABLES for changes to the firewall software

Netfilter is a part of the kernel that includes a suite of applications that
help manage how packets flow in and out of a server or internet connected
device. ``iptables`` is the command line user interface to **netfilter** and is
one of the main firewall applications on many Linux distributions.

Fedora/RedHat offers a more user friendly interface to ``iptables`` called
``firewall-cmd`` that I'll discuss below. Ubuntu offers its own more user
friendly interface called ``ufw``. In this lecture, I'll discuss ``iptables``
and ``firewall-cmd``.

### iptables

There are five predefined tables (*operations*) and five chains that come with
``iptables``. Tables define the kinds of operations that you can use to control
the firewall and therefore the packets that come in and out of the system or
through a system. The *filter* and *nat* tables are the most commonly used
ones.

The five *chains* are lists of rules that act on packets flowing through the
system. Finally, there are also *targets*. These are the actions to be
performed on packets. The main targets include **ACCEPT**, **DROP**, and
**RETURN**.

From ``man iptable``, the tables and respective chains include:

- filter (the default table)
  - INPUT: for packets destined to local sockets
  - FORWARD: for packets being routed through the box
  - OUTPUT: for locally-generated packets
- nat
  - PREROUTING: for altering packets as soon as they come in
  - INPUT: for altering packets destined for local sockets
  - OUTPUT: for altering locally-generated packets
  - POSTROUTING: for altering packets as they are about to go out
- mangle
  - PREROUTING
  - OUTPUT
  - INPUT
  - FORWARD
  - POSTROUTING
- raw
  - PREROUTING
  - OUTPUT
- security
  - INPUT
  - OUTPUT
  - FORWARD

We'll cover the filter tables and the nat tables.

#### Usage

First, we can look at the default parameters for the *filter* table. You need
to be root to run this commands, or use ``sudo``:

```
sudo su
# -L: List all rules in the selected chain;
# if no chain is selected, then list all chains; and,
# -v: be verbose
iptables -L -v | less
iptables -L | grep policy
```

#### Allow connections only from subnet

We can change the firewall to only allow communication on a subnet. Of course,
in order to do this, we need the subnet **Network ID** and the **CIDR** number:

```
ip a
```

Now that we have the Network ID and the CIDR number, we can set the firewall:

```
# comment: first, set policy to drop all incoming, forwarding, and outgoing
# packets; this means we're starting from a baseline
iptables --policy INPUT DROP
iptables --policy FORWARD DROP
iptables --policy OUTPUT DROP

# comment: review new policies for the above chains
iptables -L | grep policy

# comment: now accept only input, forwarding, and output from the following
# comment: network ranges:

iptables -A INPUT -s 10.163.34.0/24 -j ACCEPT
iptables -A FORWARD -s 10.163.34.0/24 -j ACCEPT
iptables -A OUTPUT -s 10.163.34.0/24 -j ACCEPT
```

To test this, we can try to connect to a remote server:

```
w3m https://www.google.com
```

There are lots of examples on the web. Examples from:

- [http://www.tecmint.com/linux-iptables-firewall-rules-examples-commands/][iptables-examples]
- [https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/][iptables-beginners]

#### PREROUTING

Here is another example where we forward all traffic to port 25 to port 2525.
Here we use the **NAT** table, since NAT is responsible for network address
translation:

```
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 25 -j REDIRECT --to-port 2525
```

#### OUTPUT

Here is another example where we disable outgoing email by disabling the ports
that are commonly associated with email. Of course, this could be bypassed by
using non-standard ports for email, but for out cases, it's a decent
demonstration:

```
## iptables -A OUTPUT -p tcp --dports 25,465,587 -j REJECT
```

### firewall-cmd

[firewall-cmd documentation][firewall_cmd]

**firewalld** is a slightly more user friendly interface to netfilters/iptables
in Red Hat based distros.

Zones are an important concept in firewalld. Some predefined zones:

- DROP : strictest. All incoming network packets are dropped
- BLOCK : all very strict
- PUBLIC : only selected incoming connections are accepted. Good zone for web
  server, email server, etc.
- EXTERNAL : external networks (useful for NAT)
- DMZ : computers located in DMZ
- work : trust most computers in network and accept some services
- home : trust most computers in network and accept some services
- trusted : trust all machines in network

Check if running:

```
firewall-cmd --state
```

Get active zones and interfaces attached to them:

```
firewall-cmd --get-zones
firewall-cmd --get-default-zone
firewall-cmd --get-active-zones
FedoraServer
  interfaces: enp0s3
```

Allow port 22, list ports, remove services by name, add services by name:

```
firewall-cmd --zone=FedoraServer --add-port=22/tcp
firewall-cmd --zone=FedoraServer --list-ports
firewall-cmd --zone=FedoraServer --remove-service=ssh --permanent
firewall-cmd --zone=FedoraServer --add-service=smtp --permanent
firewall-cmd --reload
```

Go into panic mode (drop all incoming/outgoing packets):

```
firewall-cmd --panic-on
firewall-cmd --panic-off
```

To change default zone:

```
firewall-cmd --permanent --set-default-zone=public
```


[firewall_cmd]:https://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/sect-Security_Guide-Using_Firewalls.html
[iptables-examples]:http://www.tecmint.com/linux-iptables-firewall-rules-examples-commands/
[iptables-beginners]:https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/
