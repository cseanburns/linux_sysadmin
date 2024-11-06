# DNS and Domain Names

By the end of this section, you should know:

- The purpose of DNS and its role as the "phone book" of the internet.
- The structure of domain names, including fully qualified domain names (FQDNs).
- How DNS paths work, including root domains, top-level domains (TLDs), second-level domains, and third-level subdomains.
- The different types of DNS records and their purposes.
- How to use common tools like `dig`, `host`, `nslookup`, and `whois` for DNS-related tasks.

## Getting Started

The DNS (**domain name system**) is referred to as the phone book of the internet.
It's responsible for mapping IP addresses to memorable names.
Thus, instead of having to remember:

https://128.163.35.46

We can instead remember this:

https://www.uky.edu

System administrators need to know about DNS because they may be responsible for administering a domain name system on their network,
and/or they may be responsible for setting up and administrating web site domains.
Either case requires a basic understanding of DNS.

## DNS Intro Videos

To help you get started, watch these two YouTube videos and read the text on recursive DNS:

- [How a DNS Server (Domain Name System) works (YouTube)][howdns]
- [DNS Records (YouTube)][dnsrecords]
- [What is recursive DNS?][recursivedns]

## FQDN: The Fully Qualified Domain Name

The structure of the domain name system is like the structure of the UNIX/Linux file hierarchy;
that is, it is like an inverted tree.

The fully qualified domain name (FQDN) includes a period at the end of the top-level domain to indicate the root of the DNS hierarchy.
Although modern browsers often omit this trailing period, it remains essential for the proper identification of domain names within DNS systems.

Thus, for Google's main page, the FQDN is: **www.google.com.**

And the parts include:

```
.           root domain
com         top-level domain (TLD)
google      second-level domain
www         third-level domain
```

This is important to know so that you understand how the **Domain Name System** works and
how DNS servers are responsible for their part of the network.

### Root Domain

The root domain is managed by root name servers.
These servers are listed on the [IANA][rootiana] (Internet Assigned Numbers Authority) website, but are managed by multiple operators.
The root servers manage the root domain, alternatively referred to as the zone, or the **.** at the end of the ``.com.``, ``.edu.``, etc.

#### Alternative DNS Root Systems

It's possible to have [alternate internets][alt_dns] by using outside root name servers.
This is not common, but it happens.
Read about a few of them here:

* opennic: [https://www.opennicproject.org/][opennic]
* alternic: [https://en.wikipedia.org/wiki/AlterNIC][alternic]

As an example, Russia is building its own alternate internet based on a separate DNS root system.
When completed, this will create a large, second internet that would be inaccessible to the rest of the world
without reconfiguring multiple devices, servers, DNS resolvers, etc.
You can read about in this [IEEE Spectrum article][ieeerussia].

### Top Level Domain (TLD)

We are all familiar with top level domains.
These generic TLD names are the kinds that include:

* .com
* .gov
* .mil
* .net
* .org

There are also [country coded TLDs (ccTLDs)][cctld] such as:

* .ca (Canada)
* .mx (Mexico)
* .jp (Japan)
* .uk (United Kingdom)
* .us (United States)

We can get a total count of current domain names using the command below, which outputs 1,445 (as of October 2024):

```
curl -s https://data.iana.org/TLD/tlds-alpha-by-domain.txt | sed '1d' | wc -l
```

> The `curl` command is an alternate to the `wget` command.
> They share basic functionality but also have their own use cases.
> `curl` by default does not save a retrieved file.
> Add the `-o` option to save a file: `curl -o [URLs]`.
> Or, visit the `iana.org` link in the code block above to peruse the list of TLDs.

### Second Level Domain Names

In the Google example of `www.google.com`, the second level domain is `google`.
The second level domain along with the TLD together, along with any further subdomains, forms the [fully qualified domain name (FQDN)][fqdn].
Other examples of second level domains include:

- **redhat** in **redhat.com**
- **debian** in **debian.org**.
- **wikipedia** in **wikipedia.org**
- **uky** in **uky.edu**
  
### Third Level Domain Names / Subdomains

When you've purchased (leased) a top and second level domain like `ubuntu.com`, you can choose whether to add third level domains.
For example: `www` is a third level domain or subdomain.
If you owned `example.org`, you could dedicate a separate server (or a cluster of machines) to `www.example.org` that
resolves to a different location, or `www.example.org` could resolve to the second-level domain `example.org`.
That is:

* The server located at `www.debian.org` can point to the server located at `debian.org`.

`www.debian.org` could be configured to point to a different server than `debian.org`,
meaning that each domain could host separate websites or services.
This would be like how `maps.google.com` points to a different site than `mail.google.com`.
Yet both `maps` and `mail` are subdomains of `google.com`.
However, it's a convention that third-level domains marked by `www` point to the top level domains.

For example:

* `google.com` resolves to `www.google.com`
* but `google.com` does not resolve to:
    * `drive.google.com`, or
    * `maps.google.com`, or
    * `mail.google.com`

This is because `drive.google.com`, `maps.google.com`, and `mail.google.com` provide different but specific services.

## DNS Paths 

A recursive DNS server, which is usually managed by an ISP, is the first DNS server to be queried in the DNS system.
This is the **resolver server** in the first video above.
This server queries itself (recursive) to check if the domain to IP mapping has been cached (remembered/stored) in its system.

If it hasn't been cached, then the DNS query is *forwarded* to a root server.
There are thirteen root servers.

```
echo {a..m}.root-servers.net.
a.root-servers.net. b.root-servers.net. c.root-servers.net. d.root-servers.net. e.root-servers.net. f.root-servers.net. g.root-servers.net. h.root-servers.net. i.root-servers.net. j.root-servers.net. k.root-servers.net. l.root-servers.net. m.root-servers.net.
```

> The `echo {a..m}.root-servers.net` command has nothing to do with DNS.
> I'm using brace expansion in Bash to simply list the root servers.

When a DNS query is forwarded to a root server,
the root server identifies the next server to query, depending on the top level domain (.com, .net, .edu, .gov, etc.).
If the site ends in `.com` or `.net`, then the next server might be something like: `a.gtld-servers.net.`
Or if the top level domain ends in `.edu`, then: `a.edu-servers.net.` might be queried.
If the top level domain ends in `.gov`, then: `a.gov-servers.net.`.
And so forth.

Those top level domains will know where to send the query next.
In many cases, the next path is to send the query to a custom domain server.
For example, Google's custom name servers are: **ns1.google.com** to **ns4.google.com**.
UK's custom name servers are: **sndc1.net.uky.edu** and **sndc2.net.uky.edu**.
Finally, those custom name servers will know the IP address that maps to the domain.

We can use the `dig` command to query the non-cached DNS paths.
Let's say we want to follow the DNS path for `google.com`.
We can start by querying any [root server][rootiana].
In the output, we want to pay attention to the QUERY field, the ANSWER field, and the Authority Section.
We continue to use the `dig` command until the ANSWER field returns a number greater than 0.
The following commands query one of the root servers, which points us to one of the authoritative servers for **.com** sites,
which points us to Google's custom nameserver, which finally provides an answer, in fact six answers, or six IP address that all map to **google.com**.

Step by step.
First we query the root server and specify that we're interested in the DNS path for `google.com`:

```
dig @e.root-servers.net google.com
```

The output shows that `ANSWER: 0` so we keep digging.
The `ADDITIONAL SECTION` points us to the next servers in the DNS path.
We can pick one and query that:

```
dig @a.gtld-servers.net google.com
```

Again, we see that `ANSWER: 0`, so we keep digging.
The `ADDITIONAL SECTION` points us to the next servers in the DNS path, which are Google's name servers.
We pick one and query that:

```
dig @ns1.google.com google.com
```

Here we see `ANSWER: 6`, which is greater than zero.
We now know the DNS path.

The output for the final `dig` command lists six servers.
Google and other major organizations often use multiple servers for load balancing, redundancy, and better geographic distribution of requests.
These servers are indicated by the **A records** in the DNS output.

Many large organizations, especially ISPs, function as **autonomous systems (AS)**.
These systems are large collections of IP networks under the control of a single organization and
they work to present a common routing policy to the internet.
Remember that the internet is an internet of internets!

We can get more information about Google as an autonomous system by locating its **AS number** or **ASN**.
We do this by using the `whois` command on one of the IP addresses listed in the final `ANSWER SECTION` from the last output:

```
whois 142.250.31.113
```

The output should include `OriginAS: AS15169`.
This is Google's ASN.
Autonomous systems need to communicate with other autonomous systems.
This is managed by the **Border Gateway Protocol (BGP)**.
This is a core routing protocol that manages how packets are routed across the internet between autonomous systems.
BGP's role is to determine the **best path** for data to travel from one AS to another.
BGP therefore functions as the "postal service of the internet."
For a humorous (but real) take on BGP, see [The Internet's Most Broken Protocol][bgp_broken].

Alternatively, we can query UK's:

```
dig @j.root-servers.net. uky.edu
dig @b.edu-servers.net. uky.edu
dig @sndc1.net.uky.edu. uky.edu
```

We can also get this path information using `dig`'s trace command:

```
dig google.com +trace
```

There are a lot of [ways to use the dig command][dig_commands], and you can test and explore them on your own.

### DNS Record Types

The **A record** in the `dig` output from the above examples shows the mapping between the hostname and the IPv4 address.
There are other types of internet records, and we can use the `dig` command to get information about additional these record types.
Some of the more useful records include:

* IN:       Internet Record
* SOA:      Start of Authority: describes the site's DNS entries, or the
  primary name server and the responsible contact information
* NS:       Name Server: state the name servers that provide DNS resolution
* A:        Address records: provides mapping hostname to IPv4 address
* AAAA:     Address records: provides mapping hostname to IPv6 address
* TXT:      TXT records contain verification data for various services
* MX:       Mail exchanger: the MX record maps to email servers.
* PTR:    Pointer record: provides mapping from IP Address to Hostname. This is
  like the opposite of an **A record** and allows us to do reverse lookups..
* CNAME:  Canonical name: this is used to alias one domain name to another,
  such as `www.uky.edu` to `uky.edu` (see discussion above).

To get as much information from the `dig` command at one time, we use the following `dig` command:

```
dig uky.edu ANY
```

### DNS Toolbox

It's important to be able to troubleshoot DNS issues.
To do that, we have a few utilities available.
Here are examples and you should read the ``man`` pages for each one:

#### `host` Command

The `host` command is used to perform DNS lookups and returns information about a domain name or IP address.
Specifically, the `host` command resolves hostnames to IP Address; or IP addresses to hostnames.

The following command **queries** the domain name `uky.edu` and returns the IP address associated with that domain name:

```
host uky.edu
uky.edu has address 128.163.35.46
```

With the `-t` option, you can get IP address information for specific record types.
The following queries the `MX` records (email servers) for the respective domains:

```
host -t MX uky.edu
host -t MX dropbox.com
host -t MX netflix.com
host -t MX wikipedia.org
```

For example, `host -t MX uky.edu` tells us that UK uses Microsoft Outlook for `uky.edu` email addresses and
`host -t MX g.uky.edu` tells us that UK uses the Google suite for `g.uky.edu` email addresses.

#### `dig` Command

As discussed above,
the `dig` command (Domain Information Groper) is used to retrieve DNS records, providing detailed information about how DNS resolution occurs.

We can use `dig` to query `uky.edu` (I've removed extraneous output):

```
dig uky.edu
;; ANSWER SECTION:
uky.edu.		3539	IN	A	128.163.35.46
```

- **ANSWER SECTION**: This contains the result of our query.
- **Domain** (`uky.edu`): The domain name being queried.
- **TTL** (`3539`): Time to Live, or how long the result is cached.
- **IN**: Internet class.
- **A**: Record type, in this case this refers to an IPv4 address.
- **IP Address** (`128.163.35.46`): The IP address that corresponds to the queried domain.

We can use `dig` to examine other record types in the following ways:

```
dig uky.edu MX
dig www.uky.edu CNAME
```

#### `nslookup` Command

The `nslookup` command queries Internet name servers interactively to find DNS-related information about a domain.

```
nslookup
> uky.edu
> Server:   127.0.0.53
> Address:  127.0.0.53#53

Non-authoritative answer:
Name:   uky.edu
Address: 128.163.35.46
> exit
```

Explanation:

- **Server**: The DNS server used for the lookup. In this case, the server is
  `127.0.0.53`, which falls within the loopback address range (`127.0.0.0/8`).
  This is used by `systemd-resolved`, which is a local DNS resolver and caching
  service that handles DNS lookups on our systems.
- **Address**: The number `53` after the `#` represents the **port number**
  (see `/etc/services` for list of port numbers). This port number is the
  standard for DNS queries. So, `127.0.0.53#53` indicates that the DNS server
  listening at `127.0.0.53` is accepting requests on port 53.
- **Non-authoritative answer**: This indicates that the response is coming from
  a cache, and not directly from an authoritative DNS server.
- **NAME** (`uky.edu`) and **Address** (`128.163.35.46`): The domain name and
  the corresponding IP address. 

Because of the role that `systemd` has here,
we can use the `resolvectl status` command to determine which external DNS servers are used behind the scenes.

#### `whois` Command

The `whois` command is used to look up information about who owns a particular domain name or IP address.

```
whois uky.edu | less
```

Example, abbreviated output:

```
Domain Name: UKY.EDU

Registrant:
    University of Kentucky
    118 Hardmon Building
    Lexington, KY 40506
    USA

Name Servers:
	SNDC1.NET.UKY.EDU
	SNDC2.NET.UKY.EDU
```

- **Domain Name**: The domain you queried.
- **Registrant**: The organization that registered the domain.
- **Name Servers**: The authoritative name servers for the domain.

While the `whois` command is a useful tool for retrieving information about domain ownership,
it's important to note that some domain owners choose to keep their information private.
Many domain registrars offer privacy protection services,
which replace the owner's contact information with generic information to protect their identity.
As a result, the output of a `whois` query may not always reveal the true owner of a domain,
showing only the registrar's privacy service instead.
This is particularly common for personal or small business domains to protect against spam or unwanted contact.

#### The `resolve.conf` File

The `resolve.conf` file contains local resolver info.
That is, it contains your your DNS information.

```
man -f  resolv.conf
resolv.conf (5) - resolver configuration file
cat /etc/resolv.conf
resolvectl status
```

## Conclusion

In the same way that phones have phone numbers to uniquely identify them, servers on the internet use IP addresses to enable communication.
Since we're only human, we don't remember every phone number that we dial or every IP address that we visit.
In order to make such things human friendly, we use names instead.

Nameservers and DNS records act as the phone book and phone book entries of the internet.
Note that I refer to the **internet** and not the **web** here.
The web is strictly defined or limited to the HTTP/HTTPS protocol, and 
there are protocols at the [OSI application layer][application_layer].
For example, email servers may also have domain names and IP addresses to resolve and use protocols like POP, IMAP, and SMTP.

In this section, we covered the basics of DNS that include:

- FQDN: the Fully Qualified Domain Name
- Root domains
- Top level domains (TLDs) and Country Code TLDS (ccTLDs)
- Second level and third level domains/subdomains
- DNS paths, and
- DNS record types

We also looked at several command line tools to query for information about the domain name system.

For web-based DNS tools, see [ViewDNS.info][viewdns].

[alt_dns]:https://en.wikipedia.org/wiki/Alternative_DNS_root
[alternic]:https://en.wikipedia.org/wiki/AlterNIC
[application_layer]:https://en.wikipedia.org/wiki/Application_layer
[bgp_broken]:https://www.youtube.com/watch?v=cOE2miIh1_o
[cctld]:https://en.wikipedia.org/wiki/Country_code_top-level_domain
[dig_commands]:https://www.geeksforgeeks.org/dig-command-in-linux-with-examples/
[dnsrecords]:https://www.youtube.com/watch?v=cwT82ibOM2Q
[fqdn]:https://en.wikipedia.org/wiki/Fully_qualified_domain_name
[howdns]:https://www.youtube.com/watch?v=mpQZVYPuDGU
[ieeerussia]:https://spectrum.ieee.org/tech-talk/telecom/internet/could-russia-really-build-its-own-alternate-internet
[opennic]:https://www.opennicproject.org/
[recursivedns]:https://www.cloudflare.com/learning/dns/what-is-recursive-dns/
[rootiana]:https://www.iana.org/domains/root/servers
[viewdns]:https://viewdns.info/
