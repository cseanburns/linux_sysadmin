## Installing Apache2

Let's install our first web server.

First, switch to Bridged mode in VirtualBox network settings and refresh
MAC address in VirtualBox.

### Update system first

Make sure your machine is up to date before installing Apache2.

Login as root, or switch to the ``root`` user, and update the machine:

```
sudo su
dnf update
```

### Install ``httpd``

Now, that the machine is updated, install Apache2. On distributions that
use a package management system, such as ``dnf`` on Fedora and ``apt``
on Ubuntu, we can use those systems to install the relevant software
and dependencies. However, different distributions use different names
for the packages. Fedora refers to the Apache2 package as ``httpd``
while Ubuntu refers to it as ``Apache2``. We can use ``dnf`` to search
for the appropriate package name:

```
dnf search apache | grep "httpd"
```

Apache2 is not the only web server available. [nginx][nginx] is another
popular web server, and you should explore or learn about other options
on your own.  For now, let's get some basic info on the ``httpd`` package:

```
dnf info httpd
```

Based on the output, and at the time of this writing, it looks like the
``httpd`` package refers to the Apache HTTP Server, version 2.4.51. I
want to highlight this because it's important to know what version of
things are that we're installing, for a couple of reasons at least:

1. First, although Apache2 has its own dependencies, other packages
will also depend on it. For example, say we wanted to install Drupal or
WordPress, we would first have to install a web server, like Apache2,
and it might be the case that Drupal or WordPress require a certain
minimum version of Apache2.

2. Second, some Linux operating systems focus on stability and thus do
not update to the most recent version of a package instead opting for
the most stable version of the software. The [latest stable release of
Apache2][apache2] is 2.4.51. But it's not always likely that Fedora or
some other distribution will use that or some newer version until the
next distribution upgrade, for example, from Fedora 33 to Fedora 34.
For now, this is fine, and we can proceed with the install:

```
dnf -y install httpd
```

### Basic checks

One of the things that makes Apache2, and some other web servers, powerful
is the library of modules that extend Apache's functionality. We'll come
back to modules soon. For now, we're going to make sure the server is
up and running, configure some basic things, and then create a basic
web site.

To start, let's get some info about Apache2 and make sure it is *enabled*
and *running*:

```
systemctl list-unit-files httpd.service
systemctl enable httpd.service
systemctl list-unit-files httpd.service
systemctl status httpd.service
systemctl start httpd.service
systemctl status httpd.service
```

### Creating a web page

Now that we have it up and running, let's look at the default web
page. We can use our loopback IP address (aka, *localhost*) and the
``w3m`` text web browser to view the default page:

```
dnf install -y w3m
w3m http://127.0.0.1
w3m http://localhost/
```

The ``w3m`` text-mode browser shows the **Fedora Test Page**. That's
a sign that the default install was successful.

Let's now create our first web page.  To do so, we need to know what
directory that ``httpd`` is using to serve websites. This directory is
called the **DocumentRoot** directory. If we read through that **Fedora
Test Page** document, it'll tell us that the default directory is
``/var/www/html/``. Let's go there and create a webpage with our text
editor of choice:

```
cd /var/www/html/
nano index.html
```

Create a simple HTML page, something like this. Of course, modify the
content to suit your own interests:

```
<html>
<head>
<title>My first web page using Apache2</title>
</head>
<body>

<h1>Welcome</h1>

<p>Welcome to my web site. I have ever created using Apache2 and Fedora
Linux.</p>

<p>Thanks!<br/>
Dr. Burns</p>

</body>
</html>
```

After you're done, save and close the document. Let's visit our website
again with ``w3m`` to see if it works:

```
w3m http://127.0.0.1
```

Let's open the firewall so that outside systems can access this page:

```
firewall-cmd --list-all
firewall-cmd --get-active-zones
firewall-cmd --zone=FedoraServer --add-service=http
firewall-cmd --zone=FedoraServer --add-service=https
firewall-cmd --runtime-to-permanent
```

### Changing the ``hostname``

The ``hostname`` of a system is the label it uses to identify itself
to others (humans) on a (sub)network. If the hostname is on the web (or
the internet), it may also be part of its of the fully qualified domain
name (FQDN), which we studied during the DNS and networking weeks. For
example, on a server identified as **enterprise.example.net**, then
**enterprise**, is the hostname, **example.net** is the domain name,
and **enterprise.example.net** is the fully qualified domain name. If
two computers are on the same subnet, then they can be reachable via
the hostname only, but the domain name is part of the DNS system and is
required for two computers on the broader internet to reach each other.

We're going to check and set the system ``hostname`` on our Fedora
(virtual) machines using the ``hostname`` and ``hostnamectl`` commands:

Check the default hostname:

```
# hostname
localhost.localdomain
```

To change the default hostname from **localhost**, we'll edit a specific
file and then use the ``hostnamectl`` command to update the system's
hostname per the file. I'll comment out the first line by putting a pound
sign at the beginning and then add an additional line with the name of
my new hostname: **enterprise**.  You can name your hostname whatever
you want, but be sure it's a single word with no punctuation.

```
hostnamectl set-hostname enterprise
hostname
cat /etc/hostname
```

We can access our site by hostname rather than by IP:

```
w3m http://enterprise
```

#### Optional

After you've completed the above steps, do the following:

1. On your host machine, find your OS's version of ``/etc/hosts``. 
    - Windows instructions: [https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992][windowshosts].
    - macOS users can edit their ``/etc/hosts`` file.
1. Map your guest IP address (your Fedora IP) to your new hostname:

    ```
    192.168.4.31 enterprise
    ```

Then, in your Firefox, Chrome, or whatever browser, visit your new
website and replace **enterprise** with the hostname that you chose for
your guest OS:

```
http://enterprise
```

### Apache2 User Directories

We can enable Apache2 so that users on our systems can run websites from
their home directories; that is, sites located at:

- ``$HOME/public_html``

#### Enable userdir

Edit the ``userdir.conf`` file.

```
cd /etc/httpd/conf.d/
nano userdir.conf
```

Make the following changes:

- ``UserDir disabled`` to ``UserDir enabled``
- Uncomment line ``UserDir public_html``

After saving and exiting, restart ``httpd.service``:

```
systemctl restart httpd.service
```

#### Tasks

1. Exit out of root account
1. Go to your regular user's home directory
1. Make a directory titled ``public_html`` if it doesn't already exist
1. Set ``public_html`` directory permissions to 755:
    - ``chmod 755 public_html``
1. Change the user's directory permissions to 701:
    - ``chmod 701 /home/your_user``

**SELinux** needs to be configured to allow web access to our home
directories. Specifically, we need to set some SELinux switches. Using
``sudo`` or logging in as ``root``. Make sure you replace **sean**
with your username:

```
setsebool -P httpd_enable_homedirs true
chcon -R -t httpd_sys_content_t /home/sean/public_html
```

Exit out of root if you need to.

#### Test

Now test to see if your ``public_html`` site is operational by simply
visiting the site. For me, I use the following command:

```
cd ~/public_html/
echo "<p>Hello world</p>" >> index.html
w3m http://127.0.0.1/~sean
```

[nginx]:https://nginx.org/en/
[apache2]:https://httpd.apache.org/
[windowshosts]:https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992

