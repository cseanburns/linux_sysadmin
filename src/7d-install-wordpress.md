# Install WordPress

By the end of this section, you will be able to:

1. Manually install and configure WordPress on your server, giving you complete control over your installation.
2. Set up a MySQL database for WordPress and link it through configuration files.
3. Understand the basics of WordPress file management, security configurations, and user setup for dynamic content management.

## Introduction

[WordPress][wpwiki] is a free and open source content management system (CMS).
Originally, its focus was on providing a platform for blogging,
but throughout its lifespan it has become a general purpose CMS that functions as a website builder.
Two sites exist to provide access to WordPress:
[WordPress.com][wpcom] and [Wordpress.org][wporg].
WordPress.com is a hosted service where WordPress handles everything, from updates to security.
Customers are mainly responsible for content and the appearance of their sites.
Various paid plans can extend the functionality offered to WordPress.com customers.

WordPress.org is maintained by the [WordPress Foundation][wpfoundation], which oversees its development and provides access to the WordPress software.
When we download the WordPress software, we download it from WordPress.org.
Unlike the hosted solution, WordPress.org is for users who want full control and responsibility over their website installation and maintenance.

WordPress is widely used software, and because of that, it's often the focus of attack.
Take a moment to read about the developer's efforts to protect WordPress: [Security][wpsecurity].
We will not need to update our WordPress installs during the course of this course, but you should be familiar with the update process
in case you decide to maintain your install or an install at a future date: [Updating WordPress][updatingwp].

Plugins are often used with WordPress sites to offer all sorts of additional capabilities.
Currently, there are over [60 thousand plugins][sixtyKplugins] available for WordPress, but some are of higher quality and utility than others.
In addition to the thousands of available plugins, there are over [10 thousand free themes][tenKthemes] for WordPress sites.
Plus, many businesses offer paid themes or can offer customized themes based on customer needs.
These themes can drastically alter the appearance and usability of a WordPress site.
I encourage you to explore plugins, develop, and add content to your WordPress sites, but the main goal
as a systems administrator is to set up the sites and not build out content.

## Installation

So far I have shown you how to install software using two methods:

- using the `apt` command
- downloading from GitHub

In this lesson, we are going to install WordPress by downloading the most recent version from WordPress.org and installing it manually.
The WordPress application is available via the `apt` command,
but the `apt` installation method often requires additional manual configuration that can be inconsistent or more difficult to troubleshoot
compared to the manual process we're using here.

We are going to *kind of* follow the documentation provided by WordPress.org.
You should read through the documentation **before** following my instructions, but then follow the process I outline here instead
because the documentation uses some different tools than we'll use.

Another reason we do this manually is because it builds on what we have learned when we created the `login.php` and `distros.php` pages.
That is, the two processes are similar.
In both cases, we create a specific database for our platform, we create a specific user for that database,
and we provide login credentials in a specific file.

First, read through **but do not follow the following instructions**:

[How to install WordPress][installWordPress]

## Customized Installation Process

After you have read through the WordPress.org documentation, follow the steps below to complete the manual install:

### Step 1: Requirements

All major software have dependencies, other software or code that it needs to run.
We used the `ldd` command to discover the dependencies of simple commands like `ls` when we created our `chroot` environments.
When we install software via `apt`, the `apt` program installs the needed dependencies for us.
Since our plan is to install WordPress outside of the `apt` ecosystem, we need to make sure that our systems
meet the requirements for our installation.
The [WordPress.org Requirements][wprequirements] page states that the WordPress installation requires
at least PHP version 7.4 or greater and MariaDB version 10.5 or greater.
We can check that our systems meet these requirements with the following commands:

```
php --version
mariadb --version
```

The output from `php --version` shows that our systems have PHP 8.1, which is greater than PHP 7.4.
The output from `mariadb --version` show that our systems have MariaDB 10.6.18, which is greater than MariaDB 10.5.
If your versions are below the required numbers, you will need to update PHP or MariaDB before proceeding.

Next, we need to add some additional PHP modules to our system to let WordPress operate at full functionality.
We can install these using the `apt` command:

```
sudo apt install php-curl php-xml php-imagick php-mbstring php-zip php-intl
```

Then restart Apache2 and MariaDB:

```
sudo systemctl restart apache2
sudo systemctl restart mariadb
```

### Step 2: Download and Extract

The next step is to download and extract the WordPress software, which is comes as a **zip** file.
Although we only download one file, when we extract it with the `zip` command, the extraction will result in a new directory
that contains multiple files and subdirectories.
The general instructions include:

1. Change to the `/var/www/html` directory.
2. Download the latest version of WordPress using the `wget` program.
3. Extract the package using the `unzip` program.
4. Delete the zip file to prevent clutter in the directory. You can wait to delete this file until you've successfully installed WordPress.

Specifically, this means we do the following on the command line:

```
cd /var/www/html
sudo wget https://wordpress.org/latest.zip
sudo apt install unzip
sudo unzip latest.zip
sudo rm latest.zip
```

Using the `sudo unzip latest.zip` command creates a directory called **wordpress**, as noted in the documentation.
If we leave that alone, then the full path of our installations will located at `/var/www/html/wordpress`.

### Step 3: Create the Database and a User

The WordPress documentation describes how to use [phpMyAdmin][phpmyadmin] to create the WordPress database and user.
`phpMyAdmin` is a graphical front end to the MySQL/MariaDB relational database that you would access through the browser.
However, we are going to create the WordPress database and a database user using the same process we used
to create a database and user for our `login.php` and `distros.php` pages.

The general instructions are:

1. Login as the root Linux user, and then
1. login as the MariaDB root user.

Specifically, we do the following on the command line:

```
sudo su
mariadb -u root
```

The `mariadb -u root` command puts us in the MariaDB command prompt.
The next general instructions are to:

1. Create a new user for the WordPress database
  1. Be sure to use a strong password.
1. Create a new database for WordPress
1. Grant all privileges to the new user for the new database
1. Examine the output
1. Exit the MariaDB prompt

Specifically, this means the following:

```
create user 'wordpress'@'localhost' identified by '[YOUR-PASSWORD-HERE]';
create database wordpress;
grant all privileges on wordpress.* to 'wordpress'@'localhost';
show databases;
\q
```

Then exit out of the Linux root account:

```
exit
```

By creating a dedicated database user for WordPress, we can limit access to only what's necessary for WordPress to function.
This improves security by reducing privileges for this account.

### Step 4: Set up wp-config.php

When we created the `login.php` file that contained the name of the database (e.g. linuxdb), the name of the database user (e.g., webapp),
and the user's password, we followed the same general process that WordPress follows.
Instead of `login.php`, WordPress uses a file called `wp-config.php`.
We have to edit that file.

Follow these general steps:

1. Change to the **wordpress** directory, if you haven't already.
1. Copy and rename the **wp-config-sample.php** file to **wp-config.php**.
1. Edit the file and add your WordPress database name, user name, and password in the fields for **DB_NAME**, **DB_USER**, and **DB_PASSWORD**.

This means that we specifically do the following:

```
cd /var/www/html/wordpress
sudo cp wp-config-sample.php wp-config.php
sudo nano wp-config.php
```

In `nano`, add your database name, user, and password in the appropriate fields, just like we did with our `login.php` file.
Double-check your entries in `wp-config.php`.
Incorrect details will prevent WordPress from connecting to the database and will result in errors during setup.

Additionally, we want to disable FTP uploads to the site.
To do that, navigate to the end of the `wp-config.php` file and add the following line:

```
define('FS_METHOD','direct');
```

Disabling FTP uploads with the above statement allows WordPress to directly write to your filesystem.
This makes it easier to manage themes and plugins without needing FTP credentials every time.

### Step 5: **Optional**

The WordPress files were installed at `/var/www/html/wordpress`.
This means that when our WordPress websites become public, they'll be available at the following URL:

```
http://[IP ADDRESS]/wordpress
```

If you want to have a different ending to your URL, then you want to rename your `wordpress` directory to something else.
The WordPress documentation uses **blog** as an example.
But it could be something different, as long as it contains no spaces or special characters.
Be sure to keep the directory name lowercase (no spaces and only alphanumeric characters).
For example, if I want to change mine to **blog**, then:

```
cd /var/www/html
sudo mv wordpress blog
```

### Step 6: Change File Ownership

WordPress will need to write to files in the base directory.
Assuming you are still in your base directory, whether that is `/var/www/html/wordpress`, `/var/www/html/blog`, or like, run the following command:

```
sudo chown -R www-data:www-data *
```

Changing the file ownership ensures that the web server (`www-data`) can read and write to files as needed.
Without this, WordPress might face permission errors during installation or when uploading files.

### Step 7: Run the Install Script

The next part of the process takes place in the browser.
The location (URL) that you visit in the browser depends on your specific IP address and the name of the directory in **/var/www/html** that
we extracted WordPress to or that you renamed if you followed **Step 5**.
Thus, if my IP address is 11.111.111.11 and I renamed by directory to **blog**, then I need to visit the following URL:

```
http://11.111.111.11/blog/wp-admin/install.php
```

**IF** I kept the directory named **wordpress**, then this is the URL that I use:

```
http://11.111.111.11/wordpress/wp-admin/install.php
```

### Finishing installation

From this point forward, the steps to complete the installation are exactly the steps you follow using WordPress's documentation.

Most importantly, you should see a **Welcome** screen where you enter your site's information.
The site **Username** and **Password** *should not* be the same as the username and password you used to create your WordPress database in MariaDB.
Rather, the username and password you enter here are for WordPress users; i.e., those who will add content and manage the website.
Make sure you save your password here!!

**Two things to note:**

We have not setup **email** on our servers.
It's quite complicated to setup an email server correctly and securely, but it wouldn't work well without having a domain name setup anyway.
So know that you probably should enter an email when setting up the user account, but it won't work.

Second, when visiting your site, your browser may throw an authenticaion error.
Ensure the URL starts with `http` and not `https` because some browsers try to force `https` connections.
We have not set up SSL certificates for secure connections, which would require a domain name and further configuration.
Note that `http` connections are less secure and
if you want to eventually set up a live site, you could acquire a domain name for your server and configure SSL using tools like
[Let's Encrypt][letsencrypt].

## Conclusion

Congrats on setting up your WordPress library site.
Feel free to take a moment to modify your site's design or to add content.

[installWordPress]:https://wordpress.org/documentation/article/how-to-install-wordpress/
[letsencrypt]:https://letsencrypt.org/
[phpmyadmin]: https://www.phpmyadmin.net/
[sixtyKplugins]:https://wordpress.org/plugins/
[tenKthemes]:https://wordpress.org/themes/
[updatingwp]:https://wordpress.org/documentation/article/updating-wordpress/
[wpcom]:https://wordpress.com
[wpfoundation]:https://wordpressfoundation.org/
[wporg]:https://wordpress.org
[wprequirements]:https://wordpress.org/about/requirements/
[wpsecurity]:https://wordpress.org/about/security/
[wpwiki]:https://en.wikipedia.org/wiki/WordPress

