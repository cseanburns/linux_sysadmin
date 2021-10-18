# Installing and Setting PHP for Apache

PHP is a server-side programming language, which means that unlike client-side
programming languages, like JavaScript, PHP code must be installed on the
server and made to work with the Apache ``httpd`` server. In order for Apache
and PHP to work together, we will need to install some PHP software. We'll make
some modifications to Apache so that it defaults to PHP files rather than to
HTML files.

To get started, let's work with last week's HTTP machine that we used to set up
Apache and user directories ``userdir``. You can use that machine or you can
clone it to be sure that you have a good backup in case you need to start over.

Let's find the relevant packages to install. Again, make sure your system is up
to date first.

```
sudo su
dnf -y upgrade
dnf search php | less
dnf info php
... (not displaying output)
dnf info php-common
... (not displaying output)
dnf install php php-common
```

Since we are altering how the Apache ``httpd`` service functions, we will need
to restart the service. To check and restart services:

```
systemctl status httpd.service
systemctl restart httpd.service
systemctl status httpd.service
```

If all is well, our next task is to see if the Apache ``httpd`` service
recognizes PHP. We will proceed to the base HTTP directory, and use ``nano`` to
create and open a file called ``info.php``.

```
cd /var/www/html/
nano info.php
```

To make sure that the Apache web server can recognize that PHP is installed and
usable, we can add a little test code to the ``info.php`` file. The test code
will give us information about the version of PHP that we just installed:

```
<?php
phpinfo();
?>
```

Next, let's update file ownership for all files in this directory. They should
be owned be the Apache user:

```
ls -l
chown apache:apache *
ls -l
w3m http://localhost/info.php
```

By default, if both an **index.html** file and an **index.php** file exist in
the same directory, the Apache web server will display the **index.html** file
if a user visits the directory (e.g., ``http://example.com/`` or
``http://localhost/``). So we need to configure Apache to display *index.php*
files before displaying *index.html* files in case both files exist in the same
directory:

```
cd /etc/httpd/conf/
nano httpd.conf
```

Change this line:

```
DirectoryIndex index.html
```

To (that is, add **index.php** file to the line and make sure that it comes
before **index.html**:

```
DirectoryIndex index.php index.html
```

Since we have modified an Apache configuration file, we should check that we
haven't made a syntax mistake:

```
apachectl configtest
```

If we get an **Syntax Ok** message (you can ignore the FQDN error message), you
can tell Apache to reload its config files:

```
systemctl reload httpd.service
systemctl restart httpd.service
```

Now let's create a basic PHP page. Let's ``cd`` back to the base HTTP directory
and use ``nano`` to create and open and ``index.php`` file:

```
cd /var/www/html/
nano index.php
```

Let's add some HTML and PHP that will detect our browser to the **index.php**
([Source code link][get_browser_example]):

```
<p>You are using the following browser to view this site:</p>

<?php
echo $_SERVER['HTTP_USER_AGENT'] . "\n\n";

$browser = get_browser(null, true);
print_r($browser);
?>
```

Next, save and exit ``nano``, change ownership of the file to Apache, and view
with ``w3m``:

```
chown apache:apache index.php
w3m http://localhost/
```

Of course, since we set up our hostname last week, we can use our hostname in
our URL:

```
w3m http://seanburns/
```

**Your goal:**

- Create an **index.php** file in your **userdir**
- Add some PHP and submit screenshots, like last week, showing both the code
  and the output.

Get some sample PHP code from here: [https://www.w3schools.com/php/php_syntax.asp][php_syntax]

[get_browser_example]:https://stackoverflow.com/questions/8754080/how-to-get-exact-browser-name-and-version
[php_syntax]:https://www.w3schools.com/php/php_syntax.asp
