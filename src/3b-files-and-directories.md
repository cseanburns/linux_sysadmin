# Files and Directories

In this section, we will cover:

1. **Basic Directory and File Commands**:
   - Overview of GNU Coreutils.
   - Commands for navigating directories and working with files.

2. **Directory Listing**:
   - `ls`: List directory contents.
   - Options for `ls` (e.g., `-l`, `-a`, `-al`).
   - `pwd`: Print working directory.
   - Using `man` pages for command options.

3. **Basic File Operations**:
   - `cp`: Copying files and directories.
   - `mv`: Moving and renaming files and directories.
   - `rm`: Removing files and directories.
   - `touch`: Updating file timestamps or creating empty files.
   - Options for each command, including interactive modes.

4. **Special File Types**:
   - `mkdir`: Creating directories.
   - `rmdir`: Deleting empty directories.
   - `rm -r`: Recursively deleting directories with content.

5. **Printing Text**:
   - `echo`: Printing text or variables to standard output.
   - `cat`: Concatenating and printing file contents.
   - `less`: Viewing file contents one page at a time.

## Basic Directory and File commands 

In order to explore the above directories
but also to create new ones and work with files,
we need to know some basic terminal commands.
A lot of these commands are part of the base system
called [GNU Coreutils][coreutils],
and in this demo,
we will specifically cover some of the following
GNU Coreutils:

- [Directory Listing][directorylisting]
- [Basic Operations][basicops]
- [Special File Types][filetypes]
- [Printing Text][printing]

### Directory Listing

> I have already demonstrated one command:
> the ``cd`` (change directory) command.
> This will be one of the most frequently used commands in your toolbox.

In our current directory, or
once we have changed to a new directory,
we will want to learn its contents
(what files and directories it contains).
We have a few commands to choose from to list contents
(e.g.,  you have already seen the ``tree`` command),
but the most common command is the ``ls`` (list) command.
We use it by typing the following two letters in the terminal:

```
ls
```

Again, to confirm that we're in some specific directory,
use the ``pwd`` command to **print** the **working directory**.

Most commands can be combined with **options**.
Options provide additional functionality to the base command, and
in order to see what options are available for the ``ls`` command,
we can look at its **man(ual) page**:

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
In Linux, hidden files are hidden from the base ``ls`` command
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

- ``cp``    : copying files and directories
- ``mv``    : moving (or renaming) files and directories
- ``rm``    : removing (or deleting) files and directories
- ``touch`` : change file timestamps (or, create a new, empty file)

These commands also have various options
that can be viewed in their respective **man pages**.
Again, command options provide additional functionality to the base command,
and are mostly (but not always) prepended with a dash and a letter or number.
To see examples, type the following commands,
which will launch the manual pages for them.
Press ``q`` to exit the manual pages,
and use your up and down arrow keys to scroll through the manuals:

```
man cp
man mv
man rm
man touch
```

The ``touch`` command's primary use is to change a file's timestamp;
that is, the command updates a file's "access and modification times"
(see ``man touch``).
For example, let's say we have a file called **paper.txt**
in our home directory.
We can see the output here:

```
ls -l paper.txt
-rw-rw-r-- 1 sean sean 0 Jun 27 00:13 /home/sean/paper.txt
```

This shows that the last modification time was 12:03AM on June 27.

If I run the touch command on **paper.txt**,
the timestamp will change:

```
touch paper.txt
-rw-rw-r-- 1 sean sean 0 Jun 27 00:15 /home/sean/paper.txt
```

This shows an updated modification timestamp of 12:15AM.

The side effect occurs when we name a file with the ``touch`` command,
but the file does not exist,
in which case the ``touch`` command will create an empty file
with the name we use.
Let's say that I do **not** have a file named **file.txt**
in my home directory.
If I run the ``ls -l file.txt`` command, I'll receive an error
since the file does not exist.
But if I then use the ``touch file.txt`` command,
and then run ``ls -l file.txt``.
we'll see that the file now exists,
that it has a byte size of zero:

```
ls -l file.txt
ls: cannot access 'file.txt': No such file or directory
touch file.txt
ls -l file.txt
-rw-rw-r-- 1 sean sean 0 Jun 27 00:18 file.txt
```

Here are some ways to use the other three commands and their options:

### Copying Files and Directories

To copy an existing file (**file1.txt**)
to a new file (**file2.txt**):

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

To move the file to our Documents/ subdirectory and also rename it,
then we'd do this:

```
mv file.docx Documents/newName.docx
```

The ``man`` page for the ``mv`` command also describes an ``-i`` option
for interactive mode that helps prevent us from overwriting existing files.
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

> Unlike the trash bin in your graphical user environment,
> it's very hard to recover a deleted file using the ``rm`` command.
> That is, using ``rm`` does not mean the file or directory is **trashed**;
> rather, it means it was **deleted**.

## Special File Types

For now, let's only cover two commands here:

- ``mkdir`` for creating a new directory 
- ``rmdir`` for deleting an empty directory

Like the above commands,
these commands also have their own set of options
that can be viewed in their respective **man pages**:

```
man mkdir
man rmdir
```

### Make or Create a New Directory 

We use these commands like we do the ones above.
If we are in our **$HOME** directory, and
we want to create a new directory called **bin**, we do:

```
mkdir bin 
```

> The **bin** directory in our **$HOME** directory is a default location
> to store our personal applications, or applications (programs) that
> are only available to us.

And if we run ``ls``, we should see that it was successful.

### Delete a Directory

The ``rmdir`` command is a bit weird
because it only removes **empty** directories.
To remove the directory we just created, we use it like so:

```
rmdir bin 
```

However, if you want to remove a directory
that contains files or other subdirectories,
then you will have to use the ``rm`` command
along with the ``-r`` (recursive) option:

```
rm -r directory-with-content/
```

## Printing Text

There a number of ways to print text to **standard output**,
which is our screen by default in the terminal.
We could also redirect standard output
to a file, to a printer, or to a remote shell.
We'll see examples like that later in the semester.
Here let's cover two commands:

- ``echo`` : to print a line of text to standard output
- ``cat``  : to concatenate and write files
- ``less`` : to view files one page at a time

> **Standard output** is by default the screen.
> When we **print** to standard output,
> then by default we print to the screen.
> However, standard output can be **redirected**
> to files, programs, or devices, like actual printers.

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

In this demo, we learned about the filesystem or directory structure of Linux,
and we also learned some basic command to work with directories and files.
You should practice using these commands as much as possible.
The more you use them, the easier it'll get.
Also, be sure to review the **man pages** for each of the commands,
especially to see what options are available for each of them.

Basic commands covered in this demo include:

- ``cat``   : display contents of a file
- ``cp``    : copy
- ``echo``  : print a line of text
- ``less``  : display contents of a file by page
- ``ls``    : list
- ``man``   : manual pages
- ``mkdir`` : create a directory
- ``mv``    : move or rename
- ``pwd``   : print name of current/working directory
- ``rmdir`` : delete an empty directory
- ``rm``    : remove or delete a file or directory
- ``tree``  : list contents of directories in a tree-like format

[coreutils]:https://en.wikipedia.org/wiki/List_of_GNU_Core_Utilities_commands
[directorylisting]:https://www.gnu.org/software/coreutils/manual/coreutils.html#toc-Directory-listing-1
[basicops]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Basic-operations
[filetypes]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Basic-operations
[printing]:https://www.gnu.org/software/coreutils/manual/coreutils.html#Printing-text
