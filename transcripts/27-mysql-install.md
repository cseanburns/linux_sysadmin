# MySQL Server Administration

## Install and Set Up MySQL

First, install MySQL Community Server, and then log into the MySQL shell under
the **MySQL root** account.

> Note that we have learned to use the term **root** differently this semester.
> In Linux, there is the **root** user and there is also the **root**
> directory. In MySQL and other relational database software, there is also
> a **root** user and this user is not the same as the Linux **root** user.

```
# dnf check-update
# dnf upgrade
# dnf search mysql server
# dnf info community-mysql-server
# dnf info community-mysql-server
# dnf install community-mysql-server
# systemctl list-unit-files mysqld.service
# systemctl status mysqld.service
# systemctl start mysqld.service
# systemctl enable mysqld.service
# systemctl status mysqld.service
# mysql -u root
```

After we have logged in, we need to create a secure password for the **MySQL
root** account. Note again that this is not the same as the **root** account on
the Linux system. That is, these are two different accounts: *Linux root* and
*MySQL root*. Once we have created the password, we will exit MySQL.

To change the MySQL root password where the password is simply "aNewPassword4!"
(withouth the quotes) and then log out (in a production environment, there's no
way I would use a basic password like this---here I'm simply trying to keep
things simple):

```
mysql> alter user 'root'@'localhost' identified by 'aNewPassword4!';
mysql> \q
```

Now we use a MySQL program called ``mysql_secure_installation`` to help secure
the MySQL installation. From the Bash shell, run the following command, and
then respond to the questions as follows:

```
# mysql_secure_installation
Enter password for user root: aNewPassword4!
VALIDATE PASSWORD: Y
Change the password for root: N
PASSWORD STRENGTH: 1
CHANGE ROOT PASSWORD: N
REMOVE ANONYMOUS USERS: Y
DISALLOW ROOT LOGIN REMOTELY: Y
REMOVE TEST DATABASE: Y
RELOAD PRIVILEGE TABLES: Y
```

## Create and Set Up a Regular User Account

Now, log back into the MySQL shell as the MySQL Root user. Here the command is
a bit different from the first one that we used to login to MySQL with because
we now have to enter our password:

```
# mysql -u root -p
```

In MySQL, we will create and set up a new account that is not **root** and
therefore does not have **root** privileges. When we do administrative things
in MySQL, we have to flush (reload the new) privileges:

```
mysql> create user 'sean'@'localhost' identified by 'an0ldP4ssPhrase!';
msyql> flush privileges;
```

Now let's create a pet database for user 'sean'. This user will be granted all
privileges on this database, including all tables in it. Other than granting
all privileges, we could also grant specific privileges, including: CREATE,
DROP, DELETE, INSERT, SELECT, UPDATE, and GRANT OPTION. Such privileges may be
called operations or functions. They allow MySQL users to use and modify the
database:

Don't use this exact command, but the syntax of the ``grant`` command below is
this:

```
grant PRIVILEGE_OPTION on DATABASE.TABLE to 'USER'@'LOCALHOST';
```

In practice, we do this:

```
mysql> create database pets;
mysql> grant all privileges on pets.* to 'sean'@'localhost';
mysql> show databases;
mysql> \q
```

## Logging in as Regular User and Creating Tables

Now, we can start doing MySQL work. As **root**, we've created a new user named
**sean** and a new database for **sean** that is called **pets**. Let's login
as **sean** and create data for our database:

```
$ mysql -u sean -p
mysql> show databases;
mysql> use pets;
mysql> create table cats
    -> (
    -> id int unsigned not null auto_increment,
    -> name varchar(150) not null,
    -> owner varchar(150) not null,
    -> birth date not null,
    -> primary key (id)
    -> );
Query OK, 0 rows affected (0.07 sec)

mysql> show tables;
mysql> describe cats;
```

Congratulations! If you haven't used MySQL or like technology before, then
you've created your first database and a table in that database. Let's create
some records for that table.

## Adding records into the table

We'll use the INSERT command to add records:

```
mysql> insert into cats (name, owner, birth) values
    -> ('Sandy', 'Lennon', '2015-01-03'),
    -> ('Cookie', 'Casey', '2013-11-13'),
    -> ('Charlie', 'River', '2016-05-21');
Query OK, 3 rows affected (0.06 sec)
Records: 3  Duplicates: 0  Warnings: 0
mysql> select * from cats;
```

Success! Now let's play around with our table. We will issues some queries on
the data to retrieve some records or parts of records, we will delete a record,
alter the table structure so that it will hold more data, and add a record:

```
mysql> select owner from cats;
mysql> select birth from cats;
mysql> select name, owner from cats;
mysql> select name from cats;
...
mysql> select name from cats where name='Sandy';
...
mysql> select owner from cats where name='Cookie';
...
mysql> delete from cats where name='Cookie';
mysql> select * from cats;
mysql> alter table cats add gender char(1) after name;
mysql> describe cats;
mysql> update cats set gender="F" where id="1";
mysql> update cats set gender="M" where id="3";
mysql> select * from cats;
mysql> insert into cats (name, gender, owner, birth) values
    -> ('Bob', 'M', 'Alice', '2009-10-01');
mysql> select * from cats;
mysql> select name, gender from cats where birth < "2015-01-01";
mysql> \q
```

## References and Read More

1. [MySQL: Getting Started with MySQL][1]
2. [How to Create a New User and Grant Permissions in MySQL][2]
3. [MySQL: MySQL 5.7 Reference Manual: 13 SQL Statement Syntax][3]

[1]:https://dev.mysql.com/doc/mysql-getting-started/en/
[2]:https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql
[3]:https://dev.mysql.com/doc/refman/5.7/en/sql-syntax.html
