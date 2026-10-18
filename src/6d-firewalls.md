# Firewalls

By the end of this section, you should know:

1. **The Role of Firewalls in Network Security**:
    - How firewalls control incoming (ingress) and outgoing (egress) traffic at different network layers.
    - The difference between link, IP, transport, and application layer rules.
2. **Firewall Configuration in Cloud and Local Environments**:
    - How to create, manage, and prioritize firewall rules using the VPC network interface.
    - How to use the VPC's firewall capabilities to block specific types of traffic, such as ICMP (used by tools like `ping` and `traceroute`).
3. **Configuring Local Firewalls with Ubuntu's `ufw`**:
    - How to enable and disable `ufw` for local firewall management on Ubuntu systems.
    - Basic commands to allow or deny access to specific ports or services, such as SSH (port 22) or HTTP (port 80).
    - The use of application profiles in `/etc/ufw/applications.d` to simplify firewall rule creation for services like Apache.

## Getting Started

Most security challenges come from outside of a local network, and the attack vectors are fairly broad.
To reduce our system's vulnerabilities, a systems administrator must be able to handle the following kinds of tasks:

* firewall configuration and management
* access control management
* network monitoring and intrusion detection
* patch management
* VPN configuration and management
* network segmentation
* password and authentication policy enforcement
* logging and auditing
* security policies and documentation
* incident response and disaster recovery planning
* security vulnerability assessments
* network hardening
* encryption implementation
* DNS security
* endpoint security integration

We have covered some of the tasks above.
For example, we learned how to create user accounts and password policies, and both of these are a form of access control management.
We learned about sub-networking, which is a form of network segmentation.
We learned about the DNS system, which is a fundamental aspect of DNS security.
We touched on `bash` scripts, which can be created to automate log file evaluation, which is helpful to understand logging and auditing.
We learned how to install software and keep our systems updated, which is a form of patch management.
Although we can only cover so much and there is a lot more to learn, in this section we'll begin to learn firewall configuration and management.
We will also learn how to create systematic backups of our instances, which is an important part of disaster recovery planning.

## Firewalls

A firewall program allows or denies connections for incoming (aka, **ingress**) or outgoing (aka, **egress**) traffic.
Traffic can be controlled through the:

- link layer: a network interface such as an ethernet or wireless card,
- IP layer: IPv4 or IPv6 address or address ranges,
- transport layer: TCP, UDP, ICMP, etc., or
- by the application layer via port numbers: HTTP (port 80), HTTPS (port 443), SSH (port 22), SMTP (port 465), etc.

Firewalls have other abilities.
For example, they can be used to:

- place limits on the number of attempts to connect,
- create virtual private networks, and
- throttle bandwidth for certain applications, ports, etc.

> As a side note, bare metal servers may have multiple ethernet network interface cards (NICs).
> Each NIC would, of course, have its own MAC address and can be assigned different IP addresses.
> Thus, incoming connections can be completely blocked on one card and outgoing connections can be completely blocked on the other.

To manage these connections, firewalls apply **rules**.
A rule may block all incoming connections, but then allow SSH traffic through port 22, either via TCP or UDP, and then further restrict SSH connections to a specific IP range.
And/or, another rule may block all incoming, unencrypted HTTP connections through port 80, but allow all incoming, encrypted HTTPS connections through port 443.

### Firewalls on Digital Ocean

Let's cover using DigitalOcean to create a basic firewall rule.
This will prepare us for setting up new rules when we configure our **LAMP** servers in the next section.

> LAMP originally referred to **Linux**, **Apache**, **MySQL**, and **PHP**.
> These four technologies together create a web server.
> Technically, only Linux (or some other OS) and Apache (or some other web server software) are needed to serve a website.
> At a basic level, all a web server does is open up an operating system's filesystem to the world.
> But PHP and MySQL provide additional functionality, like the ability for a website to create an interaction between a user's input and with data in a relational database.
> The **M** in LAMP may also refer to MariaDB, which is a fully open source clone of MySQL.
> Other relational databases are usable, such as [PostgreSQL][postgresql] or [SQLite][sqlite].
> We'll use MariaDB later in this course.

#### Block `ping` Application from the Cloud Provider

We'll begin by implementing a basic firewall rule where we block incoming [ICMP traffic][icmp].
ICMP traffic is used by several applications, such as `ping` and `traceroute`.
The `ping` command is a simple tool used to test whether a server at an IP address or domain is running.
It's therefore useful for error reporting and network diagnostics.
The `traceroute` command is used to display the path between two internet devices.
While both have their uses, we may want to block that traffic to prevent others from gaining information about our servers.

> To see how this works, let's test `ping` first on your machines.
> First, identify the public/external IP address of your virtual machine.
> Let's say it's `34.345.345.222`.
> Open your macOS `Terminal.app` or Windows Command or Powershell.
> Then run the command: `ping 34.345.345.222` (of course, use your VM's external IP).
> You should get a response.
> To end the `ping` session, press `ctrl-c`.

Now let's block ICMP traffic:

1. Open your project in the DigitalOcean Console.
1. Click on the name of your server.
1. Click on **Networking**.
1. Click on **Manage Cloud Firewalls**.
1. Click on **Create Firewall**.
1. Click on **+Add another** under the **Add inbound rules** section.
1. Click on **Deny**.
1. Select **ICMP** under **Type**.
1. In the Sources field, deselect **All IPv4** and **All IPv6**.
1. Put your cursor in the Sources field and select your droplet's name.
1. Select **Add inbound rule.**
1. In the **Choose a name** section, add a name for your firewall rule: e.g., **block-icmp**.
1. Click on **Create Firewall**.

Once the rule has been created, re-run the `ping` command.
You should not see any responses this time.

Once you have tested this rule, delete the rule.
To delete it, select the triple dots next to the rule, and then click the **Destroy** button.
Once the rule is deleted, you can re-run the `ping` command to test if your server is responding again.

### OS Firewall Applications

In case you are working on firewalls on a specific machine instead of on the cloud, then you would want to become familiar with Linux-based firewall applications.

On Ubuntu, the main firewall application is [ufw][ufwDocs].
On RedHat-based distributions, the main firewall application is [firewalld][firewalld].
These firewall applications are user-friendly front-ends of the [iptables][iptables] firewall application, which is built into the Linux kernel.
FreeBSD and OpenBSD, two non-Linux but Unix-like operating systems, offer `pf`: [`pf` on FreeBSD][pf_freebsd] and [`pf` on OpenBSD][pf_openbsd].
These BSD OSes are often used to build firewall servers.

`ufw` (Uncomplicated Firewall) is a user-friendly command-line firewall utility.
Although we are using an Ubuntu distribution as our virtual machines, Ubuntu's `ufw` firewall is disabled by default.

#### Basic Features

Reminder that `sudo` is not needed if you are logged in as the root user.

- **Enable/Disable Firewall**:
    - Enable: `sudo ufw enable`
    - Disable: `sudo ufw disable`
- **Allow/Deny Access**:
    - Allow access to port 22 (`ssh`): `sudo ufw allow 22`
    - Deny access to port 80 (`http`): `sudo ufw deny 80`
    - Other services can be set based on the contents of the `/etc/services` file.
- **Status and Logging**:
    - Check `ufw` status: `sudo ufw status` 
    - Log firewall entries: `sudo ufw logging on`
    - Change logging level: `sudo ufw logging low`
    - View log entries: `sudo less /var/log/ufw.log`

`ufw` can also control the firewall based on a list of profiles and predefined rules.
These profiles and predefined rules are contained in the `/etc/ufw/applications.d` directory.
Currently, there is only a profile for the OpenSSH server, but later in the semester, we'll find protocols for the `apache` server, such as **Apache**, **Apache Secure**, and **Apache Full**.
These profiles are defined in `/etc/ufw/applications.d/`.
For example, the Apache profiles will be defined in the `/etc/ufw/applications.d/apache2-utils.ufw.profile` file:

```
[Apache]
title=Web Server
description=Apache v2 is the next generation of the omnipresent Apache web server.
ports=80/tcp

[Apache Secure]
title=Web Server (HTTPS)
description=Apache v2 is the next generation of the omnipresent Apache web server.
ports=443/tcp

[Apache Full]
title=Web Server (HTTP,HTTPS)
description=Apache v2 is the next generation of the omnipresent Apache web server.
ports=80,443/tcp
```

Based on the above profiles, we can set `ufw` for Apache like so:

```
sudo ufw allow 'Apache Full'
```
 
To see other examples, read: [ufw documentation][ufw_help].
When you use a RedHat or like distribution of Linux, then checkout [A Beginner's Guide to firewalld in Linux][redhad_firewalld].

#### Block `ping` from the OS

Although the `ufw` command offers some quick and easy options for allowing and denying some types of traffic, it doesn't offer this for all kinds of traffic.
There is no built-in `ufw deny icmp` command or application profile for blocking `ping`.
Application profiles describe TCP or UDP ports, while ICMP does not use ports.
Instead, we can edit the rules that `ufw` loads before its ordinary service rules.

For this exercise, we will block incoming ICMP **echo requests**, which are used by `ping`, rather than all ICMP traffic.
Other ICMP messages support error reporting and normal network operation, especially with IPv6.
The default incoming policy alone does not block `ping` because `ufw` explicitly allows echo requests in its earlier rules.
See the [ufw manual](https://manpages.ubuntu.com/manpages/jammy/man8/ufw.8.html) for details about these rules.

On our servers, `ufw` is already installed but is not enabled.
First, set the default policies and allow SSH before enabling the firewall:

```
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
```

If your SSH server uses a different port, allow that port instead.
Also allow any other services that need to remain accessible before enabling the firewall.
Keep your current SSH session open while completing this exercise.

Back up and open the IPv4 rules file:

```
sudo cp -a /etc/ufw/before.rules /etc/ufw/before.rules.bak
sudo nano /etc/ufw/before.rules
```

Find this incoming echo-request rule:

```
-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT
```

Change only that rule's `ACCEPT` action to `DROP`:

```
-A ufw-before-input -p icmp --icmp-type echo-request -j DROP
```

Save the file and exit the editor.
If IPv6 is enabled, back up and open its rules file as well:

```
sudo cp -a /etc/ufw/before6.rules /etc/ufw/before6.rules.bak
sudo nano /etc/ufw/before6.rules
```

Find the incoming IPv6 echo-request rule and change its action from `ACCEPT` to `DROP`, so that it reads:

```
-A ufw6-before-input -p icmpv6 --icmpv6-type echo-request -j DROP
```

Leave the other ICMP and ICMPv6 rules intact.
Save the file, then enable the firewall and load the changes:

```
sudo ufw enable
sudo ufw reload
sudo ufw status verbose
```

Verify that you can open a second SSH connection before closing your original session.
From your own computer, test your server's public IPv4 address with `ping` again.
New incoming ping requests should time out, while SSH should still work.
If the server has a public IPv6 address, test that address separately with your computer's IPv6 ping option.
Make sure any cloud firewall permits the test traffic; otherwise, a timeout does not establish that the OS firewall blocked it.

The `ufw status` command does not display these custom rules from the `before.rules` files, so use the external ping test to check their effect.
The server can still initiate outgoing pings because we have blocked incoming echo requests, not outgoing requests or incoming echo replies.

To allow incoming pings again, change the edited echo-request actions from `DROP` back to `ACCEPT` and reload the firewall:

```
sudo ufw reload
```

Repeat the external ping test to verify that the server responds again.

## Conclusion

System security involves a multi-vectored approach that includes many tasks, from password management to log audits.
In this section, we covered firewalls.
Since we're running an Ubuntu server on DigitalOcean, we have that platform's options for creating firewall rules at the network level or the OS's own methods for doing so.

[firewalld]:https://docs.fedoraproject.org/en-US/quick-docs/firewalld/
[icmp]:https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol
[iptables]:https://www.netfilter.org/
[pf_freebsd]:https://docs.freebsd.org/en/books/handbook/firewalls/
[pf_openbsd]:https://www.openbsd.org/faq/pf/
[postgresql]:https://www.postgresql.org/
[redhad_firewalld]:https://www.redhat.com/en/blog/beginners-guide-firewalld
[sqlite]:https://www.sqlite.org/
[ufwDocs]:https://help.ubuntu.com/community/UFW
[ufw_help]:https://ubuntu.com/server/docs/firewalls

