# DNS and Domain Names

The DNS (**domain name system**) is referred to
as the phone book of the internet, and it's
responsible for mapping IP addresses to
memorable names.
Thus, instead of having to remember:

https://128.163.35.46

We can instead remember this:

https://www.uky.edu

System administrators need to know about DNS
because they may be responsible for administrating
a domain name system on their network, and/or
they may be responsible for setting up and
administrating web site domains.
Either case requires a basic understanding of DNS.

## DNS Intro Videos

To help you get started,
watch these two YouTube videos.
The first one provides an overview of the DNS system:

[How a DNS Server (Domain Name System) works][howdns]

The second video illustrates how to use a
graphical user interface to create and manage DNS records.

[DNS Records][dnsrecords]

And here is a nice intro to recursive DNS:

[https://www.cloudflare.com/learning/dns/what-is-recursive-dns/][recursivedns]

## FQDN: The Fully Qualified Domain Name

The structure of the domain name system is
like the structure of the UNIX/Linux file hierarchy;
that is, it is like an inverted tree.

The fully qualified domain name includes a
period at the end of the top-level domain.
Your browser is able to supply that dot
since we often don't use it when typing website addresses.

Thus, for Google's main page, the FQDN is:

FQDN: www.google.com.

And the parts include:

```
.           root domain
com         top-level domain
google.     second-level domain
www.        third-level domain
```

This is important to know so that you understand
how the **Domain Name System** works and
which DNS servers are responsible for their part of the network.

### Root Domain

The root domain is managed by root name servers.
These servers are listed on the [IANA][rootiana],
the Internet Assigned Numbers Authority, website, but
are managed by multiple operators.
The root servers manage the root domain,
alternatively referred to as the zone, or
the **.** at the end of the ``.com.``, ``.edu.``, etc.

#### Alternative DNS Root Systems

It's possible to have alternate internets by
using outside root name servers.
This is not common, but it happens.
Read about a few of them here:

* sdf: [https://web.archive.org/web/20081121061730/http://www.smtpnic.org/][sdf]
* opennic: [https://www.opennicproject.org/][opennic]
* alternic: [https://en.wikipedia.org/wiki/AlterNIC][alternic]

Russia, as an example, has threated to use
it's own alternate internet based on a different
DNS root system.
This would essentially create a large, second internet.
You can read about in this [IEEE Spectrum article][ieeerussia].

### Top Level Domain (TLD)

We are all familiar with top level domains.
Specific examples include:

* generic TLD names:
  * .com
  * .gov
  * .mil
  * .net
  * .org
* and ccTLD, [country code TLDs][cctld]
  * .ca (Canada)
  * .mx (Mexico)
  * .jp (Japan)
  * .uk (United Kingdom)
  * .us (United States)

We can download a list of those top level names from IANA, and
get a total count of 1,487 (as of August 2022):

```
wget https://data.iana.org/TLD/tlds-alpha-by-domain.txt
sed '1d' tlds-alpha-by-domain.txt | wc -l
```

### Second Level Domain Names

In the Google example,
the second level domain is **google**.
The second level domain along with the TLD
together, along with any further subdomains,
for the [fully qualified domain name][fqdn].
Other examples include:

- **redhat** in **redhat.com**
- **debian** in **debian.org**.
- **wikipedia** in **wikipedia.org**
- **uky** in **uky.edu**
- **twitter** in **twitter.com**
  
### Third Level Domain Names / Subdomains

When you've purchased (leased) a top and second level
domain like **ubuntu.com**,
you can choose whether you add third level domains.
For example: www is a third level domain or subdomain.
If you owned ``example.org``,
you could dedicate a machine or a cluster of machines
to ``www.example.org`` that
resolve to a different location, or
``www.example.org`` could resolve to the second-level domain itself.
That is:

* www.debian.org can point to debian.org

It could also point to a separate server,
such that **debian.org** and **www.debian.org**
would be two separate servers with two separate websites or services,
just like **maps.google.com** points to a different
site than **mail.google.com**.
Both **maps** and **mail** are subdomains of **google.com**.
Although this is not common with third-level
domains that start with **www**,
it is common with others.

For example, with hostnames that are not ``www``:

* google.com resolves to www.google.com
* google.com does not resolve to:
    * drive.google.com, or
    * maps.google.com, or
    * mail.google.com

This is because those other three provide different,
but specific services.

## DNS Paths 

A recursive DNS server is the first DNS server
to be queried in the DNS system,
which is usually managed by an ISP.
This is the resolver server in the first video above.
This server queries itself (recursive) to check if the
domain to IP mapping has been cached (remembered/stored) in its system.

If it hasn't been cached,
then the DNS query is *forwarded* to a root server.
There are thirteen root servers.

```
echo {a..m}.root-servers.net.
```

Those root servers will identify the next server to query,
depending on the top level domain (.com, .net, .edu, .gov, etc.).
If the site ends in **.com** or **.net**, then
the next server might be something like:
**a.gtld-servers.net.**
Or if the top level domain ends in **.edu**, then:
**a.edu-servers.net.**.
If the top level domain ends in **.gov**, then:
**a.gov-servers.net.**.
And so forth.

Those top level domains should know where to
send the query next.
In many cases, the next path is to send the query
to a custom domain server.
For example, Google's custom name servers are:
**ns1.google.com** to **ns4.google.com**.
UK's custom name servers are:
**sndc1.net.uky.edu** and **sndc2.net.uky.edu**.
Finally, those custom name servers will know
the IP address that maps to the domain.

We can use the ``dig`` command to query
the non-cached DNS paths.
Let's say we want to follow the DNS path for **google.com**,
then we can start by querying any [root server][rootiana].
In the output, we want to pay attention to the QUERY field,
the ANSWER field, and the Authority Section.
We keep **digging** until the ANSWER field returns
a number greater than 0.
The following commands query one of the root servers,
which points us to one of the authoritative servers for
**.com** sites,
which points us to Google's custom nameserver,
which finally provides an answer,
in fact six answers,
or six IP address that all map to **google.com**.

```
dig @e.root-servers.net google.com
dig @a.gtld-servers.net google.com
dig @ns1.google.com google.com
```

Alternatively, we can query UK's:

```
dig @j.root-servers.net. uky.edu
dig @b.edu-servers.net. uky.edu
dig @sndc1.net.uky.edu. uky.edu
```

We can also get this path information using
``dig``'s trace command:

```
dig google.com +trace
```

There are a lot of [ways to use the dig command][digCommands], and
you can test and explore them on your own.

### DNS Record Types

In the ``dig`` command output above,
you will see various fields.

* SOA:    Start of Authority: describes the site's DNS entries
    * IN:     Internet Record
* NS:     Name Server: state which name server provides DNS resolution
* A:      Address records: provides mapping hostname to IPv4 address
* AAAA:   Address records: provides mapping hostname to IPv6 address

```
dig google.com
google.com.     IN      A       142.251.32.78
```

Other record types include:

* PTR:    Pointer Record: provides mapping from IP Address to Hostname
* MX:     Mail exchanger: the MX record maps your email server.
* CNAME:  Canonical name: used so that a domain name may act as an alias for
  another domain name. Thus, say someone visits www.example.org, but if no
  subdomain is set up for www, then the CNAME can point to example.org.

### DNS Toolbox

It's important to be able to troubleshoot DNS issues.
To do that, we have a few utilities available.
Here are examples and you should read the ``man`` pages for each one:

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

## Conclusion

In the same way that phones have phone numbers,
servers on the internet have IP addresses.
Since we're only human,
we don't remember every phone number that we dial or
every IP address that we visit.
In order to make such things human friendly,
we use names instead.

Nameservers and DNS records act as the phone book
and phone book entries of the internet.
Note that I refer to the **internet** and not the **web** here.
There is more at the application layer than the HTTP/HTTPS protocols,
and so other types of servers,
e.g., mail servers,
may also have domain names and IP addresses to resolve.

In this section, we covered the basics of DNS that include:

- FQDN: the Fully Qualified Domain Name
- Root domains
- Top level domains (TLDs) and Country Code TLDS (ccTLDs)
- Second level and third level domains/subdomains
- DNS paths, and
- DNS record types

We'll come back to this material when we set up our websites.


[howdns]:https://www.youtube.com/watch?v=mpQZVYPuDGU
[dnsrecords]:https://www.youtube.com/watch?v=cwT82ibOM2Q
[recursivedns]:https://www.cloudflare.com/learning/dns/what-is-recursive-dns/
[sdf]:https://web.archive.org/web/20081121061730/http://www.smtpnic.org/
[opennic]:https://www.opennicproject.org/
[alternic]:https://en.wikipedia.org/wiki/AlterNIC
[ieeerussia]:https://spectrum.ieee.org/tech-talk/telecom/internet/could-russia-really-build-its-own-alternate-internet
[rootiana]:https://www.iana.org/domains/root/servers
[cctld]:https://en.wikipedia.org/wiki/Country_code_top-level_domain
[fqdn]:https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[digCommands]:https://www.geeksforgeeks.org/dig-command-in-linux-with-examples/
