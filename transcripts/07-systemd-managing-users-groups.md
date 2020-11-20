# systemd

* **systemd** is an init system that aims to provide better boot time and
  a better way to manage services and processes.
* **systemd** includes additional utilities to help manage services on a Linux
  system

There are only two aspects of **systemd** that I want to cover in this lesson,
but know that **systemd** is a big, complicated suite of software that provides
a lot of functions. In this lesson, though, we will cover using **systemd** to:

1. manage services
2. examine logs

## Manage Services

When we install a complicated piece of software like a web server (e.g.,
Apache2), a SSH server (e.g., openssh-server), or a database server (e.g.,
MySQL), then it's helpful if we have some commands that will help us manager
that service (the web service/server, the SSH service/server, etc). 

For example, after installing a SSH server, we might like to know if it's
running, or we might want to stop it if it's running, or start it if it's not.
Let's see what that looks like. In the following commands, I will use the
``dnf`` utility to install the ``openssh-server``. Then I will check the status
of the server using the ``systemctl status`` command. I will enable it so that
it starts automatically when the operating system is rebooted using the
``systemctl enable`` command. Finally, I will make sure the firewall allows
outside access to the operating system via ``ssh``. I use the ``sudo`` command
to run the relevant commands as administrator:

```
dnf search openssh
sudo dnf install openssh-server
systemctl status sshd.service
sudo systemctl enable sshd.service
sudo firewall-cmd --add-service=ssh --permanent
```

There are similar commands to stop a service or to reload a service if
a service configuration file has changed. As an example of the latter, let's
say that I wanted to present a message to anyone who logs into my system
remotely using ``ssh``. In order to do that, I need to edit the main ``ssh``
configuration file, which is located in **/etc/ssh/sshd_config**:

```
cd /etc/ssh
sudo nano sshd_config
```

Then I will remove the beginning pound sign and thus un-comment the following line:

```
#Banner none
```

And replace it with a path a file that will contain my message:

```
Banner /etc/ssh/ssh-banner
```

After saving and closing **/etc/ssh/sshd_config**, I will create and open the
banner file using ``nano``:

```
sudo nano /etc/ssh/ssh-banner
```

And add the following:

```
Unauthorized access to this system is not permitted and will be reported to the authorities.
```

Since we have changed a configuration for the ``sshd.service``, we need to
reload the service so that ``sshd.service`` becomes aware of the new
configuration. To do that, I use ``systemctl`` like so:

```
sudo systemctl reload sshd.service
```

Now, when you log into your Fedora system, you will see that new banner displayed.

## Examine Logs

The ``journalctl`` command is also part of the **systemd** software suite and
is used to monitor logs on the system.

If we just type ``journalctl`` at the command prompt, we will be presented with
the logs for the entire system. These logs can be paged through by pressing the
space bar, the page up/page down keys, or the up/down arrow keys, and they can
also be searched by pressing the forward slash ``/``.

```
journalctl
```

However, it's much better to use various options. If you ``tab tab`` after
typing ``journalctl``, command line completion will provide additional fields
(see man page: ``man 7 systemd.journal-fields`` and see ``man man`` for
numbering options) to examine logs for. There are many, but as an example, we
see that there is an option called \_UID=, which allows us to examine the
logs for a user with a specific user id. For example, on our independent Fedora
systems, our user ID numbers are 1000. So that means I can see the logs for my
account by:

```
journalctl _UID=1000
```

The above shows journal entries related to user ID of 1000, which is my user
id. We can see other user IDs by concatenating (``cat``) the **passwd** file.
Not only do real humans who have accounts on the system have user IDs, but many
services do to. Here I look at journal entries for ``chronyd``, with a user ID
of 992. This is a service that manages the system's time:

```bash
cat /etc/passwd
journalctl _UID=984
```

I can more specifically look at the logs files for a service by using the ``-u``
option with ``journalctl``:

```
journalctl -u sshd.service
```

I can examine logs since last boot:

```
journalctl -b
```

Or I can follow the logs in real-time (press **ctrl-c** to quit the real-time
view):

```
journalctl -f
```

## Useful Systemd Commands

You can see more of what ``systemctl`` or ``journalctl`` can do by reading
through their documentation:

```
man systemctl
man journalctl
```

But here are a few other useful commands to explore:


- list units in memory 

```
systemctl list-units
```

- list sockets in memory

```
systemctl list-sockets
```

- get status, start, stop, reload, restart a unit, e.g., sshd

```
systemctl status sshd.service
systemctl start sshd.service
systemctl stop sshd.service
systemctl reload sshd.service
systemctl restart sshd.service
systemctl reload-or-restart sshd.service
```

- enable, disable sshd 

```
systemctl enable sshd.service
systemctl disable sshd.service
```

- ask systemctl if enabled

```
systemctl is-enabled sshd.service
```

- System: reboot, poweroff, or suspend

```
systemctl reboot
systemctl poweroff
systemctl suspend
```

- to show changes to the system

```
systemd-delta 
```

- to list control groups and processes

```
systemd-cgls
```

- to list real-time control group process, resource usage, and memory usage

```
systemd-cgtop
```

- to search failed processes/services:

```
systemctl --state failed
```

- to list services

```
systemctl list-unit-files -t service
```

- to examine boot time:

```
systemd-analyze
```

# Managing Users and Groups

## The passwd file

On my Fedora 32 virtual machine, I can see the following information about my
user account in the **passwd** file:

```
cat /etc/passwd
```

And I can also ``grep`` for specific accounts:

```
grep "sean" /etc/passwd
sean:x:1000:1000:sean:/home/sean:/bin/bash
grep "sean" /etc/passwd | sed 's/:/\n/g'
```

The latter command returns the following output, which shows the various fields on each line:

```
sean
x
1000
1000
sean
/home/sean
/bin/bash
```

The fields represent the following information:

- username
- password indicator
- user id
- group id
- user name or comment
- home directory
- default shell

Note that you can read about this using ``man 5 passwd``. [ EXPLAIN THE 5 ]

This is a pretty standard Linux file, but some things will change depending on
the distribution. For example, the user id may start at a different point
depending on the system. However, nowadays both Ubuntu and Fedora set the
starting UID and group ID for new users at 1000.

## The shadow file

The **/etc/passwd** file does not contain any passwords but a simple **x** to
mark the password field. Passwords on Linux are stored in **/etc/shadow** and
are hashed with **sha512**, which is indicated by **$6$**. You need to be root
to examine the shadow file or use ``sudo``:

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

This file holds group information about the entire system (see ``man group``).
In the following command, you can see that I'm a member of the **wheel** group
(which allow my account to use the ``sudo`` command) and that there's a group
name that is also the name of my user account. The **sean** at the end of the
**wheel** line indicates that I am a member of the **wheel** group. Although
user **sean** is a member of group **sean**, users do not have to be listed as
members of their own group.

```
grep -E 'wheel|^sean' /etc/group
wheel:x:10:sean
sean:x:1000:
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

Let's create a new user and modify the account. First note the defaults in
**/etc/login.defs**, **/etc/skel**, and **/etc/default/useradd**. And then
let's change some defaults. We can either user ``sudo`` or become ``su``. Here
I both to become root:

```
sudo su
nano /etc/skel/.bashrc
```

Now we're in ``nano``, and we want to add these lines at the end. Feel free to add the comments:

```
# make "c" a shortcut for "clear"
alias c='clear'
```

Now use ``nano`` again to create a README file. This file will be added to the
home directories of all new users. Add any welcome message you want to add,
plus any guidelines for using the system.

```
nano /etc/skel/README
```

After writing (saving) and exiting ``nano``, we can go ahead and create the new user:

```
useradd linus
grep "linus" /etc/passwd
linus:x:1002:1003::/home/linus:/bin/bash
grep "linus" /etc/shadow
linus:!!:18186:0:99999:7:::
```

Let's create a password for *linus*:

```
passwd linus
grep "linus" /etc/shadow
```

Let's modify the minimum days and maximum days of the password's lifetime:

```
passwd -n 90 linus
passwd -x 180 linus
```

### Create a new group; add users to the group

Let's now create a new group; add users to group:

```
grep "linus" /etc/group
linus:x:1001:
groupadd project1
grep "project1" /etc/group
project1:x:1002:
usermod -aG project2 linus
usermod -aG project2 sean
grep "project1" /etc/group
project1:x:1002:linus,sean
```

Exit out of root if logged in as root.

Now login as user linus:

```
su linus
Password:
groups
linus project1
```

Create a shared directory with user sean (or yourself on your machines)

```
cd /srv
mkdir ourproject
ls -ld ourproject
drwx------. 2 linus linus 6 Oct 17 08:52 ourproject/
chmod 2770 ourproject
ls -ld ourproject
drwxrwx---. 2 linus linus 6 Oct 17 08:52 ourproject/
chown linus:project1 ourproject/
ls -ld ourproject
drwxrwx---. 2 linus project1 6 Oct 17 08:52 ourproject/
exit
```

Login as normal user (that's sean for me)

```
exit
```

And then relogin so that the group mod will take effect

```
groups
sean wheel project1
```

Now let's delete the new user's account:

### User account and group deletion

```
userdel -r linus
grep "linus" /etc/passwd
grep "linus" /etc/shadow
cd /home ; ls -l 
```

Group deletion:

```
grep "project*" /etc/group
groupdel project1
grep "project*" /etc/group
```

### Another Group Example

Basic steps to:

1. create a new user
2. create a new group
3. create a shared directory for the new group

```
# become root user
sudo su      

# create user account
useradd bfox

# create password for user bfox
passwd bfox

# create new group
groupadd bashclub

# add user sean to 'bashclub' group
usermod -aG bashclub sean

# add user bfox to 'bashclub' group
usermod -aG bashclub bfox

# check if sean is part of 'bashclub' group
groups sean

# check if bfox is part of 'bashclub' group
groups bfox

# change to /home directory
cd /home

# create the directory to be shared by bashclub 
mkdir bashclubfolder

# make bashclub group owner of bashclubfolder
chgrp -R bashclub bashclubfolder
chmod -R 2775 bashclubfolder

# check ownership
ls -l 
```

Now you can log in as either user and work in that shared directory!
