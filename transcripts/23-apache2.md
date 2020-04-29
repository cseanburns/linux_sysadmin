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
