# Installing the Apache Web Server

## Introduction

[Apache][apache] is an HTTP server,
otherwise called web server software.
Other HTTP server software exists.
Another big one is [nginx][nginx].
An HTTP server essentially makes files on a computer available
to others who are able to establish a
connection to the computer and view the files
with a web browser.

It's important to understand the basics of an HTTP server, and
therefore I ask you to read Apache's
[Getting Started][gettingStarted] page before
proceeding with the rest of this section.
Each of the main sections on that page describe
the important elements that make up and serve a website,
including

- clients, servers, and URLs
- hostnames and DNS
- configuration files and directives
- web site content
- log files and troubleshooting


## Installation

Before we install Apache,
we need to update our systems first.


```
sudo apt update
sudo apt -y upgrade
```

Once the machine is updated,
we can install Apache2 using ``apt``.
First we'll use ``apt search`` to identify
the specific package name.
I already know that a lot of results
will be returned,
so let's **pipe** the ``apt search`` command
through ``head`` to look at the initial results:

```
sudo apt search apache2 | head
```

The package that we're interested in
happens to be named **apache2** on Ubuntu.
This is not a given.
On other distributions,
like Fedora,
the Apache package is called **httpd**.
To learn more about the **apache2** package,
let's examine it with the ``apt show`` command:

```
apt show apache2
```

Once we've confirmed that **apache2** is the package
that we want,
we install it with the ``apt install`` command.
Press **Y** to agree to continue after running
the command below:

```
sudo apt install apache2
```

## Basic checks

One of the things that makes Apache2, and
some other web servers,
powerful is the library of modules that
extend Apache's functionality.
We'll come back to modules soon.
For now,
we're going to make sure the server is up and running,
configure some basic things, and
then create a basic web site.

To start,
let's use ``systemctl`` to acquire some info about **apache2** and
make sure it is *enabled* and *running*:

```
systemctl list-unit-files apache2.service
systemctl status apache2
```

The output shows that **apache2** is enabled,
which means that it will start running automatically
if the computer gets rebooted.

The output of the second command also shows
that **apache2** is enabled and
that it is also active (running).

## Creating a web page

Since **apache2** is up and running,
let's look at the default web page.

There are two ways we can look at the default web page.
We can use a command line web browser.
There are a number available, but
I like ``w3m``.

We can also use our regular web browsers and view
the site by entering the IP address of the server
in our browser URL bar.

To check with ``w3m``,
we have to install it first:

```
sudo apt install w3m
```

Once it's installed,
we can visit our default site using the loopback IP address
(aka, *localhost*).
From the command line on our server,
we can run either of these two commands:

```
w3m 127.0.0.1
w3m localhost
```

We can also get the subnet/private IP address
using the ``ip a`` command, and
then use that with ``w3m``.
For example, if ``ip a`` showed that my NIC
has an IP address of **10.0.1.1**, then
I could use ``w3m`` with that IP address:

```
w3m 10.0.1.1
```

If the **apache2** installed and started correctly,
then you should see the following text at the top
of the screen:

**Apache2 Ubuntu Default Page**  
**It works!**

To exit ``w3m``,
press **q** and then **y** to confirm exit.

To view the default web page using
a regular web browser,
like Firefox, Chrome, Safari, Edge, or etc.,
you need to get our server's public IP address.
To do that,
log into the
[Google Cloud Console][gcloudConsole],
in the left hand navigation panel,
hover your cursor over the **Compute Engine** link, and
then click on **VM instances**.
You should see your **External IP** address
in the table on that page.
You can copy that external IP address or
simply click on it to open it in a new browser tab.
Then you should see the graphical version of the
**Apache2 Ubuntu Default Page**.

Please take a moment to read through
the text on the default page.
It provides important information about
where Ubuntu stores configuration files and
what those files do, and
document roots,
which is where website files go.

## Create a Web Page

Let's create our first web page.
The default page described above provides
the location of the document root at
**/var/www/html**.
When we navigate to that location,
we'll see that there is already an **index.html**
file located in that directory.
This is the **Apache2 Ubuntu Default Page**
that we described above.
Let's rename that **index.html** file,
and create a new one:

```
cd /var/www/html/
sudo mv index.html index.html.original
sudo nano index.html
```

If you know HTML, then
feel free to write some basic HTML code to get started.
Otherwise, you can re-type the content below
in ``nano``, and
then save and exit out.

```
<html>
<head>
<title>My first web page using Apache2</title>
</head>
<body>

<h1>Welcome</h1>

<p>Welcome to my web site. I created this site using the Apache2 HTTP server.</p>

</body>
</html>
```

If you have our site open in your web browser,
reload the page, and you should see
the new text.

You can still view the original default page by
specifying its name in the URL.
For example, if your **external IP address** is
**55.222.55.222**, then you'd specify it like so:

```
http://55.222.55.222/index.html.original
```

## Conclusion

In this section,
we learned about the Apache2 HTTP server.
We learned how to install it on Ubuntu,
how to use systemd (``systemctl``) commands
to check its default status,
how to create a basic web page in **/var/www/html**,
how to view that web page using the ``w3m``
command line browser and with our regular graphical browser.

In the next section,
we will learn how to make our sites applications
by installing PHP and enabling the relevant PHP modules.

[nginx]:https://nginx.org/en/
[apache]:https://httpd.apache.org/
[gettingStarted]:https://httpd.apache.org/docs/2.4/getting-started.html
[gcloudConsole]:https://console.cloud.google.com/
[modUserDir]:https://httpd.apache.org/docs/2.4/mod/mod_userdir.html

<!--
## User Directories

You may have visited sites in the past
that have a tilde in the URL and look like this:

```
http://example.com/~user/
```

These are called user directories, and
the provide additional path to the **document root**
that's located in users' home directories
in a directory called **public_html**.
This is the default document root for user directories,
but the default can be changed to different locations.
Please read the documentation on what's called the
[Apache Module mod_userdir][modUserDir] before proceeding.

By default, users with accounts on the server
need to have a **public_html** directory
in their home directories, and
Apache2 needs to be configured
to serve sites from those directories.
For example, for the user **linus**,
they should have the following file path available:

```
/home/linus/public_html/
```

### Enable mod_userdir

The configuration file for **mod_userdir** is
located in **/etc/apache2/mods-available/**
and is named **userdir.conf**.
Files in this directory are modules that
are available to Apache2 but that are not
enabled (i.e., they're turned off) by default.
We can view that the **userdir.conf** file
with the ``less`` command:

```
less /etc/apache2/mods-available/userdir.conf
```

The default configuration does not need to be modified.
Therefore, all we need to do is enable this module.
To do that, we use the ``a2enmod`` Apache2 command
(see ``man a2enmod`` for details.)

```
sudo a2enmod userdir
```

After enabling,
we need to reload the HTTP service, and
we can also check its status:

```
sudo systemctl restart apache2
systemctl status apache2
```

### Create a User Directory Website

Let's say I am logged in as the user **linus** on the system and
will use that to test if the user directory is working.
First, let's go home.
For me, as the user **linus**,
that would **/home/linus/**, and
I just have to type in the ``cd`` command and press Enter:

```
cd
```

Now I need to create a **public_html** directory
in my home directory
(**make sure you're in your home directory!**), and
change into that directory:

```
mkdir public_html
cd public_html
```

By default, Apache2 looks for a file
named **index.html** in the document root.
I'll create that and add some basic HTML to it:

```
nano index.html
```

And in that file:

```
<html>
<head>
<title>My home site</title>
</head>
<body>

<p>This is my home site.</p>

</body>
</html>
```

Now simply add **/~linus/** to your external IP
address in your browser's URL bar.
Like so
(of course, replace the external IP address with
your external IP address and the username with
the username that you're using):

```
http://55.222.55.222/~linus/
```

Note that this process is pretty easy but
that it will be different on other distributions.
For example, the **Fedora** distribution has different
**Apache2** defaults.
Also, on some distributions,
we might need to change the directory permissions
before this will work.
By default, Ubuntu sets directory permissions to
on our home directories to:

```
drwxr-xr-x
```

That means that any user can view the contents
of our home directories.
And Ubuntu sets directories created with ``mkdir``
in the home directory with these permissions by default:

```
drwxrwxr-x
```

These default settings make those directories
world readable, but
other distributions do not default to those permissions.
If the last ``r-x`` was set to ``---``, then
we would need to use the ``chmod`` command
to make these directories executable and readable
before files in our **public_html** directory
could be accessed in a browser.

-->



