# Managing Users and Groups

## The passwd file

On my Fedora 30 virtual machine, I can see the following information about my user account:

```bash
$ grep "sean" /etc/passwd
sean:x:1000:1000:sean:/home/sean:/bin/bash
$ grep "sean" /etc/passwd | sed 's/:/\n/g'
sean
x
1000
1000
sean
/home/sean
/bin/bash
```

The fields are:

- username
- password indicator
- user id
- group id
- user name or comment
- home directory
- default shell

Note that you can read about this using ``man 5 passwd``. [ EXPLAIN THE 5 ]

This is a pretty standard Linux file, but some things will change
depending on the distribution. For example, the user id may start at a
different point depending on the system. However, nowadays both Ubuntu
and Fedora set the starting UID and group ID for new users at 1000.

## The shadow file

Need to be root to examine the shadow file:

```
$ sudo su
# grep "sean" /etc/shadow
sean:ENCRYPTED_PASSWORD::0:99999:7:::
# grep "sean" /etc/shadow | sed 's/:/\n/g'
sean
ENCRYPTED_PASSWORD

0
99999
7
```

The fields are (see ``man 5 passwd``):

- login name (username)
- encrypted password
- days since 1/1/1970 since password was last changed
- days after which password must be changed
- minimum password age
- maximum password age
- password warning period
- password inactivity period
- account expiration date
- a reserved field 

## The group file

This file holds group information about the entire system (see ``man group``):

```
$ grep -E 'wheel|^sean' /etc/group | sed 's/:/\n/g'
```

The fields are:

- group name
- group password 
- group ID (GID)
- group members (user list)

## Management Tools

Other user and group utilities include:

- ``/usr/sbin/useradd``
- ``/usr/sbin/usermod``
- ``/usr/sbin/userdel``
- ``/usr/sbin/groupadd``
- ``/usr/sbin/groupdel``
- ``/usr/sbin/groupmod``

## Practice

### Create a new user; modify account

Let's create a new user and modify the account. First note the defaults
in **/etc/login.defs**, **/etc/skel**, and **/etc/default/useradd**.
And then let's change some defaults. We can either user *sudo* or
become *su*. Here I both:

```bash
$ sudo su
# nano /etc/skel/.bashrc
```

Now we're in *nano*, and we want to add these lines at the end. Feel free to add the comments:

```bash
# make "c" a shortcut for "clear"
alias c='clear'
```

Now use *nano* again to create a README file. This file will be added to the home directories of all new users. Add any welcome message you want to add, plus any guidelines for using the system.

```bash
# nano /etc/skel/README
```

After writing (saving) and exiting *nano*, we can go ahead and create the new user:

```
# useradd linus
# grep "linus" /etc/passwd
linus:x:1002:1003::/home/linus:/bin/bash
# grep "linus" /etc/shadow
linus:!!:18186:0:99999:7:::
# # Let's create a password for 'linus'
# passwd linus
# grep "linus" /etc/shadow
# # Let's modify the maximum password lifetime
# passwd -n 90 linus
# # Let's modify the maximum password lifetime
# passwd -x 180 linus
```

### Create a new group; add users to group

```
# grep "linus" /etc/group
linus:x:1001:
# groupadd project1
# grep "project1" /etc/group
project1:x:1002:
# usermod -aG project2 linus
# usermod -aG project2 sean
# grep "project1" /etc/group
project1:x:1002:linus,sean
```

Exit out of root if logged in as root.

### Login as user linus

```
$ su linus
Password:
$ groups
linus project1
```

### Create a shared directory with user sean (or yourself on your machines)

```
$ cd /srv
$ mkdir ourproject
$ ls -ld ourproject
drwx------. 2 linus linus 6 Oct 17 08:52 ourproject/
$ chmod 2770 ourproject
$ ls -ld ourproject
drwxrwx---. 2 linus linus 6 Oct 17 08:52 ourproject/
$ chown linus:project1 ourproject/
$ ls -ld ourproject
drwxrwx---. 2 linus project1 6 Oct 17 08:52 ourproject/
$ exit
```

### Login as normal user (that's sean for me)
$ exit
# And then relogin so that the group mod will take effect
$ groups
sean wheel project1
$ 

### Delete, delete, delete

1. Delete user 'linus'
2. Confirm not listed in **passwd** and **shadow** files.
3. Confirm home directory is gone

#### User deletion

```bash
# userdel -r linus
# grep "linus" /etc/passwd
# grep "linus" /etc/shadow
# cd /home ; ls -l 
```

#### Group deletion

1. Look for groups in **group** file that begin with the string
"project".
2. Delete "project1" group
3. Look again.

```bash
# grep "project*" /etc/group
# groupdel project1
# grep "project*" /etc/group
```
