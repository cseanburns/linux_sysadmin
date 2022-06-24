# The Linux/Unix File System and File Types

In this demo, we will cover the:

- the Linux file system and how it is organized, and
- the basic commands to work with directories and files

> Directories and folders are often used interchangeably, but 
> as users of primarily graphical user interfaces,
> you are more likely familiar with the term **folders**.
> I will more often use the term **directories** 
> since that is the command line (text user interface) convention.
> I will use the term **folders** when referring to a graphical environment.

Throughout this demonstration,
I encourage you to ``ssh`` into our remote server
and follow along with the commands that I use.
See [Section 2.2](02-quick-ssh-connect.md)
for details on connecting to the remote server.

## Visualizing the Filesystem as a Tree

We will need to work within the filesystem
quite a lot in this course,
but the term **filesystem** may refer to different concepts,
and it's important to clear that up before we start.

In come cases, filesystem refers to how data is [stored and retrieved][filesystem]
on a device like a hard drive, USB drive, etc.
For example, macOS uses the [Apple File System (APFS)][apfs] by default,
and Windows uses the [New Technology File System (NTFS)][ntfs].
Linux and other unix-like operating systems use a variety of file systems, but
presently, the two major ones are **ext4** and **btrfs**.
The former is the default file system on distributions
like [Debian][debian] and [Ubuntu][ubuntu];
the latter is the default on the 
[Fedora][fedora] and [openSUSE][opensuse] distributions. 
[Opensource.com][ext4] has a nice overview of file systems under this concept,
and we will learn how to use some of them later in the semester
when we create partitions, manage disk volumes, and learn about backups.

The other way that the term **filesystem** might be used is to refer
to the directory structure of a system.
This concept is not always directly related to the prior concept of a file system.
For example, on Windows, the filesystem is identified by a letter, like the **C:** drive,
regardless if the disk has a NTFS file system or a FAT file system.
Additional drives (e.g., extra hard drives, USB drives, DVD drives, etc.),
will be assigned their own letters (**A:**, **B:**, **D:**, etc.).
macOS adheres to a root file system like Linux and other unix-like operating systems.
(This is because macOS is UNIX.)
In these operating systems, we have a top-level **root** directory
identified by a single forward slash  **/**,
and then subdirectories under that root directory.
Additional drives (e.g., extra hard drives, USB drives, DVD drives, etc.) are **mounted**
under that root hierarchy and not separately like on Windows.
[Linux.com][directories] provides a nice overview of the most common directory structure
that Linux distributions use along with an explanation for the major bottom level directories.

On Linux, we can visualize the filesystem with the ``tree`` command. 

- ``tree`` : list contents of directories in a tree-like format
    - ``tree -dfL 1`` : directories only, full path, one level

### The root Directory and its Base Level Directories

As explained on the Linux.com page, here are the major sub directories under **/** (root)
and a short description of their main purpose:

- ``/bin`` : binary files needed to use the system
- ``/boot``  : files needed to boot the system
- ``/dev`` : device files -- all hardware has a file
- ``/etc`` : system configuration files
- ``/home`` : user directories
- ``/lib`` : libraries/programs needed for other programs
- ``/media`` : external storage is mounted
- ``/mnt`` : other file systems may be mounted
- ``/opt`` : store software code to compile software
- ``/proc`` : files containing info about your computer
- ``/root`` : home directory of superuser
- ``/run`` : used by system processes
- ``/sbin`` : like ``/bin``, binary files that require superuser privileges
- ``/usr`` : user binaries, etc that might be installed by users
- ``/srv`` : contains data for servers
- ``/sys`` : contains info about devices
- ``/tmp`` : temp files used by applications
- ``/var`` : variable files, used often for system logs

Although there are 18 directories listed here
that **branch** off from the root directory,
there are some that we'll use much more often than others.
For example, since the **/etc** directory contains system configuration files,
we will use the contents of this directory,
along with the **/var** directory,
quite a bit when we set up our web servers, relational database servers,
and more later in the semester.
The **/home** directory is where our default home directories are stored,
and thus if you manage a multi-user system,
like I do for this class,
then this will be an important directory to manage. 

Source: [Linux Filesystem Explained][directories]

## Relative and Absolute Paths

macOS users have the Finder app to navigate their filesystem,
to move files to different folders, to copy files, to trash them, etc.
Window users have File Explorer for these functions.
Linux users have similar options,
but all of these functions can be completed on the Linux command line, too,
and generally more efficiently.
But to get started, it does take learning two things first:

1. how to specify the locations of files and directories in the filesystem 
2. the commands needed to work with the filesystem

To help specify the locations of files and directories,
there are two key concepts to know:

- absolute paths
- relative paths

In the prior section,
we learned about the **/** root directory and its subdirectories.
All sorts of commands,
especially those that deal with files and directories 
(like copying, moving, deleting),
require us to specify on the command line
the locations of the files and directories.
It's common to specify the location in two different ways,
by specifying their **absolute** path (or location) on the filesystem,
or the **relative** location.

To demonstrate, we might want to move around the filesystem.
When we first log in to our remote system,
our default location will be our home directory,
sometimes referred to as **$HOME**.
The path (location) to that directory will be: 

```
/home/USER/
```

Where **USER** is your username.
Therefore, since my username is **sean**,
my home directory is located at:

```
/home/sean/
```

> When I write **$HOME**,
> I am referring to a default, **environmental** variable
> that points to your home directory.
> It's **variable** because,
> depending on which account we're logged in as,
> **$HOME** will point to a different location.
> For me, then, that will be ``/home/sean/``,
> if I'm logged in as **sean**.
> For you it'll point to your home directory.

In my home directory,
I have a subdirectory called **public_html**.
The path to that is:

```
/home/sean/public_html/
```

In a program like Finder (macOS) or File Explorer (Windows),
if I want to change my location to that subdirectory,
then I'd double click on its folder icon.
On the command line, however, I have to write out the command
and the path to the subdirectory.
Therefore, **from my home directory**,
I use the following command to switch to the public_html subdirectory:

```
cd public_html
```

The above is an example of using a relative path, and
that command would only be successful if I were
first in my **$HOME** directory.
That's because I specified the location of **public_html**
relative to my default ($HOME) location.

I could have also specified the absolute location,
but this would be the wordier way.
Since the **public_html** directory is in my $HOME directory,
and my $HOME directory is in the **/home** directory,
then to specify the absolute path in the above command,
I'd do:

```
cd /home/sean/public_html
```

Again, the relative path specified above would only work if
I was in my home directory, because 
``cd public_html`` is relative to the location of ``/home/sean/``.
That is, the subdirectory **public_html** is in **/home/sean/**.
But specifying the absolute path would work no matter where
I was located in the filesystem.
For example, if I was working on a file in the ``/etc/apache2`` directory,
then using the absolute path (``cd /home/sean/public_html/``) would work.
But the relative path (``cd public_html``) command would not since
there is no subdirectory called **public_html**
in the ``/etc/apache2`` directory.

Understanding relative and absolute paths is
one of the more difficult concepts for new command line users to learn,
but after time, it'll feel natural.
So just keep practicing, and
I'll go over this throughout the semester.

## Basic Directory and File commands 

In order to explore the above directories
but also to create new ones and work with files,
we need to know some basic terminal commands.
A lot of these commands are part of the base system
called [GNU Coreutils][coreutils],
and in this demo,
we will specifically cover some of the following:

- [Directory Listing][directorylisting]
- [Basic Operations][basicops]
- [Special File Types][filetypes]
- [Printing Text][printing]

### Directory Listing

I have already demonstrated one command,
the ``cd`` (change directory) command.
This will be one of the most frequently used commands in your toolbox.

In our current directory, or
once we have changed to a new directory,
we will want to learn its contents
(what files and directories it contains).
We have a few commands to list contents,
but the most common command is the ``ls`` (list) command.
We use it by typing the following two letters in the terminal:

```
ls
```

Most commands can be combined with **options**.
Options provide additional functionality to the base command, and
in order to see what options are available for the ``ls`` command,
we use look at its **man(ual) page**:

```
man ls
```

From the ``ls`` **man page**,
we learn that we can use the ``-l`` option to format
the output of the ``ls`` command as a long-list,
or a list that provides more information about
the files and directories in the working directory.
Later in the semester,
I will talk more about what the other parts of output of this option mean.

```
ls -l
```

We can use the ``-a`` option to list hidden files.
In Linux, hidden files are hidden from the default ``ls`` command
if the files begin with a period.
We have a some of those files in our **$HOME** directories,
and we can see them like so:

```
ls -a
```

We can also combine options.
For example, to view all files,
including hidden ones,
in the long-list format,
we can use:

```
ls -al
```

## Basic File Operations

Some basic file operation commands include:

- ``cp`` for copying files and directories
- ``mv`` for moving (or renaming) files and directories
- ``rm`` for removing (or deleting) files and directories

These commands also have various options
that can be viewed in their respective **man pages**.
Command options provide additional functionality to the base command,
and are mostly (but not always) prepended with a dash and a letter or number.
To see examples, type the following commands,
which will launch the manual pages for them.
Press ``q`` to exit the manual pages,
and use your up and down arrow keys to scroll through the manuals:

```
man cp
man mv
man rm
```

Here are some ways to use these commands and their options:

### Copying Files and Directories

To copy an existing file to a new file:

```
cp file1.txt file2.txt
```

Use the ``-i`` option to copy that file in interactive mode;
that is, to prompt you before overwriting an existing file.

We also use the ``cp`` command to copy directories.

### Moving Files and Directories

The ``mv`` command will move an existing file to a different directory,
and/or rename the file.
For example, from within our home directory
(therefore, using relative path names),
to move a file named "file.docx" 
to a subdirectory named "Documents":

```
mv file.docx Documents/
```

To rename a file only (keeping it in the same directory),
the command looks like this:

```
mv file.docx newName.docx
```

To move the file to our Documents/ subdirectory and rename it,
then we'd do this:

```
mv file.docx Documents/newName.docx
```

The ``man`` page for the ``mv`` command also describes an ``-i`` option
for interactive mode that also helps prevent us from overwriting existing files.
For example, if we have a file called **paper.docx** in our **$HOME** directory,
and we have a file named **paper.docx** in our **$HOME/Documents** directory,
and if these are actually two different papers (or files),
then moving the file to that directory will overwrite it without asking.
The ``-i`` option will prompt us first:

```
mv -i paper.docx Documents/paper.docx
```

### Remove or Delete

Finally, to delete a file, we use the ``rm`` command:

```
rm file.html
```

## Special File Types

For now, let's only cover two commands here:

- ``mkdir`` for creating a new directory 
- ``rmdir`` for deleting a directory

Like the above commands,
these commands also have their own set of options
that can be viewed in their respective **man pages**:

```
man mkdir
man rmdir
```

### Make or Create a New Directory 

We use these commands like we do the ones above.
If we are in our **$HOME** directory and we want to create a new directory, we do:

```
mkdir bin 
```

> The **bin** directory in our **$HOME** directory is a default location
> to store our personal applications, or applications (programs) that
> are only available to us.

And if we run ``ls``, we can see that it was successful.

### Delete a Directory

The ``rmdir`` command is a bit weird because it only removes **empty** directories.
To remove the directory we just created, we use it like so:

```
rmdir bin 
```

However, if you want to remove a directory that contains files or other subdirectories,
then you will have to use the ``rm`` command along with the ``-r`` (recursive) option:

```
rm -r directory-with-content/
```

## Printing Text

There a number of ways to print text to **standard output**,
which is our screen by default in the terminal.
We could also redirect standard output to a file, to a printer, or to a remote shell.
We'll see examples like that later in the semester.
Here let's cover two commands:

- ``echo`` to print a line of text to standard output
- ``cat`` to concatenate and write files

> **Standard output** is by default the screen.
> When we **print** to standard output,
> then by default we print to the screen.
> However, standard output can be **redirected**
> to other files, programs, or devices, like actual printers.

### Print to Screen

To use ``echo``:

```
echo "hello world"
echo "Today is a good day."
```

We can also ``echo`` variables:

```
a=4
echo "$a"
```

### Print File to Screen

``cat`` is listed elsewhere in the GNU Coreutils page.
The primary use of the ``cat`` command is to join, combine, or concatenate files,
but if used on a single file,
it has this nice side effect of printing the content of the file to the screen:

```
cat file.html
```

If the file is very long, we might want to use what's called a **pager**.
There are a few pagers to use, but the ``less`` command is a common one:

```
less file.html
```

Like with the **man pages**,
use the up and down arrow keys to scroll through the output,
and press **q** to quit the pager.

## Conclusion

In this demo, we learned about the file system or directory structure of Linux,
and we also learned some basic command to work with directories and files.
You should practice using these commands as much as possible.
The more you use them, the easier it'll get.
Also, be sure to review the **man pages** for each of the commands,
especially to see what options are available for each of them.

Basic commands covered in this demo include:

- ``ls`` : list 
- ``man`` : manual pages
- ``cp`` : copy
- ``mv`` : move or rename
- ``rm`` : remove or delete a file or directory
- ``mkdir`` : create a directory
- ``rmdir`` : delete an empty directory
- ``echo`` : print a line of text
- ``cat`` : display contents of a file
- ``less`` : display contents of a file by page 
- ``tree`` : list contents of directories in a tree-like format

[filesystem]:https://en.wikipedia.org/wiki/File_system
[apfs]:https://support.apple.com/guide/disk-utility/file-system-formats-available-in-disk-utility-dsku19ed921c/mac
[ntfs]:https://docs.microsoft.com/en-us/troubleshoot/windows-client/backup-and-storage/fat-hpfs-and-ntfs-file-systems
[debian]:https://www.debian.org/
[ubuntu]:https://ubuntu.com
[fedora]:https://getfedora.org/
[opensuse]:https://www.opensuse.org/
[ext4]:https://opensource.com/article/18/4/ext4-filesystem
[directories]:https://www.linux.com/tutorials/linux-filesystem-explained/
[coreutils]:https://www.gnu.org/software/coreutils/manual/coreutils.html
[directorylisting]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Directory-listing
[basicops]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Basic-operations
[filetypes]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Special-file-types
[printing]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Printing-text
