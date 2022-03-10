# The Linux/Unix File System and File Types

In this demo, we will cover the:

- the Linux file system and how it is organized, and
- the basic commands to work with directories and files

Throughout this demonstration, I encourage you to ``ssh`` into our remote server and follow along with the commands that I use.

## Visualizing the Tree Structure

First, the term **file system** may refer to different concepts. In come cases, it refers to how data is [stored and retrieved][filesystem] on a device like a hard drive, USB drive, etc. For example, macOS uses the [Apple File System (APFS)][apfs] by default, and Windows uses the [New Technology File System (NTFS)][ntfs]. Linux and other unix-like operating systems use a variety of file systems. Presently, the two major ones include **ext4** and **btrfs**. The former is the default file system on distributions like [Debian][debian] and [Ubuntu][ubuntu], but the [Fedora][fedora] distribution recently switched to the latter. [Opensource.com][ext4] has a nice overview of file systems under this concept, and we will learn how to use some of them later in the semester when we will create partitions, manage disk volumes, and learn about backups.

The other way that the term **file system** might be used is to refer to the directory structure of a system. This concept is not always directly related to the prior concept of a file system. For example, on Windows, the root file system is identified by a letter, like the **C:** drive regardless if the disk has a NTFS file system or a FAT file system. macOS adheres to a root file system like Linux and other unix-like operating systems. In these operating systems, we have a root, top-level directory identified by a **/**, and then sub-directories (or folders in GUI-speak) under that root directory. [Linux.com][directories] has a nice overview of the most common directory structure that Linux distributions use along with an explanation for the major bottom level directories.

On Linux, we can visualize the filesystem with the ``tree`` command. 

- ``tree`` : list contents of directories in a tree-like format
  - ``tree -dfL 1`` : directories only, full path, one level

### The root Directory and its Base Level Directories

As explained on the Linux.com page, here are the major sub directories under **/**:

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

Although there are 18 directories listed here and that stem from the root directory, there are some that we'll use much more often than others. For example, since the **/etc** directory contains system configuration files, we will use the contents of this directory, along with the **/var** directory, quite a bit when we set up our web servers, relational database servers, and more. The **/home** directory is where our default home directories are stored, and thus if you manage a multi-user system, like I do for this class, then this will be an important directory. 

Source: [Linux Filesystem Explained][8]

## Basic Directory and File commands 

In order to explore the above directories but also to create new ones and work with files, we need to know some basic commands. A lot of these commands are [GNU Coreutils][coreutils], and in this demo, we will specifically cover some of the following:

- [Directory Listing][directorylisting]
- [Basic Operations][basicops]
- [Special File Types][filetypes]
- [Printing Text][printing]

### Directory Listing

We have a few options to list directories, but the most common command is the ``ls`` command, and we use it like so:

```
ls
```

However, most commands can be used with **options**. In order to see what options are available for the ``ls`` command, we use look at it's **man(ual) page**:

```
man ls

```

From the ``ls`` **man page**, we learn that we can use the ``-l`` option to format the output of the ``ls`` command as a long-list, or a list that provides more information about the files and directories in the working directory.

We can use the ``-a`` option to list hidden files. In Linux, hidden files are hidden from the default ``ls`` command if the files begin with a period. We have a number of those files in hour **$HOME** directories, and we can see them like so:

```
ls -a
```

We can also combine options. For example, to view all files, including hidden ones, in the long-list format, we can use:

```
ls -al
```

## Basic Operations

Some basic operation commands include:

- ``cp`` for copying files and directories
- ``mv`` for moving (or renaming) files and directories
- ``rm`` for removing (or deleting) files and directories

These commands also have various options that can be viewed in their respective **man pages**. See:

```
man cp
man mv
man rm
```

Here are some ways to use these commands:

### copy

To copy an existing file to a new file:

```
cp file.txt newfile.txt
```

### move

To move an existing file in our **$HOME** directory to a subdirectory, like into our **public_html** directory:

```
mv file.html public_html/file.html
```

### rename

To rename a file, we also use the ``mv`` command:

```
mv file.html newfile.html
```

### move and rename

To move and rename a file:

```
mv file.html public_html/newfile.html
```

### remove or delete

Finally, to delete a file:

```
rm file.html
```

## Special File Types

For now, let's only cover two commands here:

- ``mkdir`` for creating a new directory 
- ``rmdir`` for deleting a directory

Like the above commands, these commands also have their own set of options that can be viewed in their respective **man pages**:

```
man mkdir
man rmdir
```

### make or create a new directory 

We use these commands like we do the ones above. If we are in our **$HOME** directory and we want to create a new directory, we do:

```
mkdir documents
```

And if we run ``ls``, we can see that it was successful.

### delete a directory

The ``rmdir`` command is a bit weird because it only removes **empty** directories. To remove the directory we just created, we use it like so:

```
rmdir documents
```

However, if you want to remove a directory that contains files or other sub-directories, then you will have to use the ``rm`` command along with the ``-r`` option:

```
rm -r directory-with-content
```

## Printing Text

There a number of ways to print text to **standard output**, which is our screen by default in the terminal. We could redirect standard output to a file or to a printer or to a remote shell. We'll get to examples like that later in the semester. Here let's cover two commands:

- ``echo`` to print a line of text to standard output
- ``cat`` to concatenate and write files

### print to screen

To use ``echo``:

```
echo "hello world"
echo "Today is a good day."
```

### print file to screen

``cat`` is listed elsewhere in the GNU Coreutils page. The primary use of the ``cat`` command is to join, combine, or concatenate files, but if used on a single file, it has this nice side effect of printing the content of the file to the screen:

```
cat file.html
```

If the file is very long, we might want to use a **pager**. There are a few options, but the ``less`` command is very useful:

```
less file.html
```

## Conclusion

In this demo, we learned about the file system or directory structure of Linux, and we also learned some basic command to work with directories and files. You should practice using these commands as much as possible. The more you use them, the easier it'll get. Also, be sure to review the **man pages** for each of the commands, especially to see what options are available for each of them.

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
[ext4]:https://opensource.com/article/18/4/ext4-filesystem
[directories]:https://www.linux.com/tutorials/linux-filesystem-explained/
[coreutils]:https://www.gnu.org/software/coreutils/manual/coreutils.html
[directorylisting]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Directory-listing
[basicops]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Basic-operations
[filetypes]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Special-file-types
[printing]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Printing-text
