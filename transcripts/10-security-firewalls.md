# Local Security: ``chroot`` example

``chroot`` is a technology that can be used to change the "apparent" root ``/``
directory for a user or a process. A user or process that is confined to the
``chroot`` cannot see or access the rest of the file system and will have
limited access to the binaries (executables/apps/utilities) on the system. From
its ``man`` page:

```
chroot (8) - run command or interactive shell with special root directory
```

It has some useful use cases for security, although it is not entirely safe
from tampering. I've read that some people have used ``chroot`` for DNS
servers, for example.

``chroot`` is also the conceptual basis for some kinds of virtualization
technologies that are common today. In this sense, it's been used to control
and provide a stable developmental environment for devops like work.

## ``chroot`` a current user

In this tutorial, we are going to create a ``chroot`` for a human user account.

**Step 1**: Let's create a user first. We're imagining that we have a
preexisting user and that we need to ``chroot`` that user going forward.

```
sudo su
useradd -m -U -s /bin/bash omicron
passwd omicron
```

**Step 2**: We'll ``chroot`` *omicron* in a new directory ``/var/chroot``.

```
mkdir /var/chroot
```

**Step 3**: Set up available binaries for the user. We'll only allow ``bash``
for now.  To do that, we'll create a ``bin/`` directory, and copy bash to that
directory.

```
mkdir /var/chroot/bin
which bash
/usr/bin/bash
cp /usr/bin/bash /var/chroot/bin/
```

**Step 4**: Copy the libraries for the bash binary.

```
# Identify libraries needed by Bash
ldd /usr/bin/bash
## comment: name it lib64 since these are all lib64 libraries
mkdir /var/chroot/lib64
cp /lib64/libtinfo.so.6 /var/chroot/lib64/
cp /lib64/libdl.so.2 /var/chroot/lib64/
cp /lib64/libc.so.6 /var/chroot/lib64/
cp /lib64/ld-linux-x86-64.so.2 /var/chroot/lib64/
```

**Step 5**: Create and test the ``chroot``

```
chroot /var/chroot/
bash-5.0# ls
bash: ls: command not found
bash-5.0# help
bash-5.0# dirs
bash-5.0# cd bin/
bash-5.0# dirs
bash-5.0# cd ../lib64/
bash-5.0# dirs
bash-5.0# cd ..
bash-5.0# exit
```

**Step 6**: Create a new group called *chrootjail*. We can add users to this
group that we want to jail. Instructions are based on
[linuxconfig.org][chroot_jail].

```
groupadd chrootjail
usermod -a -G chrootjail omicron
groups omicron
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

Restart ``ssh``:

```
systemctl restart sshd
```

The logout of the server altogether:

```
exit
```

**Step 8**: Test ``ssh``.

Connect to the Fedora server via ``ssh`` as the user *omicron*:

```
ssh omicron@relevant_ip_address
-bash-5.0$ ls
-bash: ls: command not found
exit
```

That works as expected. The user *omicron* is now restricted to a special
directory and has limited access to the system or to any utilities on that
system.

## Exercise

By using the ``ldd`` command, you can add additional binaries for this user. As
an exercise, use the ``ldd`` command to locate the libraries for the ``nano``
editor, and make ``nano`` available to the user *omicron* in the chrooted
directory.

### Nano in chroot

After making Bash available in ``chroot``:

(Side note: I'm using the **#** sign below to indicate the root prompt.)

```
# which nano
/usr/bin/nano
# cp /usr/bin/nano /var/chroot/bin/
# ldd /usr/bin/nano
linux-vdso.so.1 (0x00007fff5bdd5000)
  libmagic.so.1 => /lib64/libmagic.so.1 (0x00007f0ce11a7000)
  libncursesw.so.6 => /lib64/libncursesw.so.6 (0x00007f0ce1167000)
  libtinfo.so.6 => /lib64/libtinfo.so.6 (0x00007f0ce1138000)
  libc.so.6 => /lib64/libc.so.6 (0x00007f0ce0f6e000)
  libz.so.1 => /lib64/libz.so.1 (0x00007f0ce0f54000)
  libdl.so.2 => /lib64/libdl.so.2 (0x00007f0ce0f4d000)
  /lib64/ld-linux-x86-64.so.2 (0x00007f0ce1232000)
# cp /lib64/libmagic.so.1 /var/chroot/lib64/
# cp /lib64/libncursesw.so.6 /var/chroot/lib64/
# cp /lib64/libtinfo.so.6 /var/chroot/lib64/
# cp /lib64/libc.so.6 /var/chroot/lib64/
# cp /lib64/libz.so.1 /var/chroot/lib64/
# cp /lib64/libdl.so.2 /var/chroot/lib64/
# cp /lib64/ld-linux-x86-64.so.2 /var/chroot/lib64/
# chroot /var/chroot/
bash-5.0# nano
Error opening terminal: xterm-256color.
bash-5.0# exit
```

To fix this, install ``ncurses-term`` and copy over additional files:

```
# dnf install -y ncurses-term
# locate xterm-256color
/usr/share/terminfo/s/screen.xterm-256color
/usr/share/terminfo/x/xterm-256color
# mkdir -p /var/chroot/etc/terminfo/x/
# cp /usr/share/terminfo/x/* /var/chroot/etc/terminfo/x/
# chroot /var/chroot
# nano
```

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

## iptables

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

### Usage

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

### Allow connections only from subnet

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

### PREROUTING

Here is another example where we forward all traffic to port 25 to port 2525.
Here we use the **NAT** table, since NAT is responsible for network address
translation:

```
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 25 -j REDIRECT --to-port 2525
```

### OUTPUT

Here is another example where we disable outgoing email by disabling the ports
that are commonly associated with email. Of course, this could be bypassed by
using non-standard ports for email, but for out cases, it's a decent
demonstration:

```
# iptables -A OUTPUT -p tcp --dports 25,465,587 -j REJECT
```

## firewall-cmd

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

[chroot_jail]:https://linuxconfig.org/how-to-automatically-chroot-jail-selected-ssh-user-logins
[firewall_cmd]:https://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/sect-Security_Guide-Using_Firewalls.html
[iptables-examples]:http://www.tecmint.com/linux-iptables-firewall-rules-examples-commands/
[iptables-beginners]:https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/
