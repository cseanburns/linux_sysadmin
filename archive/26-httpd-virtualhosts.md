# Apache VirtualHosts

In this tutorial, we use VirtualHosts so that our server may support
multiple domain names.

We do this by configuring Apache2 to recognize new DocumentRoot
directories for the additional domain names.

This allows us to serve multiple websites based on the same IP address.

## Update OS

As always, we need to keep our Fedora installation updated: 

```
dnf upgrade
```

## Create new configurations

So far we have learned how to create a main website at the following
document root:

**/var/www/html** 

We have also learned how to enable Apache2 to serve websites from user
directories:

**/home/USER/public&lowbar;html/**.

Websites that are stored at **/var/www/html** can eventually have a
domain name like **example.org** or **biguniversity.edu**. And then
websites at **/home/USER/public&lowbar;html/** would have URLs like
``http://biguniversity.edu/~USER``.

The problem with creating a website at the **/var/www/html** DocumentRoot
is that, by default, we can only create the one main site; so either
**example.org** or **biguniversity.edu** but not both.

*VirtualHosts* solve this problem. It allows a single server, with a
single IP address, to host websites linked to multiple domain names,
where all of these sites would have their own DocumentRoot directories
in the **/var/www/html** directory.

To start, we need to revisit the Apache configuration files and add
information about the VirtualHosts that we want to create. 

We begin by adding VirtualHost information to the following file:

```
less /etc/httpd/conf/httpd.conf
```

That file includes the following line:

- ``IncludeOptional conf.d/*.conf``

That option tells the Apache2 service to look for additional configuration
files in the **conf.d/** directory. Per that above line, the configuration
files that we add will need to end with **.conf**.

To get started, we'll name the files after some pretend domain names. I'll
create a domain called **linuxonenterprise.com** and another one called
**websysadmins.com**:

```
cd /etc/httpd/conf.d/
touch linuxonenterprise.conf
```

In the **linuxonenterprise.conf** file, I'll add the following info:

```
<VirtualHost *:80>
ServerAdmin webmaster@linuxonenterprise.com
DocumentRoot "/var/www/html/linuxonenterprise/"
ServerName linuxonenterprise.com
ServerAlias www.linuxonenterprise.com
ErrorLog "/var/log/httpd/linuxonenterprise.com-error_log"
CustomLog "/var/log/httpd/linuxonenterprise.com-access_log" combined

<Directory "/var/www/html/linuxonenterprise/">
DirectoryIndex index.php index.html
Options FollowSymLinks
AllowOverride All
Require all granted
</Directory>
</VirtualHost>
```

Then I'll repeat the process with a new file called **websysadmins.conf**.
To make life easier, I can copy the **linuxonenterprise.conf** to
**websysadmins.conf**.

```
cp linuxonenterprise.conf websysadmins.conf
```

And edit the websysadmins.conf file accordingly by replacing the names
of the site:

```
<VirtualHost *:80>
ServerAdmin webmaster@websysadmins.com
DocumentRoot "/var/www/html/websysadmins/"
ServerName websysadmins.com
ServerAlias www.websysadmins.com
ErrorLog "/var/log/httpd/websysadmins.com-error_log"
CustomLog "/var/log/httpd/websysadmins.com-access_log" combined

<Directory "/var/www/html/websysadmins/">
DirectoryIndex index.html index.php
Options FollowSymLinks
AllowOverride All
Require all granted
</Directory>
</VirtualHost>
```

When done, I'll exit out of my text editor and check the configuration
syntax with one of the following two commands:

```
httpd -t
apachectl configtest
```

You should get an error stating that the sites don't exist at the
**DocumentRoot**, but we'll fix that in a second. For now, you want to get
a ``Syntax OK`` message.

## Creating the sites

The above two files tell Apache2 to look for the two websites
in:

- ``/var/www/html/linuxonenterprise``
- ``/var/www/html/websysadmins``

These are the **DocumentRoot**, i.e., the base directories for our
websites. We need to create those locations. I'll do that now for my
two domains, and I'll use Bash brace expansion to create both at the
same time:

```
mkdir /var/www/html/{linuxonenterprise,websysadmins}
```

The above command creates two directories:

* /var/www/html/linuxonenterprise
* /var/www/html/websysadmins

Now create some basic web pages in each domain directory:

```
cd /var/www/html/linuxonenterprise
echo "<h1>Linux on the Enterprise</h1>" >> index.html
```

Then ``cd`` to **websysadmins** from the **linuxonenterprise** directory:

```
cd ../websysadmins
echo "<h1>Web Sys Admins</h1>" >> index.html
```

And now we have to make sure that the user ``apache`` owns
those two directories and all future files in them. We use
the user ``apache`` because the main Apache2 configuration file
(``/etc/httpd/conf/httpd.conf``) has two directives that state that the
names of the User/Group should be ``apache``:

```
cd .. # to return to the parent directory
chgrp -R apache /var/www/html/
chmod 2775 -R /var/www/html
```

By adding our account to the ``apache`` group, we can edit these and all
future files without using ``sudo`` or becoming ``root``. Here I make user
'sean' part of the ``apache`` group:

```
usermod -a -G apache sean
```

This group addition will not go into effect until the user logs out and
logs back in.

You can run ``ls -ld`` and ``ls -l`` on those directories and files to
confirm that the ``apache`` owner owns them. You can also run ``httpd -t``
or ``apachectl configtest`` again to confirm that all the syntax is good.

## The Hosts File: ``/etc/hosts``

In order to resolve IP address to domain names, we need some kind of
system that will map these two identifiers to each other. We have already
covered DNS more extensively, but since we're not really creating new
websites for the web, we'll repeat what we did in the previous weeks
with the ``/etc/hosts`` file.

The ``/etc/hosts`` file is like a basic DNS system and we can use as a
"static table lookup for hostnames" (from ``man hosts``). Let's modify
this so that our IP address is mapped to the our domain names. To do
that, let's add the following line just after the two localhost lines:
(**USE YOUR IP NOT MINE**)

```
ip a
192.168.4.32
sudo nano /etc/hosts
```

Then let's map the IP address to the hostnames that we'll use for the
new websites.  Add the following to ``/etc/hosts``, but replace my IP
with yours and my hostname with one of your own creation:

```
192.168.4.32 linuxonenterprise.com
192.168.4.32 websysadmins.com
```

This is one way to create a kind of intranet that uses actual names instead of
just IP addresses. Say that you have a home network and one of the computers on
your network is running a web server. If you assign a static IP to this
computer using the software on your home router, modify the ``/etc/hosts``
files on each of those three computers to point to that static IP via a domain
name, then you have basic DNS system for your subnet.

Now, let's restart Apache2 and see if we can visit our sites.

```
systemctl reload httpd.service
systemctl restart httpd.service
w3m http://linuxonenterprise.com
w3m http://websysadmins.com
```

Success!

If you change the ``/etc/hosts`` file on your **host** machine (i.e., your
laptop) per the instructions in the last lecture, then you should be able to
visit ``http://linuxonenterprise.com`` and ``http://websysadmins.com`` in your
browser. Here is a snippet of what my ``/etc/hosts`` file looks like on my
desktop machine (i.e., my **host** machine):

```
127.0.0.1      localhost
127.0.1.1      desktop
192.168.4.32    linuxonenterprise.com
192.168.4.32    websysadmins.com
```

## References

* [Name-based Virtual Host Support][namevhost]
* [VirtualHost Examples][vhostex]
* [How to set up Apache Virtual Hosts on CentOS 7][vhostapache2]

[namevhost]:https://httpd.apache.org/docs/2.2/vhosts/name-based.html
[vhostex]:https://httpd.apache.org/docs/2.4/vhosts/examples.html
[vhostapache2]:https://www.rosehosting.com/blog/apache-virtual-hosts-on-centos/
