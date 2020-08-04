# Installing Apache2

Let's install our first web server. First, make sure your machine is up to date
before installing Apache2. In the following examples, I'm already logged in as
``root``.

## Update system first

```
$ sudo su
# dnf check-update
# dnf update
```

## Install ``httpd``

Now, that the machine is updated. Let's install Apache2. On distributions that
use a package management system, such as ``dnf`` on Fedora and ``apt`` on
Ubuntu, we can use those systems to install the relevant software. However,
different distributions use different names for the packages. Fedora refers to
the Apache2 software as ``httpd`` while Ubuntu refers to it as ``Apache2``.

Apache2 is not the only web server available. [nginx][3] is another popular web
server, and we might try it out before the semester ends. But before we install
Apache2, though, let's get some basic info on the package:

```
# dnf info httpd
```

Based on the output, and at the time of this writing, it looks like the
``httpd`` package refers to the Apache HTTP Server, version 2.4.41. I wanted to
highlight this because it's important to know what version of things are that
we're installing, for a couple of reasons at least. First, although Apache2 has
its own dependencies, other packages will also depend on it. For example, say
we wanted to install Drupal or WordPress, we would first have to install a web
server, like Apache2, and it might be the case that Drupal or WordPress require
a certain minimum version of Apache2. Second, package management systems are
generally conservative, some more or less so. The [current version of
Apache2][1] is 2.4.41. But it's not always likely that Fedora will use that or
some newer version until the next Fedora upgrade, for example, from Fedora 30
to Fedora 31. For now, however, this is fine, and we can proceed with the
install:

```
# dnf -y install httpd
```

## Basic checks

One of the things that makes Apache2, and some other web servers, so powerful
is the library of modules that extend Apache's functionality. We'll come back
to modules soon. For now, we're going to make sure the server is up and
running, configure some basic things, and then create a basic web site.

To start, let's make sure that Apache2 is *enabled* and *running* (note that I
truncate some output below using ``...``:

```
# systemctl list-unit-files httpd.service
UNIT FILE       STATE
httpd.service   disabled

1 unit files listed.
# systemctl enable httpd.service
# systemctl list-unit-files httpd.service
UNIT FILE       STATE
httpd.service   enabled

1 unit files listed.
# systemctl status httpd.service
...
Active: inactive (dead)
...
# systemctl start httpd.service
# systemctl status httpd.service
...
Active: active (running)
...
```

## Creating a web page

Now that we have it up and running, let's look at the default web page:

```
# w3m http://127.0.0.1
```

The ``w3m`` text-mode browser shows the **Fedora Test Page**. That's a sign
that the default install was successful. Let's now create our first web page.
To do so, we need to know what directory that Apache2 is using to serve
websites. If we read through that **Fedora Test Page** document, it'll tell us
that the default directory is ``/var/www/html/``. Let's go there and create
a webpage with our text editor of choice:

```
# cd /var/www/html/
# nano index.html
```

Then write something like this. Of course, modify the content to suit your own
interests:

```
<html>
<head>
<title>My first web page using Apache2</title>
</head>
<body>

<h1>Welcome</h1>

<p>Welcome to my web site. This is the first web page I have ever created using
Apache2 and Fedora Linux. If you have any questiosn, please email me at <a
href="mailto:sean.burns@uky.edu">sean.burns@uky.edu</a>.</p>

<p>Thanks!<br/>
Dr. Burns</p>

</body>
</html>
```

After you're done, save and close the document. Let's visit our website again
with ``w3m`` to see if it works:

```
# w3m http://127.0.0.1
```

Note that the default HTML file that Apache2 looks for is the ``index.html``
file.

## Changing the ``hostname``

The ``hostname`` of a system is the label it uses to identify itself to others
(humans) on the network. If the hostname is on the web, it may also be referred
to as a domain name or may be part of the fully qualified domain name, which we
studied during the DNS and networking weeks. For example, on **SISED**, the
hostname is ``sised`` and **SISED**'s fully qualified domain name, when part of
the Internet, is **sised.is.uky.edu**.

We're going to check and set the system ``hostname`` on our Fedora (virtual)
machines using the ``hostname`` command:

Check the default hostname:

```
# hostname
localhost.localdomain
```

To change the default hostname from **localhost**, we'll edit a specific file
and then use the ``hostname`` command to update the system's hostname per the
file. I'll comment out the first line by putting a pound sign at the beginning
and then add an additional line with the name of my new hostname: **csbhome**.
You can name your hostname whatever you want, but be sure it's a single word
with no punctuation.

```
# nano /etc/hostname
csbhome
```

To update the system, exit out of ``nano`` and run the ``hostname`` command
with the ``-F`` option:

```
sudo hostname -F /etc/hostname
hostname # check
```

## Tasks

After you've completed the above steps, do the following:

1. On your virtual machine, open ``/etc/hosts`` and map a hostname of your
   choice the IP address for your main network device, not the ``lo`` device.
   (What command do you need to issue to locate that IP address?) 
2. On your host machine, find your OS's version of ``/etc/hosts``. For example,
   it seems Windows users can follow these instructions:
   [https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992][4].
   macOS users can follow these instructions also have an ``/etc/hosts``.
3. For experimental purposes, change the default port number from 80 to 8080.
   (You'll need to locate the right config file to do this. Hint: it's located
   somewhere under ``/etc/httpd/``.)
4. Restart httpd.service and connect to your website with the new port number.
5. After you've tested it, change the default port back to 80.

[1]:https://httpd.apache.org/
[2]:https://www.amazon.com/Linux-Administration-Beginners-Guide-Seventh/dp/0071845364
[3]:https://nginx.org/en/
[4]:https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992
# Apache2 User Directories

## Reset httpd.service to port 80

If you have not reverted to port 80, it's time to change the listening port to
80 from 8080 (per the first instructions on Apache2). Change it back to port 80
by editing ``/etc/httpd/conf/httpd.conf``. (Be sure to login as root or use the
``sudo`` command, as appropriate.)

```bash
# cd /etc/httpd/conf/
# nano httpd.conf
```

After changing the configuration file, close ``nano`` (or whatever text editor
you're using) and then restart ``httpd.service`` and see if it's successfully
running on port 80.

```bash
# systemctl restart httpd.service
# systemctl status httpd.service
# w3m http://127.0.0.1/
```

## Enable userdir (``$HOME/public_html`` sites)

Edit the ``userdir.conf`` file.

```bash
# cd /etc/httpd/conf.d/
# nano userdir.conf
```

Make the following changes:

- ``UserDir disabled`` to ``UserDir enabled``
- Uncomment line ``UserDir public_html``

After saving and exiting, restart ``httpd.service``:

```bash
# systemctl restart httpd.service
```

## Tasks

1. Exit out of root account
2. Go to your regular user's home directory
3. Make a directory titled ``public_html``
4. Change home directory permissions to 711
5. Change ``public_html`` directory permissions to 755

## SELinux

Now, because of SELinux, we need to set some SELinux switches. Using ``sudo``
or logging in as ``root``:

```bash
# setsebool -P httpd_enable_homedirs true
# chcon -R -t httpd_sys_content_t /home/sean/public_html
```

In the last line above, replace ``/home/sean/public_html`` with the correct
path for your regular user (i.e., you're not *sean*). Exit out of root if you
need to.

## Test

Now test to see if your ``public_html`` site is operational by simply visiting
the site. For me, I use the following command:

```bash
$ cd ~/public_html/
$ echo "<p>Hello world</p>" >> index.html
$ w3m http://127.0.0.1/~sean
```
# OpenSSL for HTTPS

Let's create and install a self-signing certificate for SSL connections.

Here we follow the instructions per the [Fedora documentation][1] and we're
using the **mod ssl** method.

Let's create a certificate for our site.

Instructions: [https://fedoraproject.org/wiki/Https#openssl][2]


```
sudo openssl genrsa -out csbhome.key 2048
sudo openssl req -new -key csbhome.key -out csbhome.csr -sha512
sudo openssl x509 -req -days 365 -in csbhome.csr -signkey csbhome.key -out csbhome.crt -sha512
sudo cp csbhome.crt /etc/pki/tls/certs/
sudo cp csbhome.key /etc/pki/tls/private/
sudo cp csbhome.csr /etc/pki/tls/private/
sudo restorecon -RvF /etc/pki
chown root:root /etc/pki/tls/private/csbhome.csr
chown root:root /etc/pki/tls/private/csbhome.key
chown root:root /etc/pki/tls/certs/csbhome.crt
chmod 0600 /etc/pki/tls/private/csbhome.csr
chmod 0600 /etc/pki/tls/private/csbhome.key
chmod 0600 /etc/pki/tls/certs/csbhome.crt
```

Now let's set up Apache for SSL. Use the instructions [above][1] to guide your
edits of this file.

```
cd /etc/httpd/conf.d/
nano ssl.conf
```

Then restart Apache2:

```
sudo systemctl restart apache2
```

[1]:https://docs.fedoraproject.org/en-US/quick-docs/getting-started-with-apache-http-server/#mod-ssl-configuration
[2]:https://fedoraproject.org/wiki/Https#openssl

# Installing PHP

First, let's find the relevant packages to install (again, make sure your
system is up to date first).

```bash
# dnf search php | less
# dnf info php
...
# dnf info php-common
...
# dnf install php php-common
```

Restart services:

```bash
# systemctl restart httpd.service
# cd /var/www/html/linuxsysadmins.com/
# nano info.php
<?php
phpinfo();
?>
# chown apache:apache info.php
# w3m http://linuxsysadmins.com/info.php
```

Configure Apache2 to look for *index.php* files before *index.html* files:

```bash
# cd /etc/httpd/conf.d/
# vi linuxsysadmins.conf
```

Change this line:

```
DirectoryIndex index.html index.php
```

To:

```
DirectoryIndex index.php index.html
```

Restart Apache2:

```
# httpd -t
# systemctl restart httpd.service
```

Create a basic PHP page:

```
# cd /var/www/html/linuxsysadmins.com
# nano index.php
```

ADD some PHP. Try: [https://www.w3schools.com/php/php_syntax.asp][1]

Save and exit nano. And then visit your site:

```
# w3m http://linuxsysadmins.com
```

By changing the default order in the *linuxsysadmins.conf* file, we do not have
to specify that we are trying to visit *http://linuxsysadmins.com/index.php*. 

[1]:https://www.w3schools.com/php/php_syntax.asp

# Apache2 VirtualHosts

## Update OS

First, just in case you haven't recently, let's update our OS:

```bash
# dfn check-update
# dnf update
```

## Create new configurations

We have two choices about which files we will edit to include our virtual
hosts. We can edit:

- ``/etc/httpd/conf/httpd.conf``

And add the virtual host info there; or, the above file includes a line (the
``IncludeOptional conf.d/*.conf`` line) that allows us to create additional
configuration files for Apache2 in the ``/etc/conf.d/`` directory. Per that
above line, the files need to end with ``.conf``. Let's do the latter. We'll
name the files after our pretend domain names. I'll create a domain called
linuxsysadmins and another one called websysadmins:

```
# cd /etc/httpd/conf.d/
# touch linuxsysadmins.conf
```

Then we'll add the following info to each file, making sure to make changes
according to the specifics:

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

Then, copy the above file to create our second virtual host:

```
# cp linuxsysadmins.conf websysadmins.conf
```

And edit ``websysadmins.conf`` accordingly.

When you're done, exit out of ``nano`` and check your configuration syntax with
the following command:

```
# httpd -t
```

You should get an error stating that the sites don't exist at the
*DocumentRoot*, but we'll fix that in a second. For now, you want to get a
``Syntax OK`` message.

## Creating the sites

Now, the above two files tell Apache2 to look for the respective websites in
``/var/www/html/your_domain``. We need to create those locations. I'll do that
now for my two domains:

```
# cd /var/www/html/
# mkdir linuxsysadmins websysadmins
```

Now let's create some basic web pages in each domain directory:

```
# cd linuxsysadmins.com
# echo "<h1>Linux Sys Admins</h1>" >> index.html
# cd ../websysadmins.com
# echo "<h1>Web Sys Admins</h1>" >> index.html
```

And now we have to make sure that the user ``apache`` owns those two
directories and all future files in them. We use the user ``apache`` because
the main Apache2 configuration file (``/etc/httpd/conf/httpd.conf``) has two
directives that state that the names of the User/Group should be ``apache``:

```
# cd .. # to return to the parent directory
# chown -R apache:apache linuxsysadmins.com
# chown -R apache:apache websysadmins.com
```

You can run ``ls -l`` on those directories and files to confirm that the
``apache`` owner owns them. You can also run ``httpd -t`` again to confirm that
all the syntax is good.

## Editing the ``/etc/hosts`` file

Now, depending on the domain names you chose, they could already exist and have
real DNS records that point to other IP addresses. Therefore, we need to edit
the ``/etc/hosts`` file and let our system know that each of those domain names
point to localhost. For me, I'll add the following lines:

```
# nano /etc/hosts
127.0.0.1   linuxsysadmins.com
127.0.0.1   websysadmins.com
```

Now, let's restart Apache2 and see if we can visit our sites.

```
# systemctl restart httpd.service
# w3m http://linuxsysadmins.com  ## Comment: then quit
# w3m http://websysadmins.com
```

Success!

If you change the ``/etc/hosts`` file on your **host** machine (i.e., your
laptop) per the instructions in the last lecture, then you should be able to
visit **http://linuxsysadmins.com** and **http://websysadmins.com** in your
browser. Here is a snippet of what my ``/etc/hosts`` file looks like on my
desktop machine (i.e., my **host** machine):

```
127.0.0.1	      localhost
127.0.1.1	      sean-ncc1701e
10.163.34.118   mywebsite
10.163.34.118   linuxsysadmins.com
10.163.34.118   websysadmins.com
```

## References

- [Name-based Virtual Host Support][1]
- [VirtualHost Examples][3]
- [How to set up Apache Virtual Hosts on CentOS 7][2]

[1]:https://httpd.apache.org/docs/2.2/vhosts/name-based.html
[2]:https://www.rosehosting.com/blog/apache-virtual-hosts-on-centos/
[3]:https://httpd.apache.org/docs/2.4/vhosts/examples.html


