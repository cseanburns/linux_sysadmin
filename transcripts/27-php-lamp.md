# Set up PHP and MySQL

## Install PHP and MySQL Support 

The goal here is to complete the connection between PHP and MySQL so that we
can use both for our websites.

First install MySQL support for PHP. We're installing some modules alongside
the basic support. These may or may not be needed, but I'm installing them to
demonstrate some basics. Use ``dnf info <packagename>`` to get information
about each package before installing.

```
$ sudo su
# dnf install php-mysqlnd php-cli php-mbstring php-fpm
# systemctl restart mysqld.service
# systemctl restart httpd.service
```

## Create PHP Scripts

Let's move to the base web directory and create our login file, which will
contain the credentials for our *MySQL* account. In the previous week,
I demonstrated virtualhosts. We'll use one of our virtual domains to connect to
our MySQL server with PHP. 

```
# cd /var/www/html/linuxsysadmins/
# touch login.php
# chmod 600 login.php
# chown apache:apache login.php
# vi login.php
```

In the file, add the following credentials, substituting your credentials where
necessary:

```
<?php // login.php
$db_hostname = "localhost";
$db_database = "pets";
$db_username = "sean";
$db_password = "an0ldP4ssPhrase!";
?>
```

Now, in a separate file, which will be **index.php**, I'll add the following
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
$query2 = "select name, owner from cats";
$result2 = mysqli_query($conn, $query2);

$row = mysqli_fetch_array($result2, MYSQLI_NUM);
printf ("%s (%s)\n", $row[0], $row[1]);
echo "<br/>";

$row = mysqli_fetch_array($result2, MYSQLI_ASSOC);
printf ("%s (%s)\n", $row["name"], $row["owner"]);

// Free result2 set  
mysqli_free_result($result2);

// Query 3
$query3 = "select * from cats";
$result3 = mysqli_query($conn, $query3);

while($row = $result3->fetch_assoc()) {
	echo "<p>Owner " . $row["owner"] . " has pet " . $row["name"] . ".</p>";
}

mysqli_free_result($result3);

$result4 = mysqli_query($conn, $query3);
while($row = $result4->fetch_assoc()) {
	echo "<p>Pet " . $row["name"] . " was born on " . $row["birth"] . ".</p>";
}

// Free result4 set  
mysqli_free_result($result4);

/* Close connection */
mysqli_close($conn);

?>

</body>
</html>
```

After you save the file and exit the text editor, we can test the PHP syntax by
doing the following. If there are any errors in our PHP, these commands will
show the line numbers that are causing errors or leading up to errors. If all
is well with the first command, nothing will output. If all is well with the
second command, HTML should be outputted:

```
# php -f login.php
# php -f index.php
```


Next we need to update our configuration file for our linuxsysadmin
virtualhost, and reverse the order of the **DirectoryIndex** field so that
**index.php** is listed before **index.html**. Then restart **httpd.service**.

```
# cd /etc/httpd/conf.d/
# nano linuxsysadmin.conf
...
# httpd -t
# systemctl restart httpd.service
```

## Tasks

Copy the *login.php* and *pets.php* to your ``public_html`` directory (you
should still have *userdir* enabled). Figure out what you need to change in
order to get your script to work there.

## References

- [How to Test PHP MySQL Database Connection Using Script][1]
- [Install Apache/PHP 7.2.12 on Fedora 29/28, CentOS/RHEL 7.5/6.10][2]
- [MySQL Improved Extension][3]
- [PHP 5 MySQLi Functions][4]

[1]:https://www.tecmint.com/test-php-mysql-database-connection-using-script/
[2]:https://www.if-not-true-then-false.com/2010/install-apache-php-on-fedora-centos-red-hat-rhel/
[3]:https://secure.php.net/manual/en/book.mysqli.php
[4]:https://www.w3schools.com/PHP/php_ref_mysqli.asp

Note: there might be an error with authentication due to a recent upgrade in
MySQL that hasn't caught up with PHP yet. If so, you might need to login as
**root** to MySQL and run the following command, replacing the relevant
information with your non-root user info:

```
ALTER USER 'mysqlUsername'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysqlUsernamePassword';
```
