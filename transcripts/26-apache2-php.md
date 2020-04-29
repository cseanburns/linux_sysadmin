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
