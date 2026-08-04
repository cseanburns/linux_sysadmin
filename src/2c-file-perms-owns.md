# File Permissions and Ownership

In this section, we will cover:

1. **Identifying Ownership and Permissions**:
   - Overview of file ownership (user and group ownership).
   - Understanding file permissions (read, write, execute).
   - Using `ls -l` to view ownership and permissions.
   - Explanation of how to interpret the output of `ls -l`.

2. **Changing File Permissions**:
   - Using `chmod` to change file permissions.
   - Explanation of octal values for permissions (`rwx` and their octal equivalents).
   - Examples of setting permissions using `chmod` with octal notation (e.g., `chmod 700`, `chmod 644`).

3. **Changing File Ownership**:
   - Using `chown` to change file ownership (user and group).
   - Examples of changing user ownership and group ownership separately and together.
   - Usage of `sudo` to execute administrative commands when needed.

4. **Additional Commands**:
   - `ls -ld`: List directories and their attributes.
   - `groups`: Show group memberships for a user.
   - `sudo`: Run commands as another user with elevated privileges.

## Identifying Permissions and Ownership

In the last section, we saw that the output of the `ls -l` command included a lot extra information besides a listing of file names.
The output also listed the owners and permissions for each file and directory.

Each user account on a Linux system has a user name and has at least one group membership.
That name and that group membership determine the user and group ownership for all files created under that account.

In order to allow or restrict access to files and directories,
ownership and permissions are set in order to manage that kind of access to those files and directories.
There are thus two owners for every file and directory:

- user owner
- group owner

And there are three permission *modes* that restrict or expand access to each file (or directory) based on user or group membership:

- **r**ead
- **w**rite
- e**x**ecute

> I am emphasizing the **rwx** in the above list of modes because we will need to remember what these letters stand for when
> we work with file and directory permissions.

Consider the output of `ls -l` in my home directory that contains a file called **paper.txt**:

```
-rw-rw-r-- 1 seanburns seanburns 0 Sep  7 14:41 paper.txt
```

According to the above output, we can parse the following information about the file:

| Attributes             | `ls -l` output     |
| ------------           | ------------------ |
| File permissions       | `-rw-rw-r--`       |
| Number of links        | 1                  |
| Owner name             | seanburns          |
| Group name             | seanburns          |
| Byte size              | 0                  |
| Last modification date | Sep  7 14:41       |
| File name              | paper.txt          |

The Owner and Group names of the `paper.txt` file are both `seanburns` because
there is a user account named `seanburns` on the system and
a group account named `seanburns` on the system, and that file exists in the user `seanburns`'s home directory.
You can see which groups you belong to on your system with the `groups`.

The **File permissions** show:

```
-rw-rw-r--
```

Ignore the first dash for now.
The remaining permissions can be broken down into three parts:

- rw- (read and write only permissions for the Owner)
- rw- (read and write only permissions for the Group)
- r-- (read-only permissions for the other, or World)

We read the output as such:

- User **seanburns** is the Owner and has **r**ead and **w**rite permissions on the file but not e**x**ecute permissions (``rw-``).
- Group **seanburns** is the Group owner and has **r**ead and **w**rite permissions on the file but not e**x**ecute permissions (``rw-``).
- The **Other/World** can **r**ead the file but cannot **w**rite to the file nor e**x**ecute the file (`r--`).

> The word **write** is a classical computing term that means, essentially, to edit and save edits of a file.
> Today we use the term **save** instead of **write**, but remember that they are basically equivalent terms.

The **Other/World** ownership allows people to view (read) the file but not write (save) to it nor execute (run) it.
Any webpage you view on the internet at least has Other/World mode set to read.

Let's take a look at another file.
In our `/bin` directory, we can see a listing of executable programs on the system.
For example, take a look at the `scp` (secure copy) program as follows:

```
ls -l /bin/scp
-rwxr-xr-x 1 root   root    133720 Apr  11 /bin/scp*
```

| Attributes             | `ls -l` output     |
| ------------           | ------------------ |
| File permissions       | `-rwxr-xr-x`       |
| Number of links        | 1                  |
| Owner name             | root               |
| Group name             | root               |
| Byte size              | 133720             |
| Last modification date | Apr 11 2025        |
| File name              | /bin/scp           |

Since `scp` is a computer program used to securely copy files between different machines, it needs to be e**x**ecutable.
That is, users on the system need to be able to run it.
But notice that the owner and group names of the file point to the user `root`.
We have already learned that there is a `root` directory in our filesystem.
This is the top level directory in our filesystem and is referenced by the forward slash: `/`.
But there is also a `root` user account.
This is the system's **superuser**.
The **superuser** can run or access anything on the system, and this user also owns most of the system files.

Back to permissions. We read the output of the `ls -l /bin/scp` command as such:

- User **root** is the Owner and has **r**ead, **w**rite, and e**x**ecute (``rwx``) permissions on the file.
- Group **root** is the Group owner and has **r**ead and e**x**ecute permissions but not **w**rite permissions (`r-x`)
- The **Other/World** has **r**ead and e**x**ecute permissions but not **w**rite (`r-x`).
  This permissions allows other users (like you and me) to use the `scp` program.

Finally, let's take a look at the permissions for a directory itself.
When I run the following command in my home directory, it will show the permissions for my `/home/seanburns` directory:

```
ls -ld
```

And the output is:

```
drwxr-x--- 4 seanburns seanburns 4096 Sep  2 19:07 .
```

This shows that:

| Attributes             | `ls -ld` output    |
| ------------           | ------------------ |
| File permissions       | `drwxr-x---`       |
| Number of links        | 4                  |
| Owner name             | seanburns          |
| Group name             | seanburns          |
| Byte size              | 4096               |
| Last modification date | Sep  2             |
| File name              | .                  |

This is a little different from the previous examples, but let's parse it:

- Instead of an initial dash, this *file* has an initial **d** that identifies this as a directory.
  Directories in Linux are simply special types of files.
- User `seanburns` has read, write, and execute (`rwx`) permissions.
- Group `seanburns` have execute (`r-x`) read and execute permissions.
- `Other/World` have no permisisons on this directory.
- `.` signifies the current directory, which happens to be my home directory, since I ran that command at the `/home/seanburns` path.

Why does the directory have an e**x**ecutable bit set since it's not a program?
The executable bit is required on directories to access them.
That is, if we want to `cd` into a directory, then the executable bit needs to be set on the directory.

## Changing File Permissions and Ownership 

### Changing File Permissions

All the files and directories on a Linux system have default ownership and permissions set.
This includes new files that we might create as we use our systems.
There will be times when we will want to change the defaults.
For example, if I were to create accounts for other people for this system, I might want to disallow them access to my home directory.
There are several commands available to do that, and here I'll introduce you to the two most common ones.

1. The `chmod` command is used to change file and directory permissions: the `-rwxrwxrwx` part of a file.
2. The `chown` command is used to change a file's and directory's owner and group.

#### `chmod`

Each one of those bits (the `r`, the `w`, and the `x`) are assigned the following [octal][changing_file_permissions] values:

| permission   | description    | octal value   |
| ------------ | --             | ------------- |
| r            | read           | 4             |
| w            | write          | 2             |
| x            | execute        | 1             |
| -            | no permissions | 0             |

There are octal values for the three set of permissions represented by `-rwxrwxrwx`.
If I bracket the sets (for demonstration purposes only), they look like this:

| Owner | Group | Other/World |
| ----- | ----- | ----------- |
| rwx-  | rwx-  | rwx-        |
| 4210  | 4210  | 4210        |

The first set describes the permissions for the owner.
The second set describes the permissions for the group.
The third set describes the permissions for the Other/World. 

We use the `chmod` command and the octal values to change a file or directory's permissions.
For each set, we add up the octal values.
For example, to make a file read (4), write (2), and executable (1) for the owner only, and
zero out the permissions for the group and Other/World, we use the `chmod` command like so:

```
chmod 700 paper.txt
```

We use 7 because `4+2+1=7`, and we use two zeroes in the second two places since we're removing permissions for group and Other/World.

If we want to make the file read, write, and executable by the owner, the group, and the world, then we repeat this for each set:

```
chmod 777 paper.txt
```

More commonly, we might want to restrict ownership.
Here we enable `rw-` for the owner, and `r--` for the group and the Other/World:

```
chmod 644 paper.txt
```

Because `4+2=6` for owner, and `4` is read only for group and Other/World, respectively.

### Changing File Ownership

#### `chown`

In order to change the ownership of a file, we use the `chown` command followed by the name of the owner.

I can generally only change the user owner of a file if I have admin access on a system.
In such a case, I would have to use the `sudo` command, which gives me superuser privileges.
To change the owner only, say from the user `seanburns` to the user `root`:

```
sudo chown root paper.txt
```

In the following example, I make the `root` user the group owner of my `paper.txt` file.
Note that I include a colon before the name `root`.
This signifies changing group membership only.

```
sudo chown :root paper.txt
```

> Look at the output as you go using the `ls -l` command.

To change both user owner and group owner, we simply specify both names and separate those names by a colon.
Thus, since `paper.txt` now has `root` as the user owner and `root` as the group owner,
I revert ownership back to me for both user and group:

```
sudo chown sean:sean paper.txt
```

## Conclusion

In this section, we learned:

- how to identify file/directory ownership and permissions
- and how to change file/directory ownership and permissions.

The commands we used to change these include:

- `chmod` : for changing file permissions (or file mode bits)
- `chown` : for changing file ownership

We also used the following commands:

- `ls`         : list directory contents
    - `ls -ld` : long list directories themselves, not their contents
- `groups`     : print the groups a user is in
- `sudo`       : execute a command as another user

[changing_file_permissions]:https://docs.oracle.com/cd/E19504-01/802-5750/6i9g464pv/index.html
[system_groups]:https://wiki.debian.org/SystemGroups
