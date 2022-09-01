# The Linux Filesystem

In this demo, we will cover the:

- the Linux filesystem and how it is structured and organized, and
- the basic commands to navigate around and to work with directories and files

> The terms **directories** and **folders** are synonymous,
> but as users of primarily graphical user interfaces, you
> are more likely familiar with the term **folders**. I will
> more often use the term **directories** since that is the
> command line (text user interface) convention. I will use
> the term **folders** when referring to a graphical
> environment.

Throughout this demonstration,
I encourage you to ``gcloud compute ssh`` into
our remote server and
follow along with the commands that I use.
See
[Section 2.1](05-using-gcloud-virtual-machines.md#connect-to-our-vm)
for details on connecting to the remote server.

## Visualizing the Filesystem as a Tree

We will need to work within the filesystem
quite a lot in this course,
but the term **filesystem** may refer to different concepts,
and it's important to clear that up before we start.

In come cases, a **filesystem** refers to how data (files)
are [stored and retrieved][filesystem]
on a device like a hard drive, USB drive, etc.
For example, macOS uses the [Apple File System (APFS)][apfs] by default,
and Windows uses the [New Technology File System (NTFS)][ntfs].
Linux and other unix-like operating systems use a variety of filesystems, but
presently, the two major ones are **ext4** and **btrfs**.
The former is the default filesystem on distributions
like [Debian][debian] and [Ubuntu][ubuntu];
the latter is the default on the 
[Fedora][fedora] and [openSUSE][opensuse] distributions. 
[Opensource.com][ext4] has a nice overview of
filesystems under this concept.

A **filesystem** might also be used to refer
to the **directory structure** or
[directory tree][directorytree] of a system.
This concept is related to the prior concept
of a filesystem, but
it's used here to refer to the location of
files and directories on a system.
For example, on Windows,
the filesystem is identified by a letter,
like the **C:** drive,
regardless if the disk has a
NTFS filesystem or a FAT filesystem.
Additional drives
(e.g., extra hard drives, USB drives, DVD drives, etc.),
will be assigned their own letters
(**A:**, **B:**, **D:**, etc.).
[macOS adheres to a tree like filesystem][macosdirtree]
like Linux and other unix-like operating systems.
(This is because macOS is UNIX.)
In these operating systems, we have a
top-level **root** directory
identified by a single forward slash  **/**,
and then subdirectories under that root directory.
Additional drives
(e.g., extra hard drives, USB drives, DVD drives, etc.)
are **mounted** under that root hierarchy and
not separately like on Windows.
[Linux.com][directories] provides a nice overview
of the most common directory structure
that Linux distributions use along with an
explanation for the major bottom level directories.
In this section, we will learn
about this type of filesystem.

On Linux, we can visualize the
filesystem with the ``tree`` command.
The ``tree`` command, like many Linux commands,
can be run on its own or with options,
like in the second example below:

- ``tree`` : list contents of directories in a tree-like format
    - ``tree -dfL 1`` : directories only, full path, one level
    - ``tree -dfL 1 /`` : list directories only at root **/** level

### The root Directory and its Base Level Directories

As explained on the Linux.com page,
here are the major sub directories under **/** (root)
and a short description of their main purpose:

- ``/bin`` : binary files needed to use the system
- ``/boot``  : files needed to boot the system
- ``/dev`` : device files -- all hardware has a file
- ``/etc`` : system configuration files
- ``/home`` : user directories
- ``/lib`` : libraries/programs needed for other programs
- ``/media`` : external storage is mounted
- ``/mnt`` : other filesystems may be mounted
- ``/opt`` : store software code to compile software
- ``/proc`` : files containing info about your computer
- ``/root`` : home directory of superuser
- ``/run`` : used by system processes
- ``/sbin`` : like ``/bin``, binary files that require superuser privileges
- ``/srv`` : contains data for servers
- ``/sys`` : contains info about devices
- ``/tmp`` : temp files used by applications
- ``/usr`` : user binaries, etc that might be installed by users
- ``/var`` : variable files, used often for system logs

Although there are 18 directories listed above
that **branch** off from the root directory,
we will use some more often than others.
For example, the **/etc** directory
contains system configuration files,
and we will use the contents of this directory,
along with the **/var** directory,
quite a bit when we set up our web servers,
relational database servers,
and more later in the semester.
The **/home** directory is where our default
home directories are stored,
and if you manage a multi-user system,
then this will be an important directory to manage. 

Source: [Linux Filesystem Explained][directories]

## Relative and Absolute Paths

macOS users have the Finder app
to navigate their filesystem,
to move files to different folders,
to copy files, to trash them, etc.
Window users have File Explorer for these functions.
Linux users have similar graphical software options,
but all of these functions can be
completed on the Linux command line,
and generally more efficiently.
To get started, we need to learn two things first:

1. how to specify the locations of files and directories in
   the filesystem 
2. the commands needed to work with the filesystem

To help specify the locations of files and directories,
there are two key concepts to know:

- absolute paths
- relative paths

Above we learned about the **/** root directory
and its subdirectories.
All sorts of commands,
especially those that deal with files and directories 
(like copying, moving, deleting),
require us to specify on the command line
the locations of the files and directories.
It's common to specify the location in two different ways,
by specifying their **absolute** path (or location)
on the filesystem,
or the **relative** path (or location).

To demonstrate, we might want to move around the filesystem.
When we first log in to our remote system,
our default location will be our home directory,
sometimes referred to as **$HOME**.
The path (location) to that directory will be.

```
/home/USER
```

Where **USER** is your username.
Therefore, since my username is **sean**,
my home directory is located at:

```
/home/sean
```

which we can see specified with the ``pwd``
(print working directory) command:

```
pwd
/home/sean
```

> When I write **$HOME**,
> I am referring to a default, **environmental** variable
> that points to our home directory.
> It's **variable** because,
> depending on which account we're logged in as,
> **$HOME** will point to a different location.
> For me, then, that will be ``/home/sean``,
> if I'm logged in as **sean**.
> For you it'll point to your home directory.

In my home directory,
I have a subdirectory called **public_html**.
The path to that is:

```
/home/sean/public_html
```

In a program like Finder (macOS) or
File Explorer (Windows),
if I want to change my location to that
  subdirectory (or folder),
then I'd double click on its folder icon.
On the command line, however, I have to
write out the command
and the path to the subdirectory.
Therefore, **starting in my home directory**,
I use the following command to switch to the
public_html subdirectory:

```
cd public_html
```

> Note that files and directories in Linux are case
> sensitive. This means that a directory named
> **public_html** can co-exist alongside a directory named
> **Public_html**. Or a file named **paper.txt** can
> co-exist alongside a file named **Paper.txt**. So be sure
> to use the proper case when spelling out files,
> directories, and even commands.

The above is an example of using a relative path, and
that command would only be successful if I were
first in my **$HOME** directory.
That's because I specified the location of **public_html**
relative to my default (**$HOME**) location.

I could have also specified the absolute location,
but this would be the wordier way.
Since the **public_html** directory
is in my $HOME directory,
and my $HOME directory is a subdirectory
in the **/home** directory,
then to specify the absolute path in the above command,
I'd write:

```
cd /home/sean/public_html
```

Again, the relative path specified above
would only work if
I was in my home directory, because 
``cd public_html`` is relative to the
location of ``/home/sean``.
That is, the subdirectory **public_html**
is in **/home/sean**.
But specifying the absolute path would work no matter where
I was located in the filesystem.
For example, if I was working on a file
in the ``/etc/apache2`` directory,
then using the absolute path
(``cd /home/sean/public_html``) would work.
But the relative path (``cd public_html``)
command would not since
there is no subdirectory called **public_html**
in the ``/etc/apache2`` directory.

Finally, you can use the ``ls`` command to
list the contents of a directory, i.e.,
the files and subdirectories in a directory:

```
ls
```

We will cover this more next. 

## Conclusion

Understanding relative and absolute paths is
one of the more difficult concepts for
new commandline users to learn,
but after time, it'll feel natural.
So just keep practicing, and
I'll go over this throughout the semester.

In this section, you learned the following commands:

- ``tree`` to list directory contents in a tree-like format
- ``cd`` to **change directory**
- ``pwd`` to **print working directory**

You learned different ways to refer to the home
directory:

- **/home/USER**
- **$HOME**
- **~**

You learned about relative and absolute paths.
An absolute path starts with the root directory **/**.
Here's an absolute path to a file named
**paper.txt** in my home directory:

- absolute path: **/home/sean/paper.txt**

If I were already in my home directory,
then the relative path would simply be:

- relative path: **paper.txt**

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
[directorytree]:https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch01.html
[macosdirtree]:https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html
