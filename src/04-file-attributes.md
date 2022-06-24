# File Attributes

## Identifying Ownership and Permissions

In the last section, we saw that the output of the ``ls -l`` command
included a lot extra information besides a listing of file names.
The output also listed the owners and permissions for each file and directory.
Ownership and permissions are set in order to manage some level
of access to those files.
There are two owners for every file (and directory):

- user owner
- group owner

And there are three permission *modes* that restrict or expand
access to each file (or directory):

- (r)ead
- (w)rite
- e(x)ecute (as in a program)

Consider the output of ``ls -l`` in some **public_html** directory
that contains a single file called *index.html*:

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
a group account named **sean** on the system.

The **File permissions** row shows:

```
-rw-rw-r--
```

Let's ignore the first dash for now.
The remaining permissions can be broken down as:

- rw- (for the Owner)
- rw- (for the Group)
- r-- (for the World)

We read the output as such (dashes signify no permissions):

- User **sean** is the Owner and has (r)ead and (w)rite permissions on the file
  but not e(x)ecute permissions (``rw-``).
- Group **sean** is the Group owner and has (r)ead and (w)rite permissions on
  the file but not e(x)ecute permissions (``rw-``).
- The **World** can (r)ead the file but cannot (w)rite to the file nor
  e(x)exute the file (`r--`).

> The word **write** is a classical computing term,
> that means, essentially, to edit and save edits of a file.
> Today we usually use the term **save**. 

Since this is an HTML page for a website,
the **World** ownership allows people to view (read) the file but not write
(save) to it nor execute (run) it. 

Let's take a look at another file.
In our ``/bin`` directory, we can see a listing for this program:

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
This is the top level directory in our filesytem and is referenced
by the forward slash: ``/``.
But there is also a **root** user account.
This is the system's **superuser**.
The **superuser** can run or access anything on the system, and
this user also owns most of the system files.

We read the output as such:

- User **root** is the Owner and has (r)ead, (w)rite, and e(x)ecute (``rwx``) permissions on the file.
- Group **root** is the Group owner and has (r)ead and e(x)ecute permissions
  but not (w)rite permissions (``r-x``)
- The **World** has (r)ead and e(x)ecute permissions but not (w)rite (``r-x``). This
  permissions allows other users (like you and me) to use the ``zip``
  program.

> The asterisk at the end of the file name (``zip*``) simply indicates that
> this file is an executable.

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

- The initial **d** identifies this as a directory. Directories in Linux are
    simply special types of files.
- User **sean** has read, write, and execute (``rwx``) permissions.
- Group **sean** has execute (``--x``) permissions only.
- The **World** has no permissions (``---``).
- **./** signifies the current directory, which happens to be my home
  directory, since I ran that command at the ``/home/sean`` path.

We might ask why the directory has an e(x)ecutable bit set
for the owner and the group if
a directory is not an executable file.
That is, it's not a program or software.
This is so that the owner and the group can access that directory
using, for example, the ``cd`` (change directory) command.
If the directory was not executable,
like it's not for the **World** (``---``),
then it would not be accessible.
In this case, the **World**
(users who are not me)
cannot access my home directory.

## Changing File Permissions and Ownership 

### Changing File Permissions

All the files and directories a Linux system
have default ownership and permissions set.
This includes new files that we might create as
we use our systems.
There will be times when we will want to change the defaults,
for example, the kinds of defaults described above.
There are several commands available to do that,
and here I'll introduce you to the two most common ones.

1. The ``chmod`` command is used to change file (and directories) permissions
   (or file mode bits).
1. The ``chown`` command is used to change a file's (and directory's) owner and
   group.

The ``chmod`` command changes the ``-rwxrwxrwx`` part of a file's attributres.
Each one of those bits (the ``r``, the ``w``, and the ``x``)
are assigned the following [octal][changingFilePermissions] values:

| permission   | description    | octal value   |
| ------------ | --             | ------------- |
| r            | read           | 4             |
| w            | write          | 2             |
| x            | execute        | 1             |
| -            | no permissions | 0             |

There are three octals for the three set of permissions
represeted by ``-rwxrwxrwx``.
If I bracket the sets (for demonstration purposes only),
they look like this:

```
-[rwx][rwx][rwx]
```

The first set describes the permissions for the owner.
The second set describes the permissions for the group.
The third set descreibes the permissions for the World. 

We use the ``chmod`` command and the octal values to change
a file or directory's permissions.
For each set, we add up the octal values.
For example, to make a file read (4), write (2), and executable (1)
for the owner only,
and zero out the permissions for the group and World,
then we use the ``chmod`` command like so:

```
chmod 700 paper.txt
```

Because ``4+2+1=7``, and
zero in the second two places since we're removing
permissions for group and World.

If we want to make the file read, write, and executable by
the owner, the group, and the world, then we repeat this for each set:

```
chmod 777 paper.txt
```

More commonly, we might want to restrict ownership.
Here we enable ``rw-`` for the owner,
and ``r--`` for the group and the World:

```
chmod 644 paper.txt
```

Becuase ``4+2=6`` for owner,
and ``4`` is read only for group and World, respectively.

### Changing File Ownership

Let's change the ownership of a file so that it's owned by a group we're in:

```
chown sean:sis_fac_staff file.sh

# Let's make it read only for the group:
chmod g-wx+r file.sh
```

## Conclusion

In this demo, we looked at two ways to change the attributes of a file. This includes changing the ownership of a file and the read, write, and execute permissions of a file.

The commands we used to change these attributes include:

- ``chmod`` : for changing file permissions (or file mode bits)
- ``chown`` : for changing file ownwership

[changingFilePermissions]:https://docs.oracle.com/cd/E19504-01/802-5750/6i9g464pv/index.html
