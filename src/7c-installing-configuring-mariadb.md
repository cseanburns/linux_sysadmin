# Installing and Configuring MariaDB

By the end of this section, you will be able to:

1. Install and configure MariaDB as part of the LAMP stack. This will enable your server to store and manage data.
2. Create and secure a MariaDB root user, set up a regular user for day-to-day operations, and understand best practices for database security.
3. Write basic SQL commands to create tables, insert records, and run queries.
4. Integrate MariaDB with PHP to build dynamic web pages.

## Getting Started

We started our LAMP stack when we installed Apache2, and then we added extra functionality when we installed and configured PHP to work with Apache2.
In this section, our objective is to complete the LAMP stack and install and configure [MariaDB][wikipedia_mariadb].

MariaDB is a (so-far) compatible fork of the MySQL relational database.
It allows us to store, retrieve, and manage data for our websites.
This makes our web applications dynamic and capable of handling complex user interactions.
If you need a refresher on relational databases, the MariaDB website can help.
See: [Introduction to Relational Databases][intro_relational_databases].

It's also good to review the documentation for any technology that you use.
MariaDB has [good documentation][mariadb_docs] and getting started pages.

## Install and Set Up MariaDB

In this section, we'll learn how to install, setup, secure, and configure the MariaDB relational database.
The goal it to make it work with the Apache2 web server and the PHP programming language.

First, let's install MariaDB Community Server, and then log into the MariaDB shell under the **MariaDB root** account.

```
sudo apt install mariadb-server mariadb-client
```

This should also start and enable the database server, but we can check if it's running and enabled using the `systemctl` command:

```
systemctl status mariadb
```

Next we need to run a post installation script called `mysql_secure_installation` that sets up the MariaDB root password and performs security checks.
To do that, run the following command, and **be sure to save the MariaDB root password you create**:

```
sudo mysql_secure_installation
```

Again, here is where you create a root password for the MariaDB database server.
**Be sure to save that and not forget it!**
When you run the above script, you'll get a series of prompts to respond to like below.
Press **enter** for the first prompt, press **Y** for the prompts marked **Y**, and input your own password.
Since this server is exposed to the internet, be sure to use a complex password.

```
Enter the current password for root (enter for none):
Set root password: Y
New Password: [YOUR-PASSWORD-HERE]
Re-enter new password: [YOUR-PASSWORD-HERE]
Remove anonymous users: Y
Disallow root login remotely: Y
Remove test database and access to it: Y
Reload privilege tables now: Y
```

> Removing anonymous users ensures that no one can access the database without credentials.
> Disallowing remote root login reduces the risk of unauthorized remote access.

We can login to the database to test it.
In order to do so, we have to become the **root Linux user**, which we can do with the following command:

```
sudo su
```

> Note: we need to generally be careful when we enter commands on the command
> line, because it's a largely unforgiving computing environment. But we need
> to be especially careful when we are logged in as the Linux root user. This
> user can delete anything, including files that the system needs in order to
> boot and operate. Always use `exit` immediately after finishing tasks as root
> to minimize the risk of accidental changes that could affect the entire
> system.

After we are root, we can login to MariaDB, run the `show databases;` command, and then exit MariaDB the `\q` command:

```
root@hostname:~# mariadb -u root
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 47
Server version: 10.3.34-MariaDB-0ubuntu0.20.04.1 Ubuntu 20.04

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
3 rows in set (0.002 sec)
```

> Note: If we are logging into the root database account as the root Linux user, we don't need to enter our password.

## Create and Set Up a Regular User Account

We need to reserve the **root MariaDB user** for special use cases.
Instead we create a **regular MariaDB user**.
Using a regular user account minimizes the security risks associated with performing everyday operations.
Root privileges should be reserved for administrative tasks only!

To create a regular MariaDB user, we use the `create` command.
In the command below, I create a new user called **webapp**.
I use a complex password that I insert within the single quotes at the end:

```
MariaDB [(none)]> create user 'webapp'@'localhost' identified by '[YOUR-PASSWORD-HERE]';
```

If the prompt returns a **Query OK** message, then the new user should have been created without any issues.

## Create a Practice Database

As the root database user, let's create a new database for a regular, new user.

The regular user will be granted **all privileges** on the new database, including all its tables.
Other than granting **all privileges**, we could limit the user to specific privileges, including:
**CREATE, DROP, DELETE, INSERT, SELECT, UPDATE, and GRANT OPTION**.
Such privileges may be called operations or functions, and they allow MariaDB users to use and modify the databases, where appropriate.
For example, we may want to limit the **webapp** user to only be able to use **SELECT** commands.
It totally depends on the purpose of the database and our security risks.

```
MariaDB [(none)]> create database linuxdb;
MariaDB [(none)]> grant all privileges on linuxdb.* to 'webapp'@'localhost';
MariaDB [(none)]> show databases;
```

Exit out of the MariaDB database as the **root MariaDB user**.
Then exit out of the **root Linux user account**.
You should be back to your normal Linux user account:

```
MariaDB [(none)]> \q
root@hostname:~# exit
```

> **Note:** relational database keywords are often written in all capital
> letters. As far as I know, this is simply a convention to make the code more
> readable. However, in most cases I'll write the keywords in lower case
> letters. This is simply because, by convention, I'm super lazy.

## Logging in as Regular User and Creating Tables

We can start doing MariaDB work.
As a reminder, we've created a new MariaDB user named **webapp** and a new database for **webapp** that is called **linuxdb**.
When we run the `show databases` command as the **webapp** user, we should see the **linuxdb** database (and only the **linuxdb** database).
Note below that I use the `-p` option.
This instructs MariaDB to request the password for the **webapp** user, which is required to log in.

```
mariadb -u webapp -p
MariaDB [(none)]> show databases;
MariaDB [(none)]> use linuxdb;
```

A database is not worth much without data.
In the following code, I create and define a new table for our **linuxdb** database.
The table will be called **distributions**, and it will contain data about various Linux distributions.
This includes the name of distribution, distribution developer, and founding date.
Creating this kind of structure with separate fields to store essential data is a common approach for structuring data that
can be easily queried and expanded.

```
MariaDB [(linuxdb)]> create table distributions
    -> (
    -> id int unsigned not null auto_increment,
    -> name varchar(150) not null,
    -> developer varchar(150) not null,
    -> founded date not null,
    -> primary key (id)
    -> );
Query OK, 0 rows affected (0.07 sec)

MariaDB [(linuxdb)]> show tables;
MariaDB [(linuxdb)]> describe distributions;
```

Congratulations! Now create some records for that table.

### Adding records into the table

We can populate our **linuxdb** database with some data.
We'll use the `insert` command to add our records into our **distribution** table.

```
MariaDB [(linuxdb)]> insert into distributions (name, developer, founded) values
    -> ('Debian', 'The Debian Project', '1993-09-15'),
    -> ('Ubuntu', 'Canonical Ltd.', '2004-10-20'),
    -> ('Fedora', 'Fedora Project', '2003-11-06');
Query OK, 3 rows affected (0.004 sec)
Records: 3  Duplicates: 0  Warnings: 0
MariaDB [(linuxdb)]> select * from distributions;
```

Success! Now let's test our table.

### Testing Commands

We will complete the following tasks to refresh our MySQL/MariaDB knowledge:

- retrieve some records or parts of records, 
- delete a record,
- alter the table structure so that it will hold more data, and
- add a record:

```
MariaDB [(linuxdb)]> select name from distributions;
MariaDB [(linuxdb)]> select founded from distributions;
MariaDB [(linuxdb)]> select name, developer from distributions;
MariaDB [(linuxdb)]> select name from distributions where name='Debian';
MariaDB [(linuxdb)]> select developer from distributions where name='Ubuntu';
MariaDB [(linuxdb)]> select * from distributions;
MariaDB [(linuxdb)]> alter table distributions
    -> add packagemanager char(3) after name;
MariaDB [(linuxdb)]> describe distributions;
MariaDB [(linuxdb)]> update distributions set packagemanager='APT' where id='1';
MariaDB [(linuxdb)]> update distributions set packagemanager='APT' where id='2';
MariaDB [(linuxdb)]> update distributions set packagemanager='DNF' where id='3';
MariaDB [(linuxdb)]> select * from distributions;
MariaDB [(linuxdb)]> delete from distributions where name='Debian';
MariaDB [(linuxdb)]> insert into distributions
    -> (name, packagemanager, developer, founded) values
    -> ('Debian', 'APT', 'The Debian Project', '1993-09-15'),
    -> ('CentOS', 'YUM', 'The CentOS Project', '2004-05-14');
MariaDB [(linuxdb)]> select * from distributions;
MariaDB [(linuxdb)]> select name, packagemanager
    -> from distributions
    -> where founded < '2004-01-01';
MariaDB [(linuxdb)]> select name from distributions order by founded;
MariaDB [(linuxdb)]> \q
```

## Install PHP and MySQL Support

The next goal is to complete the connection between PHP and MariaDB so that we can use both for our websites.
Adding PHP support for MariaDB allows us to write scripts that can interact with the database.
This enables us to dynamically display and modify content in the web browser based on user interactions.

First install PHP support for MariaDB.
We're installing some modules alongside the basic support.
These may or may not be needed, but I'm installing them to demonstrate some basics.

```
sudo apt install php-mysql
```

And then restart Apache2 and MariaDB:

```
sudo systemctl restart apache2
sudo systemctl restart mariadb
```

### Create PHP Scripts

In order for PHP to connect to MariaDB, it needs to authenticate itself.
To do that, we will create a **login.php** file in **/var/www/html**.
We also need to change the group ownership of the file and its permissions.
Since this file contains password information, changing its permissions mean we prevent others from accessing it.

```
cd /var/www/html/
sudo touch login.php
sudo chmod 640 login.php
sudo chown :www-data login.php
ls -l login.php
sudo nano login.php
```

In the file, add the following credentials.
If you used a different database name than **linuxdb** and a different username than **webapp**, then you need to substitute your names below. 
You need to use your own password where I have the Xs:

```
<?php // login.php
$db_hostname = "localhost";
$db_database = "linuxdb";
$db_username = "webapp";
$db_password = "[YOUR-PASSWORD-HERE]";
?>
```

Next we create a new PHP file for our website.
This file will display HTML but will primarily be PHP interacting with our MariaDB **distributions** table in our **linuxdb** database.

Create a file titled **distros.php**.

```
sudo nano distros.php
```

Then copy over the following text.
I suggest you transcribe it, especially if you're interested in learning a bit of PHP, but you can simply copy and paste it into the `nano` buffer:

```
<html>
<head>
<title>MySQL Server Example</title>
</head>
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

Save the file and exit out of `nano`.

### Test Syntax

After you save the file and exit the text editor, we need to test the PHP syntax.
If there are any errors in our PHP, these commands will show the line numbers that are causing errors or leading up to errors.
Nothing will output if all is well with the first command.
If all is well with the second command, HTML should be outputted:

```
sudo php -f login.php
sudo php -f distros.php
```

## Conclusion

Congratulations! If you've reached this far, you have successfully created a LAMP stack.
In the process, you have learned:

- how to install and set up MariaDB
- how to create MariaDB root and regular user accounts
- how to create a test database with play data for practicing, and
- how to connect this with PHP for display on a webpage.

In regular applications of these technologies, there's a lot more involved, but completing the above process is a great start to learning more.
In the next section, we will apply what we learned in the PHP and MariaDB sections to install and configure a WordPress installation.

[intro_relational_databases]:https://mariadb.com/kb/en/introduction-to-relational-databases/
[mariadb_docs]:https://mariadb.org/documentation/
[wikipedia_mariadb]:https://en.wikipedia.org/wiki/MariaDB
