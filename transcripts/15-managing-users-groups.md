# Managing Users

## The passwd file

On my Fedora 34 virtual machine, I can see the following information about my user account in the **passwd** file:

```
cat /etc/passwd
```

Or, I can also ``grep`` or ``awk`` for specific accounts:

```
grep "$(whoami)" /etc/passwd
sean:x:1000:1000:sean::/home/sean:/usr/bin/bash

grep "sean" /etc/passwd
sean:x:1000:1000:sean::/home/sean:/usr/bin/bash

awk '/sean/ { print $0 }' /etc/passwd
sean:x:1000:1000:sean::/home/sean:/usr/bin/bash
```

Any of those commands can be piped through ``sed`` to look at the individual fields, one line at a time:

```
grep "sean" /etc/passwd | sed 's/:/\n/g'
sean
x
1000
1000

/home/sean
/usr/bin/bash
```

The fields represent the following information:

* username
* password indicator
* user id
* group id
* user name or comment
* home directory
* default shell

You can read about these fields via ``man 5 passwd``. [ EXPLAIN THE 5 ]

Note that the **user name or comment** line is blank. We can add a comment using the ``chfn``, and there are multiple options to use. If I use the ``-f`` option, I can set my full name to appear here. See ``man chfn`` for more options to set:

```
sudo chfn -f "Sean Burns" sean
```

The **/etc/passwd** file is a pretty standard Linux file, but some things will change depending on the distribution. For example, the user id may start at a different point depending on the system. However, nowadays both Ubuntu and Fedora set the starting UID and group ID for new users at 1000.

## The shadow file

The **/etc/passwd** file does not contain any passwords but a simple **x** to mark the password field. Passwords on Linux are stored in **/etc/shadow** and are hashed with **sha512**, which is indicated by **$6$**. You need to be root to examine the shadow file or use ``sudo``:

```
sudo su
grep "sean" /etc/shadow
sean:ENCRYPTED_PASSWORD::0:99999:7:::
grep "sean" /etc/shadow | sed 's/:/\n/g'
sean
ENCRYPTED_PASSWORD

0
99999
7
```

The fields are (see ``man 5 passwd``):

* login name (username)
* encrypted password
* days since 1/1/1970 since password was last changed
* days after which password must be changed
* minimum password age
* maximum password age
* password warning period
* password inactivity period
* account expiration date
* a reserved field

## The group file

The **/etc/group** file holds group information about the entire system (see ``man group``). In the following command, you can see that I'm a member of the **wheel** group (which allows my account to use the ``sudo`` command) and that there's a group name that is also the name of my user account. The **sean** at the end of the **wheel** line indicates that I am a member of the **wheel** group. Although user **sean** is a member of group **sean**, users do not have to be listed as members of their own group.

```
grep -E 'wheel|^sean' /etc/group
wheel:x:10:sean
sean:x:1000:
```

The fields are:

* group name
* group password
* group ID (GID)
* group members (user list)

## Management Tools

Other user and group utilities include:

* ``/usr/sbin/useradd``
* ``/usr/sbin/usermod``
* ``/usr/sbin/userdel``
* ``/usr/sbin/groupadd``
* ``/usr/sbin/groupdel``
* ``/usr/sbin/groupmod``
* ``/usr/sbin/gpasswd``

## Practice

### Modify default new user setttings

In today's demo, we will modify some default user account settings for new users, and then we'll create a new user account.

Before we proceed, let's review several important configuration files that establish some default settings:

- **/etc/login.defs** : see ``man login.defs``
- **/etc/skel**
- **/etc/default/useradd**

Let's change some defaults. We can either user ``sudo`` or become ``su``. Here I use ``sudo`` to become root:

```
sudo su
```

Let's edit the default **.bashrc** file:

```
nano /etc/skel/.bashrc
```

We want to add these lines at the end of the file:

```
# Dear New User,
#
# I have made the following settings to make your life a bit easier:
#
# make "c" a shortcut for "clear"
alias c='clear'
#
# make vi the default command line keybinding
set -o vi
```

Now use ``nano`` again to create a README file. This file will be added to the home directories of all new users. Add any welcome message you want to add, plus any guidelines for using the system.

```
nano /etc/skel/README
```

### Add new user account

After writing (saving) and exiting ``nano``, we can go ahead and create a new user named **linus**. The ``-m`` option creats the user's home directory, the ``-U`` option creates a group with the same name as the user, and the ``-s`` option sets the default shell to ``/usr/bin/bash``.

```
useradd -m -U -s /usr/bin/bash linus
grep "linus" /etc/passwd
```

Let's add the user's full name:

```
chfn -f "Linus Torvalds" linus
```

The user does not yet have a password set. Let's create a password for *linus*:

```
grep "linus" /etc/shadow
passwd linus
grep "linus" /etc/shadow
```

Let's modify the minimum days and maximum days of the password's lifetime:

```
passwd -n 90 linus
passwd -x 180 linus
```

### Create a new group; add users to the group

Let's now create a new group, and then I will add my account and my new user's account to the group:

```
grep "linus" /etc/group
groupadd developers
grep "developers" /etc/group
gpasswd -a linus developers
gpasswd -a sean developers
grep "developers" /etc/group
```

Exit out of root if logged in as root.

Now login as user linus and examine the user's group memberships:

```
su linus
groups
```

Great! Let's exit out and become root again:

```
exit
sudo su
```

Let's make the **/projects** directory/logical volume a shared directory:

```
ls -ld /projects
# change ownership of the directory to the group developers
chown :developers /projects
# allow all group users to add and delete from the folder and read/write to each other's files
# See this post for various options:
# https://ubuntuforums.org/showthread.php?t=2138476&p=12616640#post12616640
chmod 2770 /projects
exit
```

Log all the way out and then login again:

```
exit # from root
exit # from regular user
```

And then relogin so that the group modification will take affect. Check with the ``groups`` command:

```
groups
```

### User account and group deletion

If we want to delete the new user's account:

```
userdel -r linus
grep "linus" /etc/passwd
grep "linus" /etc/shadow
cd /home ; ls -l
```

And then delete the new group:

```
grep "developers" /etc/group
groupdel developers
grep "developers" /etc/group
```
