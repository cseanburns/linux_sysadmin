# Firewalls and Backups

By the end of this section, you should know:

1. **The Role of Firewalls in Network Security**:
    - How firewalls control incoming (ingress) and outgoing (egress) traffic at different network layers.
    - The difference between link, IP, transport, and application layer rules.
2. **Firewall Configuration in Cloud and Local Environments**:
    - How to create, manage, and prioritize firewall rules in Google Cloud using the VPC network interface.
    - How to use Google Cloud's firewall capabilities to block specific types of traffic, such as ICMP (used by tools like `ping` and `traceroute`).
3. **Understanding Google Cloud Firewall Features**:
    - The concept of default VPC firewall rules and how to override them with higher priority rules.
    - How to configure firewall rules to enhance security at the network level.
4. **Configuring Local Firewalls with Ubuntu's `ufw`**:
    - How to enable and disable `ufw` for local firewall management on Ubuntu systems.
    - Basic commands to allow or deny access to specific ports or services, such as SSH (port 22) or HTTP (port 80).
    - The use of application profiles in `/etc/ufw/applications.d` to simplify firewall rule creation for services like Apache.
5. **Backup Strategies for Physical and Cloud Systems**:
    - The difference between backing up virtual machines with Google Cloud snapshots and using local tools for bare metal systems.
    - How to create and manage Google Cloud snapshots for disaster recovery and replication purposes.
6. **Using `rsync` for Backup and Synchronization**:
    - How to use `rsync` to copy files and directories locally and to a remote server over SSH.
    - The effect of the trailing slash in `rsync` commands, and how it changes the behavior of the copy operation.
    - How to use the `--delete` option in `rsync` to synchronize directories by removing files that no longer exist in the source directory.
7. **Understanding the Utility of Different Backup and Security Options**:
    - When to use Google Cloud firewall versus a local firewall (`ufw`) and when to use snapshots versus tools like `rsync` based on your needs.
    - The advantages and limitations of each approach to both firewall management and backup strategies.

## Getting Started

Most security challenges come from outside of a local network, and the attack vectors are fairly broad.
To reduce our system's vulnerabilities,
a systems administrator must be able to handle the following kinds of tasks:

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
For example, we learned how to create user accounts and password policies, and
both of these are a form of access control management.
We learned about sub-networking, which is a form of network segmentation.
We learned about the DNS system, which is a fundamental aspect of DNS security.
We touched on `bash` scripts, which can be created to automate log file evaluation,
which is helpful to understand logging and auditing.
We learned how to install software and keep our systems updated, which is a form of patch management.
Although we can only cover so much and there is a lot more to learn,
in this section we'll begin to learn firewall configuration and management.
We will also learn how to create systematic backups of our instances,
which is an important part of disaster recovery planning.

## Firewalls

A firewall program allows or denies connections for incoming (aka, **ingress**) or
outgoing (aka, **egress**) traffic.
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
> Each NIC would, of course, have its own MAC address, and therefore would be assigned different IP addresses.
> Thus, at the link layer, incoming connections can be completely blocked on one card and
  outgoing connections can be completely blocked on the other.

To manage these connections, firewalls apply **rules**.
A rule may block all incoming connections, but
then allow SSH traffic through port 22, either via TCP or UDP, and
then further restrict SSH connections to a specific IP range.
And/or, another rule may block all incoming, unencrypted HTTP connections through port 80,
but allow all incoming, encrypted HTTPS connections through port 443.

### Firewalls on Google Cloud

Let's cover using Google Cloud to create a basic firewall rule.
This will prepare us for setting up new rules when we configure our **LAMP** servers in the next section.

> LAMP originally referred to **Linux**, **Apache**, **MySQL**, and **PHP**.
> These four technologies together create a web server.
> Technically, only Linux (or some other OS) and Apache (or some other web server software) are needed to serve a website.
> At a basic level, all a web server does is open up an operating system's filesystem to the world.
> But PHP and MySQL provide additional functionality, like the ability for a website to create an interaction between a user's input and with data in a relational database.
> The **M** in LAMP may also refer to MariaDB, which is a fully open source clone of MySQL.
> Other relational databases are usable, such as [PostgreSQL][postgresql] or [SQLite][sqlite].
> We'll use MariaDB later in this course.

First review how our Google Cloud instances are
[pre-populated with default firewall rules][prepopDefault] at the network level.
Follow that with a review of the firewall [documentation][vpcFirewallOverview],
which provides an overview of the rules we'll use.

#### Block the `ping` application

We'll begin by implementing a basic firewall rule where we block incoming [ICMP traffic][icmp].
ICMP traffic is used by several applications, such as `ping` and `traceroute`.
The `ping` command is a simple tool used to test whether a server at an IP address or domain is running.
It's therefore useful for error reporting and network diagnostics.
The `traceroute` command is used to display the path between two internet devices.
While both have their uses,
we may want to block that traffic to prevent others from gaining information about our servers.
To do so:

1. In the Google Cloud Console, click on **VPC network** and select **Firewall**.
2. The default VPC firewall rules are listed that allow for HTTP, ICMP, RDP, and SSH traffic.
3. Priority settings are set for each rule. Lower numbers mean the rules have a higher priority.
4. The predefined rules allow for incoming ICMP traffic set at a priority level of 65534.
5. We could delete that, but we should leave these rules in place and create a higher priority rule that will supersede that.
6. Click on **Create Firewall Rule**.
7. For name, enter **new-deny-icmp**.
8. Keep priority at 1000.
9. Under **Direction of traffic**, keep as **Ingress**.
10. Under **Action on match**, select **Deny**.
11. In the **Source IPv4** ranges, enter **0.0.0.0/0** for all network traffic.
12. Under **Protocols and ports**, select **Other**, and type in **icmp**.
13. Click the **Create** button to create the rule.

On the **VM instances** page, you can find the external IP address for your virtual machine.
For example, let's say mine is 33.333.333.100.
After blocking ICMP traffice, if I try to ping that IP address, I should not get a response.

Once you have tested this rule, feel free to keep or delete it.
To delete it, select the check box next to the rule, and then click the **Delete** button.

> Note: Google's Firewall rules, at extra cost, now offer the ability to block
> specific domains (FQDN-based firewalls) and to block geographical regions.

### OS Firewall Applications

In case you are working on firewalls on a specific machine instead of on the cloud,
then you would want to become familiar with Linux-based firewall applications.

On Ubuntu, the main firewall application is [ufw][ufwDocs].
On RedHat-based distributions, the main firewall application is [firewalld][firewalld].
Both of these firewall applications are user-friendly front-ends of the
[iptables][iptables] firewall application, which is built into the Linux kernel.
Although we are using an Ubuntu distribution as our virtual machines,
Ubuntu's `ufw` firewall is disabled by default.
This is likely because it may be overkill to use both Google Cloud's firewall and Ubuntu's `ufw`.

> FreeBSD and OpenBSD, two non-Linux but Unix-like operating systems, offer `pf`:
> [`pf` on FreeBSD][pf_freebsd] and [`pf` on OpenBSD][pf_openbsd].
> These BSD OSes are often used to build firewall servers.

`ufw` (Uncomplicated Firewall) is a user-friendly command-line firewall utility.
It simplifies firewall configuration on Debian-based Linux operating systems, such as Ubuntu.
It is designed to provide a more user friendly interface to the underlying `iptables` application.
However, it is still powerful enough to secure a system effectively.

#### Basic Features

- **Enable/Disable Firewall**:
    - Enable: `sudo ufw enable`
    - Disable: `sudo ufw disable`
- Allow/Deny Access:
    - Allow access to port 22 (`ssh`): `sudo ufw allow 22`
    - Deny access to port 80 (`http`): `sudo ufw deny 80`
    - Other services can be set based on the contents of the `/etc/services` file.
- Status and Logging:
    - Check `ufw` status: `sudo ufw status` 
    - Log firewall entries: `sudo ufw logging on`
    - Change logging level: `sudo ufw logging low`
    - View log entries: `sudo less /var/log/ufw.log`

`ufw` can also control the firewall based on a list of profiles and predefined rules.
These profiles and predefined rules are contained in the `/etc/ufw/applications.d` directory.
For example, there are three protocols for the `apache2` web server:
**Apache**, **Apache Secure**, and **Apache Full**.
These are defined in `/etc/ufw/applications.d/apache2-utils.ufw.profile` file:

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

Based on the above profile, we can set `ufw` for Apache like so:

```
sudo ufw allow 'Apache Full'
```
 
To see other examples, read: [ufw documentation][ufw_help].
If you are using a RedHat distribution of Linux,
then checkout [A Beginner's Guide to firewalld in Linux][redhad_firewalld].

## Backups

Catastrophes (natural, physical, criminal, or out of negligence) happen.
As a systems administrator, you may be required to have backup strategies to mitigate data loss.

How you backup depends on the machine.
If I am managing bare metal, and I want to backup a physical disk to another physical disk,
then that requires a specific tool, like `rsync`.
However, if I am managing virtual machines, like our Google Cloud instance,
then that requires a different tool.
Therefore, in this section, I will briefly cover both scenarios.

### Google Cloud Snapshots

Since our instance on Google Cloud is a virtual machine,
we can use the Google Cloud console to create **snapshots** of our instance.
A **snapshot** is a copy of a virtual machine at the time the snapshot was taken.
What's great about taking a snapshot is that the result is basically a file of a complete operating system.
Since it's a file, it can itself be used in other projects or
used to restore a machine to the time the snapshot was taken.

Snapshots may also be used to document or reproduce work.
For example, if I worked with programmers, as a systems administrator,
I might help a programmer share snapshots of a virtual machine with other programmers.
Those other programmers could then restore the snapshot in their own instances, and
see and run the original work in the environment it was created in.

Taking snapshots in Google Cloud is very straightforward, but
since it does take up extra storage, it will accrue extra costs.
Since we want avoid that for now,
please see the following documentation for how to take a snapshot in Google Cloud:

[Create and manage disk snapshots][gcloudDiskSnapshots]

1. Click on **Compute Engine**.
2. Click on **Snapshots**.
3. Click on **Create Snapshot**.
4. Enter a name for your snapshot.
5. Select the **Source disk**.
6. Select **Snapshot** under the **Type** section.
7. Click on **Create**.

### `rsync`

If we were managing bare metal machines,
then we might use a program like `rsync` to backup physical disk drives.
`rsync` is a powerful program tha can copy disks, directories, and files.
It can copy files from one location, and send the copies, encrypted, to a remote server.

For example, let's say I mount an external hard drive to my filesystem at `/mnt/backup`.
To copy my home directory to `/mnt/backup`, I'd use:

```
rsync -av /home/me/ /mnt/backup/
```

where `/home/me/` is the **source directory**, and `/mnt/backup/` is the **destination directory**.

Syntax matters here.
If I include the trailing slash on the source directory, then
`rsync` copies everything in `/home/me/` to `/mnt/backup/`.
However, if I leave the trailing slash off, like so:

```
rsync -av /home/me /mnt/backup/
```

then the result will be that the directory `me/` will be copied to `/mnt/backup/me/`.

Let's see this in action.
Say I have two directories.
In the `tmp1/` directory, there are two files: `file1` and `file2`.
The `tmp2/` directory is empty.
To copy `file1` and `file2` to `tmp2`, then:

```
ls tmp1/
file1 file2
rsync -av tmp1/ tmp2/
ls tmp2
file1 file2
```

However, if I leave that trailing slash off the source directory, then the `tmp1/` will get copied to `tmp2/`:

```
ls tmp1
file1 file2
rsync -av tmp1 tmp2/
ls tmp2/
tmp1/
ls tmp2/tmp1/
file1 file2
```

`rsync` can also send a source directory to a directory on a remote server, and
the directory and files being copied will be encrypted on the way.
To do this, we use `ssh` style syntax:

```
rsync -av tmp1/ USER@REMOTE:~/tmp2/
```

For example:

```
rsync -av tmp1 linus@222.22.33.333:~/tmp2/
```

### Delete Option

`rsync` has a `--delete` option.
Adding this option means that `rsync` synchronizes the source directory with the destination directory.
This means that if I had already created a backup of `tmp1` to `tmp2`, and then delete `file1` in `tmp1` later,
then run `rsync` with the delete option, then `rsync` will also delete `file1` from `tmp2/`.
This is how that looks:

```
ls tmp1/
file1 file2
rsync -av tmp1/ tmp2/
ls tmp2/
file1 file2
rm tmp1/file1
ls tmp1/
file2
rsync -av --delete tmp1/ tmp2/
ls tmp2
file2
```

Backups are no good if we don't know how to restore a backup to a disk.
To restore with `rsync`, we just reverse the destination directory with the source directory:

```
rsync -av tmp2/ tmp1/
```

## Conclusion

System security involves a multi-vectored approach that includes many tasks,
from password management to log audits.
In this section, we covered firewalls and backups, and have thus addressed new vectors to protect:
firewall configuration and management and disaster recovery.

Since we're running an Ubuntu server on Google Cloud,
we have Google Cloud options for creating firewall rules at the network level and
for backing up disks as snapshots.
We also have Ubuntu options for creating firewall rules at the OS level using `ufw` and
for backing up disks using commands like `rsync`.
How we go about either depends entirely on our needs or on our organization's needs.
But knowing these options exist and the different reasons why we have these options,
provides quite a bit of utility.

[firewalld]:https://docs.fedoraproject.org/en-US/quick-docs/firewalld/
[gcloudDiskSnapshots]:https://cloud.google.com/compute/docs/disks/create-snapshots
[icmp]:https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol
[iptables]:https://www.netfilter.org/
[pf_freebsd]:https://docs.freebsd.org/en/books/handbook/firewalls/
[pf_openbsd]:https://www.openbsd.org/faq/pf/
[postgresql]:https://www.postgresql.org/
[prepopDefault]:https://cloud.google.com/vpc/docs/firewalls#more_rules_default_vpc
[redhad_firewalld]:https://www.redhat.com/en/blog/beginners-guide-firewalld
[sqlite]:https://www.sqlite.org/
[ufwDocs]:https://help.ubuntu.com/community/UFW
[ufw_help]:https://ubuntu.com/server/docs/firewalls
[vpcFirewallOverview]:https://cloud.google.com/vpc/docs/firewalls

