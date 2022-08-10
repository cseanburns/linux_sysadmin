# Installing and Configuring MariaDB

work in progress...

## Install and Set Up MySQL

This week we'll learn how to install, setup, secure, and configure
the MySQL relational database so that it works with the Apache2 web
server. First, a point on terms. This week we will be working as

- the Linux **root** user and as
- the MySQL **root** user.

These are two different users and accounts. To revisit, in Linux,
there is the **root** user, which has a home directory at **/root**,
and there is also the **root** directory at **/**.

In MySQL and other relational database software, there is also a **root**
user and this user is not the same as the Linux **root** user. It's
important to keep these concepts separate in our heads, and for most
of this transcript, I will refer to the MySQL root user or to the Linux
root user when I'm referring to either one.

First, let's install MySQL Community Server, and then log into the MySQL
shell under the **MySQL root** account.

```
sudo su
dnf upgrade
dnf search mysql server
dnf info community-mysql-server
dnf info community-mysql-server
dnf install community-mysql-server
systemctl list-unit-files mysqld.service
systemctl status mysqld.service
systemctl start mysqld.service
systemctl enable mysqld.service
systemctl status mysqld.service
systemctl list-unit-files mysqld.service
mysql -u root
```

After we have logged in, we need to create a secure password for the
**MySQL root** account. Again, do not confuse the **Linux root** with
the **MySQL root** account. That is, these are two different accounts:
*Linux root* and *MySQL root*. Once we have created the password, we
will exit MySQL.

In MySQL, we will create the following root password: "aNewPassword4!"
(withouth the quotes), and then log out. In a production environment,
I would not use a basic password like this, but for our purposes, we
can keep things simple.

```
mysql> alter user 'root'@'localhost' identified by 'aNewPassword4!';
mysql> \q
```

## Secure MySQL Server

Now we use a MySQL program called ``mysql_secure_installation`` to help
secure the MySQL installation. From the Bash shell and while logged in
as **Linux root**, run the following command, and respond to the command
line prompts as follows:

```
mysql_secure_installation
Enter password for user root: aNewPassword4!
Validate Password: Y
Password Strength: 0
Change the password for root: N
Remove anonymous users: y
Disallow root login remotely: y
Remove test database: y
Reload privilege tables now: y
```

## Create and Set Up a Regular User Account

Now, log back into the MySQL shell as the **MySQL root** user. Here the
command is a bit different from the first one that we used to login to
MySQL because we now have to enter our password:

```
mysql -u root -p
```

In MySQL, we need to create and set up a new account that is not **root**
and therefore does not have **root** privileges:

```
mysql> create user 'sean'@'localhost' identified by 'an0ldP4ssPhrase!';
```

## Create a Practice Database

Now let's create a linux-topic database for user 'sean'. This user will
be granted all privileges on this database, including all its tables.
Other than granting all privileges, we could only grant specific
privileges, including: CREATE, DROP, DELETE, INSERT, SELECT, UPDATE, and
GRANT OPTION. Such privileges may be called operations or functions. They
allow MySQL users to use and modify the database:

Don't use this exact command, but the syntax of the ``grant`` command
below is this:

```
grant PRIVILEGE_OPTION on DATABASE.TABLE to 'USER'@'LOCALHOST';
```

In practice, we do this:

```
mysql> create database linuxdb;
mysql> grant all privileges on linuxdb.* to 'sean'@'localhost';
mysql> show databases;
mysql> \q
```

### Logging in as Regular User and Creating Tables

Now, we can start doing MySQL work. We've created a new MySQL user named
**sean** and a new database for **sean** that is called **linuxdb**. Let's
logout out of the **Linux root** account and re-login under our regular
Linux account, for me that's **sean**, and create tables and data for
our database:

```
$ mysql -u sean -p
mysql> show databases;
mysql> use linuxdb;
mysql> create table distributions
    -> (
    -> id int unsigned not null auto_increment,
    -> name varchar(150) not null,
    -> developer varchar(150) not null,
    -> founded date not null,
    -> primary key (id)
    -> );
Query OK, 0 rows affected (0.07 sec)

mysql> show tables;
mysql> describe distributions;
```

Congratulations! Now create some records for that table.

### Adding records into the table

We'll use the INSERT command to add records:

```
mysql> insert into distributions (name, developer, founded) values
    -> ('Debian', 'The Debian Project', '1993-09-15'),
    -> ('Ubuntu', 'Canonical Ltd.', '2004-10-20'),
    -> ('Fedora', 'Fedora Project', '2003-11-06');
Query OK, 3 rows affected (0.06 sec)
Records: 3  Duplicates: 0  Warnings: 0
mysql> select * from distributions;
```

Success! Now let's test our table. We will complete the following tasks
to refresh our MySQL knowledge:

- retrieve some records or parts of records, 
- delete a record,
- alter the table structure so that it will hold more data, and
- add a record:

```
mysql> select name from distributions;
mysql> select founded from distributions;
mysql> select name, developer from distributions;
mysql> select name from distributions where name='Debian';
mysql> select developer from distributions where name='Ubuntu';
mysql> # delete from distributions where name='Debian';
mysql> select /* from distributions;
mysql> alter table distributions add packagemanager char(3) after name;
mysql> describe distributions;
mysql> select * from distributions;
mysql> update distributions set packagemanager="APT" where id="1";
mysql> update distributions set packagemanager="APT" where id="2";
mysql> update distributions set packagemanager="DNF" where id="3";
mysql> select * from distributions;
mysql> insert into distributions (name, packagemanager, developer, founded) values
    -> ('CentOS', 'YUM', 'The CentOS Project', '2004-05-14');
mysql> select * from distributions;
mysql> select name, packagemanager from distributions where founded < '2004-01-01';
mysql> select name from distributions order by founded;
mysql> \q
```

## References and Read More

1. [MySQL: Getting Started with MySQL][mysqlgetstarted]
1. [How to Create a New User and Grant Permissions in MySQL][mysqlnewuser]
1. [MySQL: MySQL 5.7 Reference Manual: 13 SQL Statement Syntax][mysqlsyntax]

## Install PHP and MySQL Support

The next goal is to complete the connection between PHP and MySQL so
that we can use both for our websites.

First install MySQL support for PHP. We're installing some modules alongside
the basic support. These may or may not be needed, but I'm installing them to
demonstrate some basics. Use ``dnf info <packagename>`` to get information
about each package before installing.

```
sudo su
dnf install php-mysqlnd php-cli php-mbstring php-fpm
systemctl restart mysqld.service
systemctl restart httpd.service
```

### Create PHP Scripts

Let's move to the base web directory and create our login file, which
will contain the credentials for our *MySQL regular user* account. In
the previous week, I demonstrated VirtualHosts. We'll use one of our
virtual domains to connect to our MySQL server with PHP.

```
cd /var/www/html/linuxonenterprise/
touch login.php
chmod 640 login.php
ls -l login.php
nano login.php
```

In the file, add the following credentials, substituting your credentials
where necessary:

```
<?php // login.php
$db_hostname = "localhost";
$db_database = "linuxdb";
$db_username = "sean";
$db_password = "an0ldP4ssPhrase!";
?>
```

Now, in a separate file, which will be **index.php**, add the following
PHP to test our database connection and return some results:

```
<html>
<head><title>MySQL Server Example</title></head>
<body>

<?php

// Load MySQL credentials
require_once 'login.php';

// Establish connection
$conn = mysqli_connect($db_hostname, $db_username, $db_password) or
  die("Unable to connect");

// Open database
mysqli_select_db($conn, $db_database) or
  die("Could not open database '$db_database'");

// QUERY 1
$query1 = "show tables from $db_database";
$result1 = mysqli_query($conn, $query1);

$tblcnt = 0;
while($tbl = mysqli_fetch_array($result1)) {
  $tblcnt++;
}

if (!$tblcnt) {
  echo "<p>There are no tables</p>\n";
}
else {
  echo "<p>There are $tblcnt tables</p>\n";
}

// Free result1 set
mysqli_free_result($result1);

// QUERY 2
$query2 = "select name, developer from distributions";
$result2 = mysqli_query($conn, $query2);

$row = mysqli_fetch_array($result2, MYSQLI_NUM);
printf ("%s (%s)\n", $row[0], $row[1]);
echo "<br/>";

$row = mysqli_fetch_array($result2, MYSQLI_ASSOC);
printf ("%s (%s)\n", $row["name"], $row["developer"]);

// Free result2 set
mysqli_free_result($result2);

// Query 3
$query3 = "select * from distributions";
$result3 = mysqli_query($conn, $query3);

while($row = $result3->fetch_assoc()) {
  echo "<p>Owner " . $row["developer"] . " manages distribution " . $row["name"] . ".</p>";
}

mysqli_free_result($result3);

$result4 = mysqli_query($conn, $query3);
while($row = $result4->fetch_assoc()) {
  echo "<p>Distribution " . $row["name"] . " was released on " . $row["founded"] . ".</p>";
}

// Free result4 set
mysqli_free_result($result4);

/* Close connection */
mysqli_close($conn);

?>

</body>
</html>
```

After you save the file and exit the text editor, we need to test the
PHP syntax. If there are any errors in our PHP, these commands will show
the line numbers that are causing errors or leading up to errors. If all
is well with the first command, nothing will output. If all is well with
the second command, HTML should be outputted:

```
php -f login.php
php -f index.php
chown :apache *php
```

### Check IP and Hostname

We want to make sure that ``/etc/hosts`` has the correct IP address
for **linuxonenterprise**:

```
ip a
nano /etc/hosts # update IP address if changed
```

## Tasks

Copy the *login.php* and *index.php* to your ``public_html`` directory
(you should still have *userdir* enabled). Figure out what you need to
change in order to get your script to work there.

## References

- [How to Test PHP MySQL Database Connection Using Script][phpmysql]
- [Install Apache/PHP 7.2.12 on Fedora 29/28, CentOS/RHEL 7.5/6.10][apachephp]
- [MySQL Improved Extension][mysqlimproved]
- [PHP 5 MySQLi Functions][phpmysqli]

Note: this doesn't seem to be a problem now, but in previous times,
there was an an error with authentication due to an upgrade in MySQL
that hadn't caught up with PHP yet. If so, you might need to login as
**root** to MySQL and run the following command, replacing the relevant
information with your non-root user info:

```
ALTER USER 'mysqlUsername'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysqlUsernamePassword';
```

[mysqlgetstarted]:https://dev.mysql.com/doc/mysql-getting-started/en/
[mysqlnewuser]:https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql
[mysqlsyntax]:https://dev.mysql.com/doc/refman/5.7/en/sql-syntax.html
[phpmysql]:https://www.tecmint.com/test-php-mysql-database-connection-using-script/
[apachephp]:https://www.if-not-true-then-false.com/2010/install-apache-php-on-fedora-centos-red-hat-rhel/
[mysqlimproved]:https://secure.php.net/manual/en/book.mysqli.php
[phpmysqli]:https://www.w3schools.com/PHP/php_ref_mysqli.asp
