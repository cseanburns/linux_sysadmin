# Introduction to DNS, the Domain Name System

## DNS Intro Videos

Two helpful YouTube videos. The first one provides an overview of the DNS system:

[How a DNS Server (Domain Name System) works][howdns]

The second video illustrates how to use a GUI to create and manage DNS records.

[DNS Records][dnsrecords]

Here is a nice intro to recursive DNS:

[https://www.cloudflare.com/learning/dns/what-is-recursive-dns/][recursivedns]

## FQDN: The Fully Qualified Domain Name

The structure of the domain name system is like the structure of the UNIX/Linux file hierarchy; that is, it is like an inverted tree.

The fully qualified domain name includes a period at the end of the top-level domain. Your browser is able to supply that dot since we often don't use it when typing website addresses.

Thus, for Google's main page, the FQDN is:

FQDN: www.google.com.

And the parts include:

```
.           root domain
com         top-level domain
google.     second-level domain
www.        third-level domain
```

This is important to know so that you understand how the **Domain Name System** works and which DNS servers are responsible for their part of the network.

### Root domain

The root domain is managed by root name servers. These servers are listed on the [IANA][rootiana], the Internet Assigned Numbers Authority, website, but are managed by multiple operators. The root servers manage the root domain, alternatively referred to as the zone, or the ``.`` at the end of the ``.com.``, ``.edu.``, etc.

#### Alternative DNS root systems

Aside: It's possible to have alternate internets by using outside root name servers. This is not common, but it happens. Read about a few of them here:

* sdf: [https://web.archive.org/web/20081121061730/http://www.smtpnic.org/][sdf]
* opennic: [https://www.opennicproject.org/][opennic]
* alternic: [https://en.wikipedia.org/wiki/AlterNIC][alternic]

Russia, as an example, has threated to use it's own alternate internet based on a different DNS root system. This would essentially create a large, second internet. You can read about in this [IEEE Spectrum article][ieeerussia].

### Top level domain (TLD)

We are all familiar with top level domains. Specific examples include:

* generic names: .org, .com, .net, .mil, .gov
* and country code-based: .us, .uk, .ca

We can download a list of those top level names from IANA, and get a total count:

```
wget https://data.iana.org/TLD/tlds-alpha-by-domain.txt
sed '1d' tlds-alpha-by-domain.txt | wc -l
1495
```

### Second-level domain names

In the Google example, the second level domain is **google**. Other examples include: **redhat** in **redhat.com** and **debian** in **debian.org**. [Soyinka, (2016)][soyinka2] refers to this part of the FQDN as that which makes up the "organizational boundary of the namespace" (p. 425).

### Third-level domain names / hostnames / subdomains

When you've purchased (leased) a top and second level domain like getfedora.org, you can choose whether you employ third level domains. For example: www is a third level domain. If you owned ``example.org``, you could also have ``www.example.org`` resolve to a different location, or, ``www.example.org`` could resolve to the second-level domain itself. That is:

* www.debian.org can point to debian.org

But it could also point to a separate server, such that **debian.org** and **www.debian.org** would be two separate servers with two separate websites or services. Although this is not common with third-level domains that start with **www**, it is common with others.

For example, with hostnames that are not ``www``:

* google.com resolves to www.google.com
* google.com does not resolve to:
    * drive.google.com, or
    * maps.google.com, or
    * mail.google.com

This is because those other three provide different, but specific services.

## DNS Paths 

Recursive DNS is the first DNS server to be queried in the DNS system. This is the resolver server in the first video above. This server queries itself (recursive) to check if the domain to IP mapping has been cached in its system.

If it hasn't been cached, then the DNS query is *forwarded* to a root server and and so forth down the line.

We can use the ``dig`` command to query the non-cached DNS paths. Let's say we want to follow the DNS path for **google.com**, then we can start by querying any [root server][rootiana]. In the output, we wan to pay attention to the QUERY field, the ANSWER field, and the Authority Section:

```
dig @198.41.0.4 google.com 
```

The root servers only know about top level domains, and in this case, that's the ``com.`` domain. Fortunately, it lists some authoritative TLD servers and their IP addresses, and we can query one of those next:

```
dig @192.12.94.30 google.com
```

Now we know something about the TLD. Here we still don't know the full path, but it does tell us that for **google.com**, we need to query one of Google's name servers:

```
dig @216.239.34.10 google.com
```

And now we finally get our answer, which is that **google.com** resolves to 142.250.190.78, at least for me and at this instant.

### DNS Record types

* SOA:    Start of Authority: describes the site's DNS entries
    * IN:     Internet Record
* NS:     Name Server: state which name server provides DNS resolution
* A:      Address records: provides mapping hostname to IPv4 address
* AAAA:   Address records: provides mapping hostname to IPv6 address

```
dig google.com
google.com.     IN      A       142.251.32.78
```

* PTR:    Pointer Record: provides mapping from IP Address to Hostname
* MX:     Mail exchanger: the MX record maps your email server.
* CNAME:  Canonical name: used so that a domain name may act as an alias for another domain name. Thus, say someone visits www.example.org, but if no subdomain is set up for www, then the CNAME can point to example.org.

### DNS Toolbox

It's important to be able to troubleshoot DNS issues. To do that, we have a few utilities available. Here are examples and you should read the ``man`` pages for each one:

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

[howdns]:https://www.youtube.com/watch?v=mpQZVYPuDGU
[dnsrecords]:https://www.youtube.com/watch?v=cwT82ibOM2Q
[recursivedns]:https://www.cloudflare.com/learning/dns/what-is-recursive-dns/
[sdf]:https://web.archive.org/web/20081121061730/http://www.smtpnic.org/
[opennic]:https://www.opennicproject.org/
[alternic]:https://en.wikipedia.org/wiki/AlterNIC
[ieeerussia]:https://spectrum.ieee.org/tech-talk/telecom/internet/could-russia-really-build-its-own-alternate-internet
[soyinka2]:https://www.amazon.com/Linux-Administration-Beginners-Guide-Seventh/dp/0071845364
[rootiana]:https://www.iana.org/domains/root/servers
