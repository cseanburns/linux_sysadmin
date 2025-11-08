# Installing the Apache Web Server

By the end of this section, you will be able to:

1. Install the Apache web server on an Ubuntu system and verify its status using basic commands.
2. Configure Apache to serve a basic web page, using both command line and graphical web browsers to view it.
3. Understand where Apache stores key configuration and content files, and modify the default document root to create your own custom web content.

## Getting Started

[Apache][apache] is an HTTP server, otherwise called web server software.
An HTTP server makes files on a computer available to others who are able to establish a connection to the computer and
view the files with a web browser.
Other HTTP server software exists and another major product is [nginx][nginx].

It's important to understand the basics of an HTTP server.
Please read Apache's [Getting Started][gettingStarted] page before proceeding, as it covers important aspects of HTTP servers.
Each of the main sections on that page describe the important elements that make up and serve a website, including:

- clients, servers, and URLs
- hostnames and DNS
- configuration files and directives
- web site content
- log files and troubleshooting

## Installation

Before we install Apache, we need to update our systems first.

```
sudo apt update
sudo apt -y upgrade
```

Once the machine is updated, we can install Apache2 using `apt`.
First we'll use `apt search` to identify the specific package name.
I already know that a lot of results will be returned, so let's **pipe** `|` the `apt search` command through `head` to look at the initial results:

```
sudo apt search apache2 | head
```

On Ubuntu, the Apache package is named `apache2`.
On other distributions, it may be named differently, such as `httpd` on Fedora.

```
apt show apache2
```

Once we've confirmed that `apache2` is the package that we want, we install it with the `apt install` command.

```
sudo apt install apache2
```

## Basic checks

Let's check if the server is up and running, configure some basic things, and then create a basic web site.
To start, we use `systemctl` to ensure `apache2` is enabled (starts automatically on reboot) and active (currently running):

```
systemctl status apache2
```

The output shows that `apache2` is enabled, which means that it will start running automatically if the computer gets rebooted, and
that it is currently running (active).

Since `apache2` is up and running, let's look at the default web page.
The **default web page** is the landing page of your server, and it is stored in the **document root**.
By default on Ubuntu, the path to the **document root** is located at `/var/www/html`, and
the default file being served is titled `index.html`.

There are two ways we can look at the default web page.
We can use a command line web browser or your regular graphical browser..
There are a number command line browsers available, such as `elinks`, `links2`, `lynx`, and `w3m`.

To check with `w3m`, we have to install it first:

```
sudo apt install w3m 
```

Once it's installed, we can visit our default site using the loopback IP address (aka, `localhost`).
From the command line on our server, we can run either of these two commands:

```
w3m 127.0.0.1
```

Or:

```
w3m localhost
```

We can also get the subnet/private IP address using the `ip a` command, and then use that with `w3m`.
For example, if `ip a` showed that my NIC has a private IP address of **10.0.1.1**, then I could use `w3m` with that IP address:

```
w3m 10.0.1.1
```

If the `apache2` installed and started correctly, then you should see the following text at the top of the screen:

```
Apache2 Ubuntu Default Page
It works!
```

To exit `w3m`, press **q** and then **y** to confirm exit.

To view the default web page using a regular web browser, like Firefox, Chrome, Safari, Edge, or etc., you need to get the server's public IP address.
To do that, log into the [Google Cloud Console][gcloudConsole].
In the left hand navigation panel, hover your cursor over the **Compute Engine** link, and then click on **VM instances**.
You should see your **External IP** address in the table on that page.
You can copy that external IP address or simply click on it to open it in a new browser tab.
Then you should see the graphical version of the **Apache2 Ubuntu Default Page**.

Please take a moment to read through the text on the default page.
It provides information about where Ubuntu stores configuration files and document roots, which is where website files go.

## Creating Your First Web Page

Now let's create our first web page.
The default page described above provides the location of the document root at `/var/www/html`.
When we navigate to that location, we'll see that there is an `index.html` file located in that directory.
This is the **Apache2 Ubuntu Default Page** that we described above.
Let's rename that **index.html** file, and create a new one:

```
cd /var/www/html/
sudo mv index.html index.html.original
sudo nano index.html
```

If you know HTML, then feel free to write some basic HTML code to get started.
Otherwise, you can re-type the content below in `nano`, and then save and exit out.

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

If you have our site open in your web browser, reload the page, and you should see the new text.

You can still view the original default page by specifying its name in the URL.
For example, if your **external IP address** is **55.222.55.222**, then you'd specify it like so:

```
http://55.222.55.222/index.html.original
```

## Conclusion

In this section, we learned about the Apache2 HTTP server.
We learned how to install it on Ubuntu, how to use systemd (`systemctl`) commands to check its default status,
how to create a basic web page in **/var/www/html**,
how to view that web page using the ``w3m`` command line browser and with our regular graphical browser.

In the next section, we will install PHP to enable dynamic content, which will make our websites more interactive.

[apache]:https://httpd.apache.org/
[gcloudConsole]:https://console.cloud.google.com/
[gettingStarted]:https://httpd.apache.org/docs/2.4/getting-started.html
[modUserDir]:https://httpd.apache.org/docs/2.4/mod/mod_userdir.html
[nginx]:https://nginx.org/en/
