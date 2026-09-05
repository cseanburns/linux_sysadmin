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
-rw-rw---- 1 sean sean 0 Sep  9 00:45 paper.txt
```

According to the above output, we can parse the following information about the file:

| Attributes             | `ls -l` output     |
| ------------           | ------------------ |
| File permissions       | `-rw-rw----`       |
| Number of links        | 1                  |
| Owner name             | sean          |
| Group name             | sean          |
| Byte size              | 0                  |
| Last modification date | Sep  9 00:45       |
| File name              | paper.txt          |

The Owner and Group names of the `paper.txt` file are both `sean` because there is a user account named `sean` on the system and a group account named `sean` on the system, and
that file exists in the user `sean`'s home directory.
You can see which [groups][system_groups] you belong to on your system with the `groups`.

```
groups
```

Or another user (if you're not me):

```
groups sean
```

The **File permissions** show:

```
-rw-rw----
```

Ignoring the first dash for now, the remaining permissions can be broken down into three parts:

- rw- (read and write only permissions for the Owner but no execute permissions)
- rw- (read and write only permissions for the Group but no execute permissions)
- --- (no read, write, or execute permissions for the other, or World)

We read the output as such:

- User **sean** is the Owner and has **r**ead and **w**rite permissions on the file but not e**x**ecute permissions (``rw-``).
- Group **sean** is the Group owner and has **r**ead and **w**rite permissions on the file but not e**x**ecute permissions (``rw-``).
- The **Other/World** cannot **r**ead, **w**rite, or e**x**ecute the file (`---`).

We can alternatively write that as:

| owner | group | other |
|-------|-------|-------|
| rw-   | rw-   | ---   |

> The word **write** is a classical computing term that means, essentially, to edit and save edits of a file.
> Today we use the term **save** instead of **write**, but remember that they are basically equivalent terms.

The **Other/World** ownership allows people to either view (read), write (save, or execute the file, if it's a program or script), depending on the permissions.
Any webpage you view on the internet at least has Other/World mode set to read.

Let's take a look at another file.
In our `/usr/bin` directory, we can see a listing of executable programs on the system.
For example, take a look at the `cat` (concatenate) program as follows:

```
ls -l /usr/bin/cat
-rwxr-xr-x 1 root   root    39384 Aug  25 15:09 /usr/bin/cat
```

| Attributes             | `ls -l` output     |
| ------------           | ------------------ |
| File permissions       | `-rwxr-xr-x`       |
| Number of links        | 1                  |
| Owner name             | root               |
| Group name             | root               |
| Byte size              | 39384              |
| Last modification date | Aug 25 2026        |
| File name              | /usr/bin/cat       |

And the permissions are:

| owner | group | other |
|-------|-------|-------|
| rwx   | r-x   | r-x   |

Since `cat` is a computer program, it needs to be e**x**ecutable.
That is, users on the system need to be able to run it.
But notice that the owner and group names of the file point to the user `root`.
We have already learned that there is a `root` directory in our filesystem.
This is the top level directory in our filesystem and is referenced by the forward slash: `/`.
But there is also a `root` user account.
This is the system's **superuser**.
The **superuser** can run or access anything on the system, and this user also owns most of the system files.

Back to permissions. We read the output of the `ls -l /usr/bin/cat` command as such:

- User **root** is the Owner and has **r**ead, **w**rite, and e**x**ecute (``rwx``) permissions on the file.
- Group **root** is the Group owner and has **r**ead and e**x**ecute permissions but not **w**rite permissions (`r-x`)
- The **Other/World** has **r**ead and e**x**ecute permissions but not **w**rite (`r-x`).
  This permissions allows other users (like you and me) to use the `scp` program.

Finally, let's take a look at the permissions for a directory itself.
When I run the following command in my home directory, it will show the permissions for my `/home/sean` directory:

```
ls -ld
```

And the output is:

```
drwxr-x--- 4 sean sean 4096 Sep  5 00:45 .
```

This shows that:

| Attributes             | `ls -ld` output    |
| ------------           | ------------------ |
| File permissions       | `drwxr-x---`       |
| Number of links        | 4                  |
| Owner name             | sean          |
| Group name             | sean          |
| Byte size              | 4096               |
| Last modification date | Sep  5             |
| File name              | .                  |

This is a little different from the previous examples, but let's parse it:

- Instead of an initial dash, this *file* has an initial **d** that identifies this as a directory.
  Directories in Linux are simply special types of files.
- User `sean` has read, write, and execute (`rwx`) permissions.
- Group `sean` has read and execute (`r-x`) permissions.
- `Other/World` have no permisisons on this directory.
- `.` signifies the current directory. In this case, this happens to be the **relative path** to my home directory from my home directory, since I ran that command from my home directory (`/home/sean`).

Why does the directory have an e**x**ecutable bit set since it's not a program?
The executable bit is required on directories to access them.
That is, if we want to `cd` into a directory, then the executable bit needs to be set on the directory.

If a directory has the following permissions, then it can't be accessed with the `cd` command: `rw-rw-rw-`

## Changing File Permissions and Ownership 

### Changing File Permissions

All the files and directories on a Linux system have default ownership and permissions set.
This includes new files that we might create as we use our systems.
There will be times when we will want to change the defaults.
For example, if I were to create accounts for other people for this system, I might want to disallow them access to my home directory.
There are several commands available to do that, and here I'll introduce you to the two most common ones.

1. The `chmod` command is used to change file and directory permissions: the `-rwxrwxrwx` part of a file's listing.
2. The `chown` command is used to change a file's and directory's owner and group: the `sean sean` or `root root` part of a file's listing.

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

In order to change the ownership of a file, we use the `chown` command followed by the name of the owner and/or the group owner.

I can generally only change the user owner of some else's file if I have admin access on a system.
In such a case, I would have to use the `sudo` command, which gives me superuser privileges, or login as the `root` user.
To change the owner only, say from the user `sean` to the user `root`:

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

## Execute Permissions

Sometimes we want to write scripts to automate some process.
For example, let's say that when I login to the remote server, I want to run the following commands:

```
echo "Greetings $USER. I hope you are doing well today."

echo "Today is $(date)."

echo "Currently, the following people are logged into the system:" ; who

echo "You belong to the following groups:" ; groups
```

I could type those commands out, which would be quickly cumbersome, or I can add them to a file, and make the file executable.

Let's say I add them to a file named `greeting`.
To make the file act like a program, I make it executable for the user:

```
chmod 700 greeting
```

Then to run it, I can type:

```
./greeting
```

### Execute PATHS

In the above `greeting` command, I had to type a `./` before the file name to run it.
This is because the Bash shell only runs commands that are in specific paths.
To see the default paths, run the following command:

```
echo $PATH
```

The output should be:

```
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

This is a colon separated list of fields, which means that Bash looks in the following locations for programs:

- /usr/local/sbin
- /usr/local/bin
- /usr/sbin
- /usr/bin
- /sbin
- /bin
- /usr/games
- /usr/local/games
- /snap/bin

If we want to have our own personal `~/bin` directory for private executables, we can simply create that directory:

```
mkdir bin
```

After logging out and logging back in, we can run programs from within that directory without using `./`.
First we can test that our path has been updated after logging back in:

```
echo $PATH
/home/sean/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

Note that `/home/sean/bin` has been added to the list.

Then we can move the `greeting` file to our `~/bin` directory:

```
mv ~/greeting bin/
```

And run the command:

```
greeting
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

[changing_file_permissions]:https://docs.oracle.com/cd/E19504-01/802-5750/6i9g464pv/index.html
[system_groups]:https://wiki.debian.org/SystemGroups
