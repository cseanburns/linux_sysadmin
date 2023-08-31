# File Attributes

## Identifying Ownership and Permissions

In the last section, we saw that the output of the ``ls -l`` command
included a lot extra information besides a listing of file names.
The output also listed the owners and permissions for each file and directory.

Each user account on a Linux system
(like many operating systems)
has a user name and has at least one group membership, and
that name and that group membership
determine the user and group ownership
for all files created under that account.

In order to allow or restrict access to files and directories
(for example,
to allow other users to read, write to, or run your or others' files),
ownership and permissions are set in order to manage that kind 
of access to those files and directories.
There are thus two owners for every file (and directory):

- user owner
- group owner

And there are three permission *modes* that restrict or expand
access to each file (or directory) based on user or group membership:

- (r)ead
- (w)rite
- e(x)ecute (as in a program)

> I am emphasizing the **rwx** in the above list of modes because
> we will need to remember what these letters stand for when
> we work with file and directory permissions.

Consider the output of ``ls -l`` in some **public_html** directory
that contains a single file called **index.html**:

```
-rw-rw-r-- 1 sean sean 11251 Jun 20 14:41 index.html
```

According to the above output,
we can parse the following information about the file:

| Attributes             | ``ls -l`` output   |
| ------------           | ------------------ |
| File permissions       | ``-rw-rw-r--``     |
| Number of links        | 1                  |
| Owner name             | sean               |
| Group name             | sean               |
| Byte size              | 11251              |
| Last modification date | Jun 20 14:41       |
| File name              | index.html         |

What's important for us right now are the **File permissions** row,
the **Owner name** row,
and the **Group name** row.

The Owner and Group names of the **index.html** file are **sean** because
there is a user account named **sean** on the system and
a group account named **sean** on the system, and
that file exists in the user **sean**'s home directory.

The **File permissions** row shows:

```
-rw-rw-r--
```

Let's ignore the first dash for now.
The remaining permissions can be broken down as:

- rw- (read and write only permissions for the Owner)
- rw- (read and write only permissions for the Group)
- r-- (read-only permissions for the other, or World)

We read the output as such
(dashes, other than the initial one, signify no permissions):

- User **sean** is the Owner and has (r)ead and (w)rite permissions on the file
  but not e(x)ecute permissions (``rw-``).
- Group **sean** is the Group owner and has (r)ead and (w)rite permissions on
  the file but not e(x)ecute permissions (``rw-``).
- The **Other/World** can (r)ead the file but cannot (w)rite to the file nor
  e(x)ecute the file (`r--`).

> The word **write** is a classical computing term
> that means, essentially, to edit and save edits of a file.
> Today we use the term **save** instead of **write**,
> but remember that they are basically equivalent terms.

Since this is an HTML page for a website,
the **Other/World** ownership allows people to view (read) the file but not write
(save) to it nor execute (run) it.
Any webpage you view on the internet at least has Other/World mode set to read.

Let's take a look at another file.
In our ``/bin`` directory, we can see a listing for this program
(note that I specify the absolute path of the file named **bin**):

```
ls -l /bin/zip
-rwxr-xr-x 1 root   root    212K Feb  2  2021  zip*
```

| Attributes             | ``ls -l`` output   |
| ------------           | ------------------ |
| File permissions       | ``-rwxr-xr-x``     |
| Number of links        | 1                  |
| Owner name             | root               |
| Group name             | root               |
| Byte size              | 212K               |
| Last modification date | Feb  2 2021        |
| File name              | zip*               |

Since ``zip`` is a computer program used to package and compress files,
it needs to be e(x)ecutable.
That is, users on the system need to be able to run it.
But notice that the owner and group names of the file point to the user **root**.
We have already learned that there is a **root** level in our filesystem.
This is the top level directory in our filesystem and is referenced
by the forward slash: ``/``.
But there is also a **root** user account.
This is the system's **superuser**.
The **superuser** can run or access anything on the system, and
this user also owns most of the system files.

We read the output as such:

- User **root** is the Owner and has (r)ead, (w)rite, and e(x)ecute (``rwx``) permissions on the file.
- Group **root** is the Group owner and has (r)ead and e(x)ecute permissions
  but not (w)rite permissions (``r-x``)
- The **Other/World** has (r)ead and e(x)ecute permissions but not (w)rite (``r-x``). This
  permissions allows other users (like you and me) to use the ``zip``
  program.

> The asterisk at the end of the file name (``zip*``) simply indicates that
> this file is an executable;
> i.e., it is a software program that you can run.

Finally, let's take a look at the permissions for a directory.
On my system, I run the following command in my home directory,
which will show the permissions for my ``/home/sean`` directory:

```
ls -ld
```

And the output is:

```
drwx--x--- 51 sean sean 4.0K Jun 23 18:35 ./
```

This shows that:

| Attributes             | ``ls -ld`` output  |
| ------------           | ------------------ |
| File permissions       | ``drwx--x---``     |
| Number of links        | 1                  |
| Owner name             | sean               |
| Group name             | sean               |
| Byte size              | 4.0K               |
| Last modification date | Jun 23             |
| File name              | ./                 |

This is a little different from the previous examples, but let's parse it:

- Instead of an initial dash, this *file* has an initial **d** that identifies this
    as a directory. Directories in Linux are simply special types of files.
- User **sean** has read, write, and execute (``rwx``) permissions.
- Group **sean** has execute (``--x``) permissions only.
- The **Other/World** has no permissions (``---``).
- **./** signifies the current directory, which happens to be my home
  directory, since I ran that command at the ``/home/sean`` path.

The takeaway from this set of permissions and the ownership is that only the
user **sean** and those in the group **sean**, which is just the user **sean**,
can access this home directory.

We might ask why the directory has an e(x)ecutable bit set
for the owner and the group if
a directory is not an executable file.
That is, it's not a program or software.
This is so that the owner and the group can access that directory
using, for example, the ``cd`` (change directory) command.
If the directory was not executable,
like it's not for the **Other/World** (``---``),
then it would not be accessible
with the ``cd`` command,
or any other command.
In this case, the **Other/World**
(users who are not me)
cannot access my home directory.

## Changing File Permissions and Ownership 

### Changing File Permissions

All the files and directories on a Linux system
have default ownership and permissions set.
This includes new files that we might create as
we use our systems.
There will be times when we will want to change the defaults,
for example, the kinds of defaults described above.
There are several commands available to do that,
and here I'll introduce you to the two most common ones.

1. The ``chmod`` command is used to change file (and directory) permissions
   (or file mode bits).
1. The ``chown`` command is used to change a file's (and directory's) owner and
   group.

The ``chmod`` command changes the ``-rwxrwxrwx`` part of a file's attributes
that we see with the ``ls -l`` command.
Each one of those bits (the ``r``, the ``w``, and the ``x``)
are assigned the following [octal][changingFilePermissions] values:

| permission   | description    | octal value   |
| ------------ | --             | ------------- |
| r            | read           | 4             |
| w            | write          | 2             |
| x            | execute        | 1             |
| -            | no permissions | 0             |

There are three octal values for the three set of permissions
represented by ``-rwxrwxrwx``.
If I bracket the sets (for demonstration purposes only),
they look like this:

```
-[rwx][rwx][rwx]
```

The first set describes the permissions for the owner.
The second set describes the permissions for the group.
The third set describes the permissions for the Other/World. 

We use the ``chmod`` command and the octal values to change
a file or directory's permissions.
For each set, we add up the octal values.
For example, to make a file read (4), write (2), and executable (1)
for the owner only,
and zero out the permissions for the group and Other/World,
we use the ``chmod`` command like so:

```
chmod 700 paper.txt
```

We use 7 because ``4+2+1=7``, and
we use two zeroes in the second two places
since we're removing permissions for group and Other/World.

If we want to make the file read, write, and executable by
the owner, the group, and the world, then we repeat this for each set:

```
chmod 777 paper.txt
```

More commonly, we might want to restrict ownership.
Here we enable ``rw-`` for the owner,
and ``r--`` for the group and the Other/World:

```
chmod 644 paper.txt
```

Because ``4+2=6`` for owner,
and ``4`` is read only for group and Other/World, respectively.

### Changing File Ownership

In order to change the ownership of a file,
we use the ``chown`` command followed by
the name of the owner.
We can optionally change the owner of the group by adding a colon (no spaces)
and the name of the group.

We can see what groups we belong to with the ``groups`` command.
On one system that I have an account on, I am a member of two groups:
a group **sean** (same as my user name on this system),
and a group **sudo**,
which signifies that I'm an administrator on this system
(more on ``sudo`` later in the semester).

```
groups
sean sudo 
```

We can only change the user and group ownership of a file or directory
if we have administrative privileges (``sudo`` administrative access),
or if we share group membership.
This means that,
unless we have ``sudo`` (admin) privileges,
we often might change the group name for a file or directory
than the user owner.
Later in the semester,
you will have to do this kind of work (change user and group names)
of files and directories.
In the meantime, let's see some examples:

Imagine that my Linux user account belongs to the group **sisFaculty**, and
that there are other users on the Linux system (my colleagues at work)
who are also members of this group.
If I want to make a directory or file accessible to them,
then I can change the group name of a file I own to **sisFaculty**.
Let's call that file **testFile.txt**.
To change only the group name for the file:

```
chown :sisFaculty testFile.txt
```

I can generally only change the user owner of a file if I have admin
access on a system.
In such a case,
I might have to use the ``sudo`` command
(you do not have access to the ``sudo`` command
on our shared server, 
but you will have it later on your virtual machines).
In this case, I don't need the colon.
To change the owner only,
say from the user **sean** to the user **tmk**:

```
sudo chown tmk testFile.txt
```

To change both user owner and group name,
we simply specify both names
and separate those names by a colon,
where the syntax is ```chown USER:GROUP testFile.txt```

```
sudo chown tmk:sisFaculty testFile.txt
```

After using the ``chown`` command to change 
either the owner or group,
we should double check the file or directory's permissions
using the ``chmod`` command.
Here I make it so that the user owner and the group **sisFaculty** has
(r)ead and (w)rite access to the file.
I use ``sudo`` because,
as the user **sean**,
I'm changing the file permissions for a file
that I do not own:

```
sudo chmod 660 testFile.txt
```

## Conclusion

In this section, we learned:

- how to identify file/directory ownership and permissions
- and how to change file/directory ownership and permissions.

Specifically, we looked at two ways to change the attributes of a file.
This includes changing the ownership of a file
with the ``chown`` command, and
setting the read, write, and execute
permissions of a file with the ``chmod``
command.

The commands we used to change these attributes include:

- ``chmod`` : for changing file permissions (or file mode bits)
- ``chown`` : for changing file ownership

We also used the following commands:

- ``ls``         : list directory contents
    - ``ls -ld`` : long list directories themselves, not their contents
- ``groups``     : print the groups a user is in
- ``sudo``       : execute a command as another user

[changingFilePermissions]:https://docs.oracle.com/cd/E19504-01/802-5750/6i9g464pv/index.html
