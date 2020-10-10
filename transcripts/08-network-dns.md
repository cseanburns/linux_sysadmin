# Introduction to DNS, the Domain Name System

## DNS Intro Videos

Two helpful YouTube videos. The first one provides an overview of the DNS
system:

[How a DNS Server (Domain Name System) works](https://www.youtube.com/watch?v=mpQZVYPuDGU)

The second video illustrates how to use a GUI to create and manage DNS records.

[DNS Records](https://www.youtube.com/watch?v=cwT82ibOM2Q)

Here is a nice intro to recursive DNS:

[https://www.cloudflare.com/learning/dns/what-is-recursive-dns/](https://www.cloudflare.com/learning/dns/what-is-recursive-dns/)

## FQDN: The Fully Qualified Domain Name

The structure of the domain name system is like the structure of the UNIX/Linux
file hierarchy. It's like an inverted tree.

The fully qualified domain name includes a period at the end of the top-level
domain. Your browser is able to supply that dot since we often don't use it
when typing website addresses.

Thus, for Google's main page, the FQDN is:

FQDN: www.google.com.

And the parts include:

```
.           root domain
com         top-level domain
google.     second-level domain
www.        third-level domain
```

This is important to know so that you understand how the **Domain Name System**
works and which DNS servers are responsible for their part of the network.

## Root domain

The root domain is managed by root name servers. These servers are managed by
ICANN, the Internet Corporation for Assigned Names and Numbers. The root
servers manage the root domain, alternatively referred to as the zone.

### Alternative DNS root systems

It's possible to have alternate internets by using outside root name servers.
This is not common, but it happens. Read about a few of them here:

* sdf: [https://web.archive.org/web/20081121061730/http://www.smtpnic.org/](https://web.archive.org/web/20081121061730/http://www.smtpnic.org/)
* opennic: [https://www.opennicproject.org/](https://www.opennicproject.org/)
* alternic: [https://en.wikipedia.org/wiki/AlterNIC](https://en.wikipedia.org/wiki/AlterNIC)

Russia might be planning to use it's own alternate internet based on
a different DNS root system. This would essentially create a large, second
internet. You can read about in this [IEEE Spectrum
article](https://spectrum.ieee.org/tech-talk/telecom/internet/could-russia-really-build-its-own-alternate-internet).

## Top level domain (TLD)

Some examples of top level domains that we are familiar with include:

* examples include: .org, .com, .net, .mil, .gov
* country code: .us, .uk, .ca

We can download a list of those top level names from ICANN and count how many
there are now:

```bash
$ wget http://data.iana.org/TLD/tlds-alpha-by-domain.txt
$ wc -l tlds-alpha-by-domain.txt
1528 tlds-alpha-by-domain.txt
```

The first line in that file is a title, which means there are 1527 top level
domains currently in existence.

## Second-level domain names

In the Google example, the second level domain is **google**. Other examples
include: **redhat** in **redhat.com** and **debian** in **debian.org**.
[Soyinka, (2016)][1] refers to this part of the FQDN as that which makes up the
"organizational boundary of the namespace" (p. 425). 

## Third-level domain names / hostnames / subdomains

When you've purchased (leased) a top and second level domain like
getfedora.org, you, as an admin, can choose whether you employ third level
domains. For example: www is a third level domain. If you owned
``example.org``, you could also have ``www.example.org`` resolve to a different
location, or, ``www.example.org`` could resolve to the second-level domain
itself. That is:

- www.debian.org points to debian.org

But it could also point to a separate server, such that **debian.org** and
**www.debian.org** would be two separate servers with two separate websites or
services. Although this is not common with third-level domains that start with
**www**, it is common with others. 

For example, with hostnames that are not ``www``:

- although google.com resolves to www.google.com
- google.com does not resolve to drive.google.com or maps.google.com or
  mail.google.com because those other three provide different, but specific
  services

## Recursive and Forward DNS Servers

Recursive DNS is the first DNS server to be queried in the DNS system. This is
the resolver server in the first video above. This server queries itself
(recursive) to check if the domain to IP mapping has been cached in its system.

If it hasn't been cached, then the DNS query is *forwarded* to a root server
and and so forth down the line.

## DNS servers

Root name servers contain the root zone file and point to the primary DNS
servers. You can read the root files here:

[https://www.iana.org/domains/root/files](https://www.iana.org/domains/root/files)

## DNS Record types

- SOA:    Start of Authority: describes the site's DNS entries
  - IN:     Internet Record
- NS:     Name Server: state which name server provides DNS resolution
- A:      Address records: provides mapping hostname to IPv4 address
- AAAA:   Address records: provides mapping hostname to IPv6 address

```
dig google.com
google.com.     IN      A       216.58.192.142
```

- PTR:    Pointer Record: provides mapping form IP Address to Hostname
- MX:     Mail exchanger: the MX record maps your email server.
- CNAME:  Canonical name: used so that a domain name may act as an alias for
  another domain name. Thus, say someone visits www.example.org, but if no
  subdomain is set up for www, then the CNAME can point to example.org.

## DNS Toolbox

It's important to be able to troubleshoot DNS issues. To do that, we have a few
utilities available. Here are examples and you should read the ``man`` pages
for each one:

``host``: resolve hostnames to IP Address; or IP addresses to hostnames

```
man -f host
host (1) - DNS lookup utility
host uky.edu
host 128.163.35.46
host -t MX uky.edu
host -t MX dropbox.com
host -t MX netflix.com
host -t MX wikipedia.org
```

``dig``: domain information gopher -- get info on DNS servers

```
man -f dig
dig (1) - DNS lookup utility
dig uky.edu
dig uky.edu MX
dig www.uky.edu CNAME
```

``nslookup``: query internet name servers

```
man -f nslookup
nslookup (1) - query Internet name servers interactively
nslookup 
> uky.edu
> yahoo.com
> exit
```

``whois``: determine ownership of a domain

```
man -f whois
whois (1) - client for the whois directory services
whois uky.edu | less
```

``resolve.conf``: local resolver info; what's your DNS info

```
man -f  resolv.conf
resolv.conf (5) - resolver configuration file
cat /etc/resolv.conf
resolvectl status
```

# Install DNS Server

We will set up a DNS server and a client machine that uses the DNS server with Virtualbox. I've made some modifications, but overall I'm drawing upon the nice tutorial at [fedora Magazine][2].

## VirtualBox Setup:

In Virtualbox:

1. Click on your original Fedora OS install
2. Click on Settings -> Network
3. Switch NAT to Bridged

## Update Server

Start and login to Fedora:

Switch to root account and update machine:

```
sudo su
dnf -y upgrade
```

After finished upgrading, power down the machine:

```
poweroff
```

## Clone Server

Next, in VirtualBox, clone your Fedora server two times and give them meaningful names. 

1. Call the first one **Fedora-DNS-Server**.
2. Call the second one **Fedora-DNS-Client**.

## Fedora-DNS-Client

Login to **Fedora-DNS-Client** and get the IP address:

```
ip a
192.168.245.72/24
```

## Fedora-DNS-Server
### Set up DNS

Keep that machine on but minimize it, and now login to **Fedora-DNS-Server**,
get the IP address. Write these IP addresses down correctly.

```
ip a
192.168.245.73/24
```

On the **Fedora-DNS-Server** machine, install the DNS server software and utilities:

```
sudo su
dnf install -y bind bind-utils
```

Let's create a new hostname for this server. I'll name my DNS server after
a Star Trek ship:

```
hostname
hostnamectl set-hostname enterprise
hostname
```

Now we need to edit some Bind configuration files. First we'll edit
**named.conf**:

```
nano /etc/named.conf
```

Go to this line:

```
listen-on port 53 { 127.0.0.1; };
```

Add the IP address for **Fedora-DNS-Server**. It should look like this, but
you'll have to use the IP address you got from ``ip a`` above, so that it looks
like this. MAKE SURE you add the semicolons correctly--syntax is very important
here:

```
listen-on port 53 { 127.0.0.1; 192.168.254.73; };
```

Next, go to this line:

```
allow-query { localhost; };
```

And add your network info:

```
allow-query { localhost; 192.168.254.0/24; };
```

Now we will set up forward and reverse zones. Forward zones map hostnames to IP
addresses. Reverse zones map IP addresses to hostnames.

Go to this line:

```
include "/etc/named.rfc1912.zones";
```

Directly **above that line**, add the following info. Substitute
**enterprrise** for the hostname you created for your system. Note that the
second zone is based on the IP address for **Fedora-DNS-Server**, but that it's
written in reverse and only the first three octets are used. You'll have to do
the same with the IP address for your **Fedora-DNS-Server**:

```
zone "dns01.enterprise" IN {
type master;
file "forward.enterprise";
allow-update { none; };
};

zone "254.168.192.in-addr.arpa" IN {
type master;
file "reverse.enterprise";
allow-update { none; };
};
```

Save and exit the file

### Set up zone files

The above modification refers to two zone files that are located in a different
part of the filesystem. We'll create these zone files:

Creat/open the forward zone file, but substitute **enterprise** for the
hostname of your **Fedora-DNS-Server**:

```
nano /var/named/forward.enterprise
```

And add the following info to that file. Again, you'll have to substitute
**enterprise** for the hostname of your server. For the IP addresses, you'll
need to use the IP address for your **Fedora-DNS-Server** and your
**Fedora-DNS-Client**. My server has the IP address of **192.168.254.73** and
my client has the address **192.168.254.72**:

```
$TTL 86400
@     IN          SOA     dns01.enterprise. root.enterprise. (
      2011071001  ;Serial
      3600        ;Refresh
      1800        ;Retry
      604800      ;Expire
      86400       ;Minimum TTL
)
; Name Server Info
@      IN          NS      dns01.enterprise.
; IP Address for Name Server
@      IN          A       192.168.254.73

dns01  IN          A       193.168.254.73
client IN          A       193.168.254.72
```

Save and exit.

Repeat this process for the reverse zone file:

```
nano /var/named/reverse.enterprise
```

And add, again substituting the hostname and IP addresses with your hostname
and respective IP addresses:

```
$TTL 86400
@   IN  SOA     dns01.enterprise. root.enterprise. (
        2011071001  ;Serial
        3600        ;Refresh
        1800        ;Retry
        604800      ;Expire
        86400       ;Minimum TTL
)
; Name Server Info
@       IN  NS          dns01.enterprise.
; Reverse lookup for Name Server
@       IN  PTR         enterprise.local.

dns01           IN  A   192.168.254.73
client          IN  A   192.168.245.72
160     IN  PTR         dns01.enterprise.
136     IN  PTR         client.enterprise.
```

Save and exit.

We'll cover SELinux soon, but to take of that now, configure SELinux and fix
ownership of the files:

```
chgrp named -R /var/named
chown -v root:named /etc/named.conf
restorecon -rv /var/named
restorecon /etc/named.conf
```

We'll cover firewalls soon, but for now, update the firewall:

```
firewall-cmd --add-service=dns --perm
firewall-cmd --reload
```

We need to check for syntax errors in the configuration file. If there are no
errors in the file, lothing will echo back. If there are errors, read the error
message closely and fix the file after opening it in ``nano``:

```
named-checkconf /etc/named.conf
```

Likewise, check for errors in the zone files:

```
named-checkzone dns01.enterprise /var/named/reverse.enterprise
named-checkzone dns01.enterprise /var/named/forward.enterprise
```

Enable and start the DNS server:

```
systemctl enable named
systemctl start named
```

Edit the **resolv.conf** (see ``man resolv.conf``) and add the IP address for
the server:

```
nano /etc/resolv.conf
nameserver 192.168.254.73
```

If there are nother nameservers listed in that file, comment them out by prepending the lines with a pound sign: ``#``.

We can now check if our DNS server is working by examining the output of the
``dig`` command:

```
dig fedoramazine.org
```

## On the client machine

They are likely already installed, but in case it's not, install the Bind
utilities only:

```
sudo dnf install -y bind-utils
```

Edit **resolv.conf** so that nameserver points to the IP address of your **Fedora-DNS-Server**:

```
sudo nano /etc/resolv.conf
nameserver 192.168.254.73
```

Examine output of the ``dig`` command, which should show that it's querying 192.168.254.73 for DNS:

```
dig fedoramagazine.org
```

We can also check the reverse DNS lookup:

```
dig 35.196.109.67
```

## Make Permanent

As the [fedora Magazine] article points out, the **/etc/resolv.conf** file will get reset upon reboot. To make sure the file doesn't get altered, you can use the ``chattr`` command on both the server and client machines (and any other client machines). So run this command on both virtual machines:

```
chattr +i /etc/resolv.conf
```

[1]:https://www.amazon.com/Linux-Administration-Beginners-Guide-Seventh/dp/0071845364
[2]:https://fedoramagazine.org/how-to-setup-a-dns-server-with-bind/
