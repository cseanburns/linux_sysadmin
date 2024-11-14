# Installing and Configuring PHP

By the end of this section, you will be able to:

1. Install and configure PHP to work with Apache2, which will enable dynamic content on your web server.
2. Provide an overview of how PHP interacts with a web server.
3. Modify Apache settings to serve PHP files as the default content.

## Getting Started

Client-side programming languages, like JavaScript, are handled by the browser.
Major browsers like Firefox, Chrome, Safari, Edge, etc. include [JavaScript engines][jsEngine] that use just-in-time compilers
to execute the JavaScript code (Mozilla has a [nice description][mozillaJS] of the process.)
From an end user's perspective, you basically install JavaScript when you install a web browser.

[PHP][php], on the other hand, is a server-side programming language.
This means it must be installed on the server in order to be used by the browser.
From a system administrator's perspective, this means that not only does PHP have be installed on a server,
but it must also be configured to work with the HTTP server, which in our case is Apache2.

The main use of PHP is to interact with databases, like MySQL, MariaDB, PostgreSQL, etc., in order to create dynamic page content.
This is our end goal.
To accomplish this, we have to:

1. Install PHP and relevant Apache2 modules
2. Configure PHP and relevant modules to work with Apache2
3. Configure PHP and relevant modules to work with MariaDB

## Install PHP 

PHP allows us to create dynamic content, which means we can customize what is displayed on a web page based on user inputs or data from a database.
As normal, we will use `apt install` to install PHP and relevant modules and then restart Apache2 using the `systemctl` command:

```
sudo apt install php libapache2-mod-php
sudo systemctl restart apache2
```

We can check its status and see if there are any errors:

```
systemctl status apache2
```

## Check Install

To check that it's been installed and that it's working with Apache2, we can create a small PHP file in our web document root.
To do that, we navigate to the `/var/www/html/` directory, and create a file called `info.php`.
The `info.php` file allows us to verify that PHP is correctly installed and configured with Apache2.
It displays detailed information about the PHP environment on the server.

```
cd /var/www/html/
sudo nano info.php
```

In that file, add the following text, then save and close the file:

```
<?php
phpinfo();
?>
```

Now visit that file using the external IP address for your server.
For example, in Firefox, Chrome, etc, go to (**be sure to replace the IP below with your IP address**):

```
http://55.333.55.333/info.php
```

You should see a page that provides system information about PHP, Apache2, and the server.
The top of the page should look like Figure 1 below:

<figure>
<img src="images/24-phpinstall.png"
alt="PHP install page"
title="PHP install page">
<figcaption>
Fig. 1. A screenshot of the title of the PHP install page.
</figcaption>
</figure>

## Basic Configurations

By default, Apache2 is set up to serve [`index.html` files first][modDirDocs], but since we are adding PHP to our setup,
we want Apache2 to prioritize PHP files to allow for dynamic content creation.

To prioritize PHP files, we need to edit the `dir.conf` file in the `/etc/apache2/mods-enabled/` directory.
In that file there is a line that starts with `DirectoryIndex`.
The first file in that line is `index.html`, and then there are a series of other files that Apache2 will look for in the order listed.
If any of those files exist in the document root, then Apache2 will serve those before proceeding to the next.
We simply want to put `index.php` first and let `index.html` be second on that line.

```
cd /etc/apache2/mods-enabled/
sudo nano dir.conf
```

And change the line to this:

```
DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm
```

Whenever we make a configuration change, we can use the ``apachectl`` command to check our configuration:

```
apachectl configtest
```

If we get an **Syntax Ok** message, you can reload the Apache2 configuration and restart the service:

```
sudo systemctl reload apache2
sudo systemctl restart apache2
```

If the configuration test does not return **Synax Ok**, check the error message for guidance, and
ensure all modifications to `dir.conf` were made correctly.

Now create a basic PHP page.
``cd`` back to the document root directory and use `nano` to create and open and `index.php` file:

```
cd /var/www/html/
sudo nano index.php
```

## Creating an index.php File

Let's now create an **index.php** page, and add some HTML and PHP to it.
The PHP can be a simple [browser detector][httpUserAgent].
This script will detect and display the browser information of whoever is visiting your site.
It uses the PHP global variable `$_SERVER['HTTP_USER_AGENT']` to print the user's browser type and version.

First, make sure you are in the `/var/www/html/` directory.
Use `sudo nano` to create and edit `index.php`.
Then add the following code:

```
<html>
<head>
<title>Browser Detector</title>
</head>
<body>
<p>You are using the following browser to view this site:</p>

<?php
echo $_SERVER['HTTP_USER_AGENT'] . "\n\n";

$browser = get_browser(null, true);
print_r($browser);
?>
</body>
</html>
```

Next, save the file and exit `nano`.
In your browser, visit your external IP address site:

```
http://55.333.55.333/
```

Although your `index.html` file still exists in your document root, Apache2 now returns the **index.php** file instead.
However, if for some reason the `index.php` was deleted, then Apache2 would revert to the `index.html` file
since that's listed next in the `dir.conf` `DirectoryIndex` line.

## Conclusion

In this section, we installed PHP and configured it work with Apache2.
We also created a simple PHP test page that reported our browser user agent information on our website.

In the next section, we'll learn how to complete the LAMP stack by adding the MariaDB relational database to our setup.
By adding a relational database, we will be able to pull data from the database and present it in the browser based on user actions.

[httpUserAgent]:https://stackoverflow.com/questions/8754080/how-to-get-exact-browser-name-and-version
[jsEngine]:https://en.wikipedia.org/wiki/JavaScript_engine
[modDirDocs]:https://httpd.apache.org/docs/current/mod/mod_dir.html
[mozillaJS]:https://blog.mozilla.org/javascript/
[php]:https://www.php.net/
