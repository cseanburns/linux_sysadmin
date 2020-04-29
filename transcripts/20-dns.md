# DNS

## DNS Intro Videos
  
Two helpful YouTube videos. The first one provides an overview of the DNS
system:

[How a DNS Server (Domain Name System) works](https://www.youtube.com/watch?v=mpQZVYPuDGU)

The second video illustrates how to use a GUI to create and manage DNS records.

[DNS Records](https://www.youtube.com/watch?v=cwT82ibOM2Q)

## DNS Basics

In order to resolve IP address to domain names, we need some kind of system
that will map these two identifiers to each other.

## /etc/hosts: The Hosts File

``/etc/hosts``: let's modify this so that our IP address is mapped to the name
**mywebsite**. To do that, let's add the following line just after the two
localhost lines:

```bash
$ sudo nano /etc/hosts
10.163.36.69 mywebsite
```

Replace the IP address in the file with your IP address. After adding that
line, save the file and exit. Let's install the Apache2 web server and then
enter that IP address in ``w3m`` and test whether it 10.163.36.69 resolves to
the domain name **mywebsite**:

```bash
$ sudo dnf updateinfo # update repository information
$ sudo dnf update # udpate machine before installing new software
$ sudo dnf install httpd
$ w3m mywebsite
```

This is one way to create a kind of intranet that uses actual names instead of
just IP addresses. Say that you have a home network and one of the computers on
your network is running a web server. If you assign a static IP to this
computer using the software on your home router, modify the ``/etc/hosts``
files on each of those three computers to point to that static IP via a domain
name, then you have basic DNS system for your intranet.

## FQDN: The Fully Qualified Domain Name

The structure of the domain name system is just like the structure of the
UNIX/Linux file hierarchy. It's like an inverted tree.

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

Russia is planning to use it's own alternate internet based on a different DNS
root system. You can read about in this [IEEE Spectrum
article](https://spectrum.ieee.org/tech-talk/telecom/internet/could-russia-really-build-its-own-alternate-internet).

## Top level domain (TLD)

Some examples of top level domains that we are all familiar with include:

* examples include: .org, .com, .net, .mil, .gov
* country code: .us, .uk, .ca

We can download a list of those top level names from ICANN and count how many
there are now:

```bash
$ wget http://data.iana.org/TLD/tlds-alpha-by-domain.txt
$ wc -l tlds-alpha-by-domain.txt
1528 tlds-alpha-by-domain.txt
```

The first line in that file is a title, and so there are 1527 top level domains
currently in existence.

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
location. Or, ``www.example.org`` could resolve to the second-level domain
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
the resolver server in the first video I showed. This server queries itself
(recursive) to see if the domain to IP mapping has been cached in its system.

If it hasn't been cached, then the DNS query is *forwarded* to a root server
and and so forth down the line.

## DNS servers

Root name servers contain the root zone file, and also point to the primary DNS
servers. You can read the root files here:

[https://www.iana.org/domains/root/files](https://www.iana.org/domains/root/files)

## DNS Record types

- SOA:    Start of Authority: describes the site's DNS entries
  - IN:     Internet Record
- NS:     Name Server: state which name server provides DNS resolution
- A:      Address records: provides mapping hostname to IPv4 address
- AAAA:   Address records: provides mapping hostname to IPv6 address

    $ dig google.com
    google.com.     IN      A       216.58.192.142

- PTR:    Pointer Record: provides mapping form IP Address to Hostname
- MX:     Mail exchanger: the MX record maps your email server.
- CNAME:  Canonical name: used so that a domain name may act as an alias for
  another domain name. Thus, say someone visits www.example.org, but if no
  subdomain is set up for www, then the CNAME can point to example.org.

## DNS Toolbox

It's important to be able to troubleshoot DNS issues. To do that, we have a few
utilities available. Here are a few examples and you should read the ``man``
pages for each one:

``host``: resolve hostnames to IP Address; or IP addresses to hostnames

```
$ man -f host
host (1) - DNS lookup utility
$ host uky.edu
$ host 128.163.111.50
$ host -t MX uky.edu
$ host -t MX dropbox.com
$ host -t MX netflix.com
$ host -t MX wikipedia.org
```

``dig``: domain information gopher -- get info on DNS servers

```
$ man -f dig
dig (1) - DNS lookup utility
$ dig uky.edu
$ dig uky.edu MX
$ dig www.uky.edu CNAME
```

``nslookup``: query internet name servers

```
$ man -f nslookup
nslookup (1) - query Internet name servers interactively
$ nslookup 
> uky.edu
> yahoo.com
> exit
```

``whois``: determine ownership of a domain

```
$ man -f whois
whois (1) - client for the whois directory services
$ whois uky.edu | less
```

``resolve.conf``: local resolver info; what's your DNS info

```
$ man -f  resolv.conf
resolv.conf (5) - resolver configuration file
$ cat /etc/resolv.conf
```

## Install Bind9

In addition to troubleshooting DNS issues, we can also set up a local DNS
resolver using the **bind9** software:

```
$ sudo dnf install bind bind-utils
$ named -V # check the version number and build options
$ systemctl status named.service # check if running
$ sudo systemctl start named.service # start service
$ sudo systemctl enable named.service # enable on startup
$ sudo netstat -lnptu | grep named # check what protocols/ports named listens to
$ sudo rndc status # check the status of the BIND named server ; see ``man rndc`` for more info
```

Recursive DNS is on by default in Fedora. Recursive DNS is the opposite of
Authoritative DNS. With authoritative DNS, others use DNS to resolve our
domain. We use recursive DNS to resolve other people's domains. Basically, we
are using this system as a DNS server. Here's a nice explanation:

[https://dyn.com/labs/dyn-internet-guide/](https://dyn.com/labs/dyn-internet-guide/)

Let's make our DNS resolver our default and turn on and check logging:

```
$ systemd-resolve status # check if set
$ sudo nano /etc/systemd/resolved.conf # open file
$ # now set DNS to the IP address for localhost; then save and close the file
DNS=127.0.0.1
$ sudo systemctl restart systemd-resolved
$ systemd-resolve status # check if set
$ sudo rndc querylog # turn on logging
$ sudo tail /var/log/messages
```

In addition to setting up a DNS server, we could use **bind9** to create DNS
records, just as the second video linked to at the top of this lecture
illustrates via a GUI.

Here is nice tutorial on setting up a [DNS resolver for Ubuntu](https://www.linuxbabe.com/ubuntu/set-up-local-dns-resolver-ubuntu-18-04-16-04-bind9)

[1]: https://www.amazon.com/Linux-Administration-Beginners-Guide-Seventh/dp/0071845364
