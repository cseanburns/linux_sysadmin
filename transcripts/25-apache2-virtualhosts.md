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
