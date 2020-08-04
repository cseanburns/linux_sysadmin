# Local Security: ``chroot`` example

## ``chroot`` a current user

**Step 1**: Let's create a user first. We're imagining that we have a
preexisting user and that we need to ``chroot`` that user going forward.

```
$ sudo su
# useradd -m -U -s /bin/bash omicron
# passwd omicron
```

**Step 2**: We'll ``chroot`` *omicron* in a new directory ``/var/chroot``.

```
# mkdir /var/chroot
```

**Step 3**: Set up available binaries for the user. We'll only allow ``bash``
for now.  To do that, we'll create a ``bin/`` directory, and copy bash to that
directory.

```
# mkdir /var/chroot/bin
# which bash
/usr/bin/bash
# cp /usr/bin/bash /var/chroot/bin/
```

**Step 4**: Copy the libraries for the bash binary.

```
# ldd /usr/bin/bash
## comment: because we see that these are all lib64
# mkdir /var/chroot/lib64       
# cp /lib64/libtinfo.so.6 lib64/
# cp /lib64/libdl.so.2 lib64/
# cp /lib64/libc.so.6 lib64/
# cp /lib64/ld-linux-x86-64.so.2 lib64/
```

**Step 5**: Create and test the ``chroot``

```
# chroot /var/chroot/
bash-4.4# ls
bash: ls: command not found
bash-4.4# help
bash-4.4# dirs
bash-4.4# cd bin/
bash-4.4# dirs
bash-4.4# cd ../lib64/
bash-4.4# dirs
bash-4.4# cd ..
bash-4.4# exit
```

**Step 6**: Create a new group called *chrootjail*. We can add users to this
group that we want to jail. Instructions are based on [linuxconfig.org][1].

```
# groupadd chrootjail
# usermod -a -G chrootjail omicron
# groups omicron
```

**Step 7**: Edit ``/etc/ssh/sshd_config`` to direct users in ``chrootjail``
group to ``chroot`` directory. Add the following line at the end of the file.
Then restart ssh server.

```
# nano /etc/ssh/sshd_config
Match group chrootjail
            ChrootDirectory /var/chroot/
```

Exit ``nano``.


**Step 8**: Test ``ssh``.

Before restarting ssh, let's log out of the server and ``ssh``
back in as the user *omicron*:

```
# exit
$ exit
$ ssh omicron@relevant_ip_address
$ exit
```

**Step 9**: Restart ssh and test ``chroot``.

That works as expected. Now ssh back in as your main user. Become root ,
restart ``ssh``, exit, and then ``ssh`` back in as *omicron*. The user should
be in the ``chroot`` directory.

```
$ exit
$ sudo su
# systemctl reload sshd
# exit
$ exit
```

## Exercise

Copy the libraries for the ``ls`` command so that the user *omicron* and use
``ls`` after logging into their account.

[1]:https://linuxconfig.org/how-to-automatically-chroot-jail-selected-ssh-user-logins
# Linux Firewalls

Netfilter is a suite of applications that help manage how packets flow into and
out of a server or internet connected device. Included within **netfilter** is
an application called ``iptables``, which is one of the main firewall
applications on many Linux distributions.

Fedora/RedHat offers a more user friendly interface to ``iptables`` called
``firewall-cmd`` that I'll discuss below. Ubuntu offers its own more user
firendly interface called ``ufw``. In this lecture, I'll discuss ``iptables``
and ``firewall-cmd`` and a little bit of ``ufw``.

## iptables 

Five predifined tables (*operations*) and chains.

Tables include:

- nat
- mangle
- raw
- filter
- security

*chain*: a list of rules that act on a packet flowing through the system.

Chains include:

- prerouting
- forward
- postrouting
- input
- output

We'll cover the filter tables and the nat tables. As applied:

- filter table, the default table
  - forward: for packets destined to be routed through local
  - input: for packets destined to local
  - output: for locally generated packets
- nat table, when a packet that creates a new connection is encountered
  - prerouting: for altering packets as soon as they come in
  - postrouting: for altering packets as they are about to go out
  - output: for altering locally-generated packets before routing

## usage

```
# iptables -L -v | less
# iptables -L | grep policy
```

Let's change the default policy for the FORWARD chain:

```
# iptables --policy FORWARD DROP
# iptables -L | grep policy
```

1. To locate the IP address for FB.
2. To locate the CIDR value or IP range for FB.
3. To block the IP range for FB.

```
$ host www.facebook.com
$ whois 157.240.18.35 | grep CIDR
$ sudo su
# iptables -A OUTPUT -p tcp -d 157.240.0.0/16 -j DROP
# iptables -A INPUT -p tcp -d 157.240.0.0/16 -j DROP
# w3m facebook.com
# ping facebook.com
```

1. since table isn't added, this uses the default table, which is the filter
   table
2. -A OUTPUT: append to table 
3. -p tcp: the protocol for the rule
4. -d IP address: destination address
5. -j DROP: specifies the target of the rule -- what to do if the packet
   matches. In this case, the target is to drop the package. Usual options
   include:

- ACCEPT : allow the connection
- DROP   : drop and ignore the connection 
- REJECT : do not allow the connect and return error to source

## Allow connections only from subnet

```
# comment: first, set policy to drop all incoming
$ sudo iptables --policy INPUT DROP
# comment: second, set policy to drop all forwarding 
$ sudo iptables --policy FORWARD DROP
# comment: thir , set policy to drop all outgoing 
$ sudo iptables --policy OUTPUT DROP
# comment: review new policies for the above chains
$ sudo iptables -L | grep policy
# comment: now accept only input, forwarding, and output from the following
# network ranges:
$ sudo iptables -A INPUT -s 10.163.34.0/24 -j ACCEPT
$ sudo iptables -A FORWARD -s 10.163.34.0/24 -j ACCEPT
$ sudo iptables -A OUTPUT -s 10.163.34.0/24 -j ACCEPT
```

## Saving changes

Save changes permanently, otherwise on restart, iptables reverts to default
settings:

```
$ sudo su
# /sbin/service iptabels save
```

There are lots of examples on the web. Examples from:

- http://www.tecmint.com/linux-iptables-firewall-rules-examples-commands/
- https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/

## PREROUTING

Forward all traffice to port 25 to port 2525: 

```
# iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 25 -j REDIRECT --to-port 2525
```

## OUTPUT

Disable outgoing eamil:

```
# iptables -A OUTPUT -p tcp --dports 25,465,587 -j REJECT
```

## firewall-cmd

[firewall-cmd documentation](https://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/sect-Security_Guide-Using_Firewalls.html)

**firewalld** is a slightly more user friendly interface to netfilters in Red
Hat based distros.

Zones are important concept in firewalld. Some predefined zones:

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
# firewall-cmd --state
```

Get active zones and interfaces attached to them:

```
# firewall-cmd --get-zones
# firewall-cmd --get-default-zone
# firewall-cmd --get-active-zones
FedoraServer
  interfaces: enp0s3
```

Allow port 22, list ports, remove services by name, add services by name:

```
# firewall-cmd --zone=FedoraServer --add-port=22/tcp
# firewall-cmd --zone=FedoraServer --list-ports
# firewall-cmd --zone=FedoraServer --remove-service=ssh --permanent
# firewall-cmd --zone=FedoraServer --add-service=smtp --permanent
# firewall-cmd --reload
```

Go into panic mode (drop all incoming/outgoing packets):

```
# firewall-cmd --panic-on
# firewall-cmd --panic-off
```

To change default zone:

```
# firewall-cmd --permanent --set-default-zone=public
```

## ufw

```
$ host www.facebook.com
$ whois 157.240.2.35 | grep CIDR
$ sudo su
# sudo ufw reject out to 157.240.0.0/16
# sudo ufw reject in to 157.240.0.0/16
```
