# Apache2 VirtualHosts

## Update OS

As always, let's update Fedora:

```
dnf upgrade
```

## Create new configurations

So far we have learned how to create a main website at **/var/www/html** and
then user websites at **/home/\$\{USER\}/public\_html/**. Websites that are
stored at **/var/www/html** can eventually have a domain name like
**example.org** or **biguniversity.edu**. And then websites at
**/home/\$\{USER\}/public\_html/** would have URLs like
**http://biguniversity.edu/~USER**. The problem with creating a website at
**/var/www/html** is that, by default, we can only use our machines to create
the one main site, so either **example.org** or **biguniversity.edu** but not
both. 

*VirtualHosts* solve this problem and allow a single server, with a single IP
address, to host websites linked to multiple domain names, and all of them
would be stored in the **/var/www/html** directory.

To start, we need to go back to the Apache configuration files and add
information about the virtual hosts that we want to create. We have two choices
about which files we can edit to include this information.

First choice, we can add virtual host information to the following file:

**/etc/httpd/conf/httpd.conf**

However, that same file includes a line (the ``IncludeOptional conf.d/*.conf``
line) that tells the Apache service to look for additional configuration files
for in the **/etc/conf.d/** directory. Per that above line, the files need to
end with **.conf**. This is the cleaner and more manageable method and we'll
follow that process.

To get started, we'll name the files after some pretend domain names but domain
names that we might actually want to have. I'll create a domain called
**linuxsysadmins.com** and another one called **websysadmins.com**:

```
cd /etc/httpd/conf.d/
touch linuxsysadmins.conf
```

In the **linuxsysadmins.conf** file, I'll add the following info:

```
<VirtualHost *:80>
ServerAdmin webmaster@linuxsysadmins.com
DocumentRoot "/var/www/html/linuxsysadmins/"
ServerName linuxsysadmins.com
ServerAlias www.linuxsysadmins.com
ErrorLog "/var/log/httpd/linuxsysadmins.com-error_log"
CustomLog "/var/log/httpd/linuxsysadmins.com-access_log" combined

<Directory "/var/www/html/linuxsysadmins/">
DirectoryIndex index.html index.php
Options FollowSymLinks
AllowOverride All
Require all granted
</Directory>
</VirtualHost>
```

Then I'll repeat the process with a new file called **websysadmins.conf**.
I can simply copy **linuxsysadmins.conf** to **websysadmins.conf**.

```
cp linuxsysadmins.conf websysadmins.conf
```

And edit the file accordingly:

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

When done, I'll exit out of my text editor and check the configuration syntax
with one of the following two commands:

```
httpd -t
apachectl configtest
```

You should get an error stating that the sites don't exist at the
**DocumentRoot**, but we'll fix that in a second. For now, you want to get
a ``Syntax OK`` message.

## Creating the sites

Now, the above two files tell Apache2 to look for the respective websites in
``/var/www/html/your_domain``. This is our **DocumentRoot**, i.e., the base
directory for our websites. We need to create those locations. I'll do that now
for my two domains, and I'll use a new trick, called brace expansion, to create
both at the same time:

```
mkdir /var/www/html/{linuxsysadmins,websysadmins}
```

The above command creates:

  - /var/www/html/linuxsysadmins
  - /var/www/html/websysadmins

Now let's create some basic web pages in each domain directory:

```
cd /var/www/html/linuxsysadmins
echo "<h1>Linux Sys Admins</h1>" >> index.html
```

Then ``cd`` to **websysadmins** from the **linuxsysadmins** directory:

```
cd ../websysadmins
echo "<h1>Web Sys Admins</h1>" >> index.html
```

And now we have to make sure that the user ``apache`` owns those two
directories and all future files in them. We use the user ``apache`` because
the main Apache2 configuration file (``/etc/httpd/conf/httpd.conf``) has two
directives that state that the names of the User/Group should be ``apache``:

```
cd .. # to return to the parent directory
chgrp -R apache /var/www/html/
chmod 2775 -R /var/www/html
```

By adding our account to the ``apache`` group, we can edit these and all future
files without using ``sudo`` or becoming ``root``:

```
usermod -aG apache $USER
```

You can run ``ls -l`` on those directories and files to confirm that the
``apache`` owner owns them. You can also run ``httpd -t`` or ``apachectl
configtest`` again to confirm that all the syntax is good.

## The Hosts File: ``/etc/hosts``

In order to resolve IP address to domain names, we need some kind of system
that will map these two identifiers to each other. We have already covered DNS
more extensively, but here we'll do something more basic.

The ``/etc/hosts`` file is like a basic DNS system and we can use it as
a "static table lookup for hostnames" (from ``man hosts``). Let's modify this
so that our IP address is mapped to the our domain names. To do that, let's add
the following line just after the two localhost lines: (**USE YOUR IP NOT MINE**) 

```
ip a
192.168.4.32
sudo nano /etc/hosts
```

Then let's map your IP address to a hostname that we'll use for a new website.
Add the following to ``/etc/hosts``, but replace my IP with yours and my
hostname with one of your own creation:

```
192.168.4.32 linuxsysadmins.com
192.168.4.32 websysadmins.com
```

This is one way to create a kind of intranet that uses actual names instead of
just IP addresses. Say that you have a home network and one of the computers on
your network is running a web server. If you assign a static IP to this
computer using the software on your home router, modify the ``/etc/hosts``
files on each of those three computers to point to that static IP via a domain
name, then you have basic DNS system for your intranet.

Now, let's restart Apache2 and see if we can visit our sites.

```
systemctl reload httpd.service
systemctl restart httpd.service
w3m http://linuxsysadmins.com
w3m http://websysadmins.com
```

Success!

If you change the ``/etc/hosts`` file on your **host** machine (i.e., your
laptop) per the instructions in the last lecture, then you should be able to
visit **http://linuxsysadmins.com** and **http://websysadmins.com** in your
browser. Here is a snippet of what my ``/etc/hosts`` file looks like on my
desktop machine (i.e., my **host** machine):

```
127.0.0.1	      localhost
127.0.1.1	      desktop
192.168.4.32    linuxsysadmins.com
192.168.4.32    websysadmins.com
```

## References

- [Name-based Virtual Host Support][name_vhost]
- [VirtualHost Examples][vhost_ex]
- [How to set up Apache Virtual Hosts on CentOS 7][vhost_apache2]

[name_vhost]:https://httpd.apache.org/docs/2.2/vhosts/name-based.html
[vhost_ex]:https://httpd.apache.org/docs/2.4/vhosts/examples.html
[vhost_apache2]:https://www.rosehosting.com/blog/apache-virtual-hosts-on-centos/
