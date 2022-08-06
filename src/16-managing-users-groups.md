# Managing Users

In some cases we'll want to provide user accounts
on the servers we administrate, or
we'll want to set up servers for others to use.
The process of creating accounts is fairly straightforward, but
there are a few things to know about how user accounts work.

## The passwd file

The **/etc/passwd** file contains information
about the users on your system.
There is a man page that describes the file, but
man pages are divided into sections (see ``man man``), and
the man page for the ``passwd`` file is in section 5.
Therefore in order to read the man page
for the **/etc/passwd** file,
we run the following command:

```
man 5 passwd
```

Before we proceed,
let's also take a look at a single line of the file.
Below I'll show the output for a madeup user account:

```
grep "sean" /etc/passwd
peter:x:1000:1000:peter,,,:/home/peter:/bin/bash
```

The line starting with **peter** is a colon separate line.
That means that the line is composed of multiple fields
each separated by a colon.

``man 5 passwd`` tells us what each field indicates.
The first field is the login name,
which in this case is **peter**.
The second field, marked **x**, marks the password field.
This file does not contain the password, though.
The passwords, which are [hashed and salted][hashedSalted],
for users are located in **/etc/shadow**,
which can only be read by the root user
(or using the ``sudo`` command).

> Hashing a file or a string of text is a
> process of running a hashing algorithm on the file or text.
> If the file or string is copied exactly, byte for byte,
> then hashing the copy will return the same value.
> If anything has changed about the file or string,
> then the hash value will be different.
> By implication, this means that if two users on a system
> use the same password,
> then the hash of each will be equivalent.
> Salting a hashed file (or file name)
> or string of text is a process
> of adding random data to the file or string.
> Each password will have a unique and mostly random salt
> added to it.
> This means that even if two users on a system use the
> same password,
> salting will mean that their passwords are unique.

The third column indicates the user's numerical ID, and
the fourth column indicates the uers' group ID.
The fifth column repeats the login name, but
could also serve as a comment field.
Comments are added using certain commands (discussed later).
The fifth field identifies the user's home directory,
which is **/home/peter**.
The sixth field identifies the user's default shell,
which is ``/bin/bash``.

The **user name or comment** field merely repeats the login name here,
but it can hold specific types of information.
We can add comments using the ``chfn``.
Comments include the user's full name,
their home and work phone numbers,
their office or room number, and so forth.
To add a full name to user **peter**'s account,
we use the **-f** option:

```
sudo chfn -f "Peter Parker" peter
```

The **/etc/passwd** file is a standard Linux file, but
some things will change depending on the distribution.
For example, the user and group IDs above start at 1000 because
**peter** is the first human account on the system.
This is a common starting numerical ID nowadays,
but it could be different on other Linux distributions.
But the home directory could be different on other systems;
for example, it the default could be located at **/usr/home/username**.
Also, other shells exist besides ``bash``, 
like [zsh][zsh],
which is now the default shell on macOS, and
so other systems may default to different shell environments.

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

[hashedSalted]:https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/
[zsh]:https://www.zsh.org/
