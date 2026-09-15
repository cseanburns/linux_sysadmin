# Managing Users and Groups

1. **Understanding User and Group Management**: Learn how to create, modify, and delete user accounts and groups
on a Linux system using essential tools like `useradd`, `userdel`, `groupadd`, and `groupdel`.
1. **Working with System Files**: Gain familiarity with critical system files like `/etc/passwd`, `/etc/shadow`, and
`/etc/group`, and understand how user, password, and group information is stored and managed.
1. **Customizing User Account Settings**: Modify default settings for new user accounts by editing configuration files
such as `/etc/skel` and `/etc/adduser.conf` to allow for customization of new user environments.
1. **Password and Account Security**: Develop skills in securing user accounts by setting password expiration policies and managing password lifetimes through the `/etc/shadow` file and commands like `passwd` and `chage`.
1. **Group-Based Permissions and Shared Resources**: Learn to create and manage groups, assign users to groups, and configure shared directories with appropriate permissions to facilitate collaborative work among users.
1. **File Permissions and Directory Management**: Understand how to change ownership and permissions of directories using tools like `chmod` and `chgrp` to control access based on user and group roles.
1. **Practical User Management Tools**: Apply hands-on experience using utilities such as `gpasswd`, `su`, `sudo`, and
`nano` to manage users and groups, edit system files, and adjust account settings on a Linux system.

## Getting Started

If you're like me, you have user accounts everywhere.
I have accounts on my phone and my laptop.
I have a Google account, a GitHub account, an account at my public library, an account at Costco.
I have a university account that let's me use the same login across multiple university systems, including email and our learning management systems.
I have a lot of user accounts, like you probably do.

For many of those accounts, I have access to some things and not to others.
For my university, I can submit grades to the registrar for my classes, but I can't submit grades to the registrar for my colleagues' classes.
Lots of professors serve on lots of committees.
I can access files for the committees I'm a member of, but not for those where I'm not a member.
However, various administrators, like my unit director, can access all those files.

In order to define what a user can do with their account, systems implement **authentication** and **authorization** mechanisms.
Authentication and authorization are fundamental concepts in system security and resource management, and they serve distinct but connected purposes.
**Authentication** is the process of verifying a user's identity.
When I attempt to login to my university system, it asks, "who are you?", and I reply with my credentials, which are my username and password.

**Authorization** determines what an authenticated user is allowed to do.
Once I am authenticated on my university system, it asks, "what can you do?"
Then the system checks various permissions to allow certain actions and not others or access to certain resources and not others.

These basic concepts are true across all operating systems and services.
How these concepts are implemented vary, though.
In this section, we will learn about the commands that we use to **authenticate** and **authorize** users on a Linux server.

## The `man` pages

Before we begin, you need to know about the `man` pages.
The `man` (short for *manual*) pages are internal documentation on just about every part of your system.
You can read the manual for the commands on your system and for many of the special files on your system.
For example, you can read the manual on the `ls` command with `man ls`.
Or you can read the manual on the `chmod` command with `man chmod`.
You can also read the manual on the manual, which you'd invoke with the `man man` command.
Much of what I know about the commands in this book, I learned from their `man` pages, such as:

- `man date`
- `man glob`
- `man grep`
- `man bash`
- `man regex`
- and more!

The `man` pages are categorized by sections, which are explained in the `man man` page.
Each section is denoted by a number.
The first section, denoted by the number 1, contains `man` pages on executable programs or shell commands.
The fifth section, denoted by the number 5, contains `man` pages on file formats and conventions.
There are nine total sections.
In the case where a command and a system file each have the same name,
then we need to specify the section number when invoking `man` for those pages.
For example, use `man 1 crontab` to read the `man` page for the `crontab` executable, which is located at `/usr/bin/crontab`.
Use `man 5 crontab` to read the `man` page for the **crontab** file, which is locate at `/etc/crontab`.
At the bottom of many `man` pages,
there is a **See Also** section that helps to identify alternate manual pages for these commands.
We can also use the `apropos` command to identify `man` pages written across multiple sections.
For example, the `apropos crontab` command will show the following results:

```
crontab (1)          - maintain crontab files for individual users (Vixie Cron)
crontab (5)          - tables for driving cron
```

You can make the `man` pages easier to read by installing an additional program called `bat`.
The `bat` program is a drop-in replacement for the `cat` command but comes with syntax highlighting and more.
To install `bat`, do:

```
sudo apt install bat
```

Then use `nano` (or your favorite text editor) to open your `$HOME/.bashrc` file:

```
nano $HOME/.bashrc
```

And add the following line at the end, which will add some color to the `man` pages:

```
export MANPAGER="sh -c 'col -bx | batcat -l man -p'"
```

Once you've closed and saved your `$HOME/.bashrc` file, you need to source it:

```
source $HOME/.bashrc
```

Now `man` pages will look better.

Additionally, since `bat` is a drop-in replacement for the `cat` command, you can also use it to view or concatenate files.
The full command is `batcat [FILE]`, where **[FILE]** is the name of the file or files to view.

## The passwd file

On every system there will be some place where information about users is stored.
On a Linux system, user account information is stored in the file `/etc/passwd`.
You should take a moment to read about this file in its `man` page.
However, if you run `man passwd`, you will by default get the `man` page on the `/usr/bin/passwd` command.
We want to read about the **passwd** file located at `/etc/passwd`,
which is in section 5, the section about file formats and conventions:

```
man 5 passwd
```

Let's take a look at a single line of the file.
Below I show the output of my user account:

```
grep "sean" /etc/passwd
```

And the output:

```
sean:x:1000:1000:sean,,,:/home/sean:/bin/bash
```

Per the `man 5 passwd` page, we know that the line starting with **sean** is a colon separated line.
That means that the line is composed of multiple fields each separated by a colon (which is perfect for `awk` to parse).

`man 5 passwd` tells us what each field indicates.
The first field is the login name, which in this case is **sean**.
The second field, marked **x**, marks the password field.
This file does not contain the password, though.
The passwords, which are [hashed and salted][hashedSalted], for users are stored in the `/etc/shadow` file.
Th `/etc/shadow` file can only be read by the root user (or using the `sudo` command).

> Hashing a file or a string of text is a process of running a hashing algorithm on the file or text.
> If the file or string is copied exactly, byte for byte, then hashing the copy will return the same value.
> If anything has changed about the file or string, then the hash value will be different.
> By implication, this means that if two users on a system use the same password, then the hash of each will be equivalent.
> Salting a hashed file (or file name) or string of text is a process of adding random data to the file or string.
> Each password will have a unique and mostly random salt added to it.
> This means that even if two users on a system use the same password, salting their passwords will result in unique values.

The third column indicates the user's numerical ID, and the fourth column indicates the users' group ID.
The fifth column repeats the login name, but could also serve as a comment field.
Comments are added using certain commands (discussed later).
The fifth field identifies the user's home directory, which is **/home/sean**.
The sixth field identifies the user's default shell, which is `/bin/bash`.

The **user name or comment** field merely repeats the login name here, but it can hold specific types of information.
We can add comments using the ``chfn`` command.
Comments include the user's full name, their home and work phone numbers, their office or room number, and so forth.
To add a full name to user **sean**'s account, we use the **-f** option:

```
sudo chfn -f "Sean Burns" sean 
```

The **/etc/passwd** file is a standard Linux file, but data in the file will change depending on the Linux distribution.
For example, the user and group IDs above start at 1000 because **sean** is the first human account on the system.
This is a common starting numerical ID, but it could be different on other Linux or Unix-like distributions.
The home directory could be different on other systems, too;
for example, the default could be located at **/usr/home/sean**.
Also, other shells exist besides ``bash``, like [zsh][zsh], which is now the default shell on macOS;
so other systems may default to different shell environments.

## The shadow file

The **/etc/passwd** file does not contain any passwords but a simple **x** to mark the password field.
Passwords on Linux are stored in **/etc/shadow** and are hashed with **sha512**, which is indicated by **$6$**.
You need to be root to examine the shadow file or use ``sudo``:

The fields are (see ``man 5 shadow``):

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

The **/etc/shadow** file should not be edited directly.
If we want to set a warning that a user's password will expire,
we could use the `passwd` command (see `man passwd` for options), or the `chage` command.
The following command would make it so the user **sean** is warned that their password will expire in 14 days: 

```
passwd -w 14 sean 
```

Running this or the `chage` command will update the `/etc/shadow` file, but
it may also communicate the change to other parts of the system, depending on what's installed.
So again, do not directly edit the `/etc/shadow` file.

## The group file

The **/etc/group** file holds group information about the entire system (see `man 5 group`).
By default the file can be viewed by anyone on a system, but
there is also a `groups` command that will return the groups for a user (see: `man groups`).
Running the `groups` command by itself will return a list of group memberships your account belongs to.
One of those groups will be a group with the same name as your username.

## Management Tools

There are different ways to create new users and groups, and
the following list includes most of the utilities to help with this.
Note that, based on the names of the utilities, some of them are repetitive.

* useradd (8) - create a new user or update default new user information
* usermod (8) - modify a user account
* userdel (8) - delete a user account and related files
* groupadd (8) - create a new group
* groupdel (8) - delete a group
* groupmod (8) - modify a group definition on the system
* gpasswd (1) - administer /etc/group and /etc/gshadow
* adduser.conf (5) - configuration file for adduser(8) and addgroup(8) .
* adduser (8) - add a user or group to the system
* deluser (8) - remove a user or group from the system
* delgroup (8) - remove a user or group from the system
* chgrp (1) - change group ownership

The numbers within parentheses above indicate the `man` section.
Therefore, to view the man page for the `userdel` command:

```
man 8 userdel
```

## Authentication

### Modify default new user settings

Let's modify some default user account settings for new users, and then we'll create a new user account.

Before we proceed, let's review some important configurations that establish some default settings:

- `/etc/skel`
- `/etc/adduser.conf`

The `/etc/skel` directory defines the home directory for new users.
Whatever files or directories exist in this directory at the time a new user account is created
will result in those files and directories being created in the new user's home directory.
In other words, the contents of this directory serve as a template for new user directories.
We can view the contents using the following command:

```
ls -a /etc/skel/
```

The `/etc/adduser.conf` file defines the default parameters for new users.
It's in this file where the default starting user and group IDs are set,
where the default home directory is located (e.g., in `/home/`),
where the default shell is defined (e.g., `/bin/bash`),
where the default permissions are set for new home user directories (e.g., `0755`) and more.

Let's change some defaults for `/etc/skel`.
We need to use `sudo [command]` since this directory and its contents are owned by the `root` user.
First, we'll edit the default **.bashrc** file:

```
sudo nano /etc/skel/.bashrc
```

We want to add the following lines at the end of the file.
This file is a configuration file for ``/bin/bash``, and will be interpreted by Bash.
Lines starting with a hash mark are comments:

```
# Dear New User,
#
# I have made the following settings
# to make your life a bit easier:
#
# make "c" a shortcut for "clear"
alias c='clear'
```

Save and exit the file.

Use `nano` again to create a README file.
This file will be added to the home directories of all new users.
Add any welcome message you want to add, plus any guidelines for using the system.
Then save and exit the file.

```
sudo nano /etc/skel/README
```

### Add new user account

After writing (saving) and exiting `nano`, we can go ahead and create a new user named **linus**.

```
sudo adduser linus
```

We'll be prompted to enter a password for the new user, plus comments (full name, phone number, etc).
Any of these can be skipped by pressing enter.
You can see from the output of the `grep` command below that I added some extra information:

```
grep "linus" /etc/passwd
linus:x:1003:1004:Linus Torvalds,333,555-123-4567,:/home/linus:/bin/bash
```

We may want to set up some password conditions to help keep the new user account secure.
To do that, we can modify the minimum days before the password can be changed, the maximum days before the password expires,
the number of days before the user gets a warning to change their password, and the number of days of inactivity when the password is locked.
The `passwd` command can set some of these parameters, but the `chage` command is a bit more powerful:

```
sudo chage -m 7 -M 90 -W 14 -I 14 linus
```

See `man chage` for details, but:

- `-m 7` sets the minimum password age to 7 days before the user can change their password.
- `-M 90` sets the maximum age of the password to 90 days.
- `-W 14` provides a 14 day warning to the user that the password will expire.
- `-I 14` locks the account after 14 days of inactivity.

You can see these values by grepping the shadow file:

```
sudo grep "linus" /etc/shadow
```

To log in as the new user, use the ``su`` command and enter the password you used when creating the account:

```
su linus
```

To exit the new user's account, use the ``exit`` command:

```
exit
```

As a sysadmin, you will want to regularly review and audit the `/etc/passwd` and the `/etc/shadow` files to ensure only
authorized users have access to the system.

Before proceeding, repeat the above process for a user named **sean**, or use a different username and adjust as necessary as you proceed.

## Authorization

Let's say we've created our users and now we want to give them access to some additional resources.
For example, we can set up a shared directory on the system that multiple users can access and use.
To do that, we will begin to work with groups and file/directory permissions.

### Add users to a new group

Because of the default configuration defined in **/etc/adduser.conf**, the **linus** user only belongs to a group of the same name.
Let's create a new group that both **linus** and **sean** belong to.
We'll call this **developers**.
Then we'll add both **sean** and **linus** to that group.
For that, we'll use the `gpasswd -a` command and option.
We'll also make the user **sean** the group administrator using the `-A` option (see `man gpasswd` for more details).

```
sudo groupadd developers
sudo gpasswd -a sean developers
sudo gpasswd -a linus developers
sudo gpasswd -A sean developers
grep "developers" /etc/group
```

> Note: if a user is logged in when you add them to a group,
> they need to logout and log back in before the group membership goes into effect.
> Also, unlike some command options, we can't stack the following the `-aA` options with `gpasswd`.
> I.e., they have to be run separately.

### Create a shared directory

One of the benefits of group membership is that members can work in a shared directory.

Let's make the `/srv/developers` a shared directory.
The `/srv` directory already exists, so we only need to create the `developers` subdirectory:

```
sudo mkdir /srv/developers
```

Now we change ownership of the directory so that it's group owned by the `developers` group that we created:

```
sudo chgrp developers /srv/developers
```

The directory ownership should now reflect that it's owned by the `developers` group:

```
ls -ld /srv/developers
```

The default permissions are currently set to `0755`.
To allow group members to read and write to the above directory, we need to use the `chmod` command in a way we haven't yet.
Specifically, we add a leading `2` that sets the group identity.
The `770` indicates that the user and group owners of the directory (but not **others**)
have read, write, and execute permissions for the directory:

```
sudo chmod 2770 /srv/developers
```

This first digit, the `2` above, is the `setgid` (set group ID) bit.
Setting this ensures that any files or subdirectories created within `/srv/developers`
inherit the group ownership of the parent directory.
In this case, that's the `developers` group.
This is useful for group collaboration.
By setting this, either `linus` or `sean` can add, modify, and delete files in the `/srv/developers` directory.

### User account and group deletion

You can keep the additional user and group on your system, but know that you can also remove them.
The `deluser` and `delgroup` commands offer great options and may be preferable to the others utilities
(see `man deluser` or `man delgroup`).

If we want to delete the new user's account and the new group, these are the commands to use.
The first command will create an archival backup of **linus**' home directory and remove the home directory and any files in it.

```
deluser --backup --remove-home linus
```

The following command will delete the developers group:

```
delgroup developers
```

## Conclusion

Knowing how to manage user accounts and manage passwords are key sysadmin skills.
They are needed to provide collaborative environments and
to keep our systems secure through **authentication** and **authorization**.
While the methods to manage these things vary by operating system, the basic concepts are the same across OSes and services.

Although the basic concepts hold true across systems, things get a bit more complex for enterprise systems. 
On enterprise systems running Windows, [Active Directory (AD)][winad] is used for both **authentication** and **authorization**.
On enterprise systems running Linux,
the [Lightweight Directory Access Protocol (LDAP)][ldap] system is used to store and manage user credentials.
**LDAP** can be integrated with **AD** to enable Linux systems to use **AD** for centralized user management. 
Other technologies exist that facilitate user and resource management.
They include:

- [Kerberos][kerberos]
- [PAM (Pluggable Authentication Module][pam]
- [SSSD (System Security Services Daemon)][sssd]

In this section, we learned about important user management files like
`/etc/passwd`, `/etc/shadow`, `/etc/group`, `/etc/skel`, and `/etc/adduser.conf`.
We continued to use `nano` (or your preferred editor) to edit new configuration files,
specifically `/etc/skel` and `/etc/adduser.conf`.
We dove deeper into exploring how the `man` pages work.
We also learned how to create new Linux user accounts, modify those accounts password parameters,
assign those accounts to groups, and create a share directory for those accounts for collaboration.

We covered the following new commands:

- `adduser`: add a user or group to the system
- `chage`: change user password expiry information
- `chfn`: change real user name and information
- `chgrp`: change group ownership
- `delgroup`: remove a user or group from the system
- `deluser`: remove a user or group from the system
- `gpasswd`: administer `/etc/group` and `/etc/gshadow`
- `groupadd`: create a new group
- `passwd`: the password file
- `su`: run a command with substitute user and group ID

[hashedSalted]:https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/
[kerberos]:https://en.wikipedia.org/wiki/Kerberos_(protocol)
[ldap]:https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol
[pam]:https://en.wikipedia.org/wiki/Pluggable_authentication_module
[sssd]:https://en.wikipedia.org/wiki/System_Security_Services_Daemon
[winad]:https://en.wikipedia.org/wiki/Active_Directory
[zsh]:https://www.zsh.org/
