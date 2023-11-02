# Firewalls and Backups

Ensuring the security and
resilience of our systems is paramount.
This section delves
into the dual realms
of firewalls and backups,
integral components of
a robust security framework.
We'll explore how firewalls
act as the gatekeepers,
monitoring and controlling
incoming and outgoing network traffic
based on predetermined security rules.
Using our Google Cloud virtual instance,
I will demonstrate how
to create basic firewall rules
to allow or deny
incoming or outgoing network traffic,
and I will show how to use
snapshots in a Google Cloud virtual instance
to backup a virtual instance.
Creating backups is a crucial line
of defense against data loss.
Using Ubuntu's `ufw` and the `rsync` command,
I will illustrate how these tools
can be employed
to fortify non-cloud machines.

## Firewalls

A firewall program allows or denies connections for
incoming (**ingress**) or outgoing (**egress**) traffic.
Traffic can be controlled by link layer
(e.g., a network interface such as an ethernet or wireless card),
by IP layer,
e.g., IPv4 or IPv6 address or address ranges;
by transport layer,
e.g., TCP, UDP, ICMP, etc.;
or by application layer via port numbers,
e.g., HTTP (port 80), HTTPS (port 443),
SSH (port 22), SMTP (port 465), etc.
Firewalls have other abilities.
For example, they can also place limits
on the number of attempts to connect,
used to create virtual private networks,
and some firewall applications can
throttle bandwidth for certain applications, ports, etc..

> As a side note, physical, bare metal servers
> may have multiple ethernet
> network interface cards (NICs).
> Each NIC would, of course, have its own MAC address,
> and therefore would be assigned different IP addresses.
> Thus, at the link layer, incoming connections can be
> completely blocked on one card and then outgoing connections
> can be completely blocked on the other.
> This is a made up scenario.
> In practice, whatever firewall rules in place would
> be such that would make sense for the person or
> organization creating them.

To control these types of connections,
firewalls apply **rules**.
A rule may block all incoming connections, but
then allow SSH traffic through port 22,
either via TCP or UDP, and
then further restrict SSH connections to a
specific IP range.
And/or, another rule may block all incoming,
unencrypted HTTP connections through port 80, but
allow all incoming, encrypted HTTPS connections 
through port 443.

Let's cover using Google Cloud to create
a basic firewall rule.
This will prepare us for setting
up new rules when we configure our LAMP servers
in the next section.

> LAMP originally referred to Linux, Apache, MySQL, and PHP;
> these four technologies create a web server.
> Technically, only Linux (or some other OS) and
> Apache (or some other web server software)
> are needed to serve a website.
> PHP and MySQL provide additional functionality,
> like the ability for a website to interact with a
> relational database.
> The **M** in LAMP may also refer to MariaDB,
> which is a fully open source clone of MySQL.
> We'll use MariaDB later in this course.

First, our Google Cloud instance is
[pre-populated with default firewall rules][prepopDefault]
at the network level, and
the [documentation][vpcFirewallOverview]
provides an overview of these rules.

### Block the `ping` application

Let's implement a basic firewall rule
where we block incoming ICMP traffic
that's used by the `ping` command.

1. In the Google Cloud Console, click on **VPC network** and select
   **Firewall**.
2. The default VPC firewall rules are listed that allow for HTTP, ICMP, RDP,
   and SSH traffic.
3. Priority settings are set for each rule. Lower numbers mean the rules have a
   higher priority.
4. The predefined rules allow for incoming ICMP traffic set at a priority level
   of 65534.
5. We could delete that, but we should leave these rules in place and create a
   higher priority rule that will supersede that.
6. Click on **Create Firewall Rule**.
7. For name, enter **new-deny-icmp**.
8. Keep priority at 1000.
9. Under **Direction of traffic**, keep as **Ingress**.
10. Under **Action on match**, select **Deny**.
11. In the **Source IPv4** ranges, enter **0.0.0.0/0** for all network traffic.
12. Under **Protocols and ports**, select **Other**, and type in **icmp**.
13. Click the **Create** button to create the rule.

On the **VM instances** page,
you can find the external IP address
for your virtual machine.
For example,
let's say mine is 33.333.333.100.
From my laptop,
if I try to ping that IP address,
I won't get a response.

Once you have tested this rule,
please delete it.
Select the check box next to the rule,
and then click the **Delete** button.

Google's Firewall rules,
at extra cost,
now offer the ability to
block specific domains
(FQDN-based firewalls)
and to block geographial regions.

### OS Firewall Applications

In case you are working on firewalls
on a specific machine instead of
on the cloud,
then you would want to become
familiar with Linux-based firewall applications.

On Ubuntu, the main firewall application is
[`ufw`][ufwDocs].
On RedHat-based distributions,
the main firewall application is
[`firewalld`][firewalld].
Both of these firewall applications
are user-friendly frontends of
the [`iptables`][iptables] firewall application,
which is built into the Linux kernel.
FreeBSD and OpenBSD,
two non-Linux but Unix-like operating systems,
offer `pf`:
[PF on FreeBSD][pf_freebsd] and
[PF on OpenBSD][pf_openbsd].
These *BSD OSes are often used
to build firewall servers.

Although we are using an
Ubuntu distribution as our virtual machines,
Ubuntu's ``ufw`` firewall
is disabled by default.
Likely because it may be overkill to use both
Google Cloud's firewall and Ubuntu's ``ufw``.

## Backups

Catastrophes
(natural, physical, criminal, or out of negligence)
happen, and
as a systems administrator,
you may be required to have backup strategies
to mitigate data loss.

How you backup depends on the machine.
If I am managing physical hardware,
for instance,
and I want to backup a
physical disk to another physical disk,
then that requires a specific tool.
However, if I am managing virtual machines,
like our Google Cloud instance,
then that requires a different tool.
Therefore, in this section,
I will briefly cover both scenarios.

### Google Cloud Snapshots

Since our instance on Google Cloud is a virtual machine,
we can use the Google Cloud console to create 
**snapshots** of our instance.
A **snapshot** is a copy of a virtual machine at 
the time the snapshot was taken.
What's great about taking a snapshot is that
the result is basically a file of a complete operating system.
Since it's a file,
it can itself be used in other projects or used
to restore a machine to the time the snapshot was taken.

Snapshots may also be used to document or reproduce work.
For example, if I worked with programmers,
as a systems administrator,
I might help a programmer share snapshots of a virtual
machine with other programmers.
Those other programmers could then restore
the snapshot in their own instances,
and see and run the original work
in the environment it was created in.

Taking snapshots in Google Cloud is very straightforward, but
since it does take up extra storage,
it will accrue extra costs.
Since we want avoid that for now,
please see the following documentation for how to take
a snapshot in Google Cloud:

[Create and manage disk snapshots][gcloudDiskSnapshots]

1. Click on **Compute Engine**.
2. Click on **Snapshots**.
3. Click on **Create Snapshot**.
4. Enter a name for your snapshot.
5. Select the **Source disk**.
6. Select **Snapshot** under the **Type** section.
7. Click on **Create**.

### `rsync`

If we were managing bare metal machines, then
we might use a program like ``rsync`` to backup
physical disk drives.
``rsync`` is a powerful program.
It can copy disks, directories, and files.
It can copy files from one location,
and send the copies, encrypted, to a remote server.

For example, let's say I mount an external hard drive
to my filesystem at **/mnt/backup**.
To copy my home directory,
I'd use:

```
rsync -av /home/me/ /mnt/backup/
```

where **/home/me/** is the **source directory**, and
**/mnt/backup/** is the **destination directory**.

Syntax matters here.
If I include the trailing slash on
the source directory,
then ``rsync`` will copy everything in **/home/me/**
to **/mnt/backup/**.
However, if I leave the trailing slash off,
like so:

```
rsync -av /home/me /mnt/backup/
```

then the result will be that the directory **me/**
will be copied to **/mnt/backup/me/**.

Let's see this in action.
Say I have two directories.
In the **tmp1/** directory,
there are two files: **file1** and **file2**.
The **tmp2/** directory is empty.
To copy **file1** and **file2** to **tmp2**, then:


```
ls tmp1/
file1 file2
rsync -av tmp1/ tmp2/
ls tmp2
file1 file2
```

However, if I leave that trailing slash
off the source directory,
then the **tmp1/** will get copied to **tmp2/**:

```
ls tmp1
file1 file2
rsync -av tmp1 tmp2/
ls tmp2/
tmp1/
ls tmp2/tmp1/
file1 file2
```

``rsync`` can also send a source directory
to a directory on a remote server, and
the directory and files being copied will
be encrypted on the way.
To do this, we use ``ssh`` style syntax:

```
rsync -av tmp1/ USER@REMOTE:~/tmp2/
```

For example:

```
rsync -av tmp1 linus@222.22.33.333:~/tmp2/
```

In fact, not only do I use ``rsync`` to backup
my desktop computer to external hard drives,
I also use a command like the above to copy
local web projects to remote servers.

### Delete Option

``rsync`` has a
``--delete`` option.
Adding this option means that ``rsync`` will
synchronize the source directory with the destination directory.
This means that if I had already created a backup
of **tmp1** to **tmp2**, and 
then delete **file1** in **tmp1** later,
then run ``rsync`` with the delete option,
then ``rsync`` will also delete **file1** from **tmp2/**.
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

Backups are no good if we don't know how to restore
a backup to a disk.
To restore with ``rsync``, we just reverse the
destination directory with the source directory:

```
rsync -av tmp2/ tmp1/
```

## Conclusion

In this section,
we covered firewalls and backups.
Since we're running an Ubuntu server on Google Cloud,
we have Google Cloud options
for creating firewall rules at the network level and
for backing up disks as snapshots, and
we have Ubuntu options for creating firewall rules at the OS level and
for backing up disks using commands like ``rsync``.

How we go about either depends entirely on our needs
or on our organization's needs.
But knowing these options exist and
the different reasons why we have these options,
provides quite a bit of utility.

[firewalld]:https://docs.fedoraproject.org/en-US/quick-docs/firewalld/
[gcloudDiskSnapshots]:https://cloud.google.com/compute/docs/disks/create-snapshots
[iptables]:https://www.netfilter.org/
[pf_freebsd]:https://docs.freebsd.org/en/books/handbook/firewalls/
[pf_openbsd]:https://www.openbsd.org/faq/pf/
[prepopDefault]:https://cloud.google.com/vpc/docs/firewalls#more_rules_default_vpc
[ufwDocs]:https://help.ubuntu.com/community/UFW
[vpcFirewallOverview]:https://cloud.google.com/vpc/docs/firewalls
