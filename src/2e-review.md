# Review

Here is a review of commands
and concepts that we have 
covered so far.

## Commands

We have covered the following
commands so far:

| Command   | Example                   | Explanation                                            |
| --------- | ---------                 | -------------                                          |
| tree      | tree -dfL 1               | List directories, full path, one level                 |
| cd        | cd ~                      | change to home directory                               |
|           | cd /                      | change to root directory                               |
|           | cd bin                    | change to bin directory from current directory         |
| pwd       | pwd                       | print working / current directory                      |
| ls        | ls ~                      | list home directory contents                           |
|           | ls -al                    | list long format and hidden files in current directory |
|           | ls -dl                    | list long format the current directory                 |
| man       | man ls                    | open manual page for the ls command                    |
|           | man man                   | open manual page for the man command                   |
| cp        | cp * bin/                 | copy all files in current directory to bin subdir      |
| mv        | mv oldname newname        | rename file oldname to newname                         |
|           | mv oldir bin/newdir       | move oldman to bin subdir and rename to newdir         |
| rm        | rm oldfile                | delete file named oldfile                              |
|           | rm -r olddir              | delete directory olddir and its contents               |
| touch     | touch newfile             | create a file called newfile                           |
|           | touch oldfile             | modify timestamp of file called oldfile                |
| mkdir     | mkdir newdir              | create a new directory called newdir                   |
| rmdir     | rmdir newdir              | delete directory called newdir if empty                |
| echo      | echo "hello"              | print "hello" to screen                                |
| cat       | cat data.csv              | print contents of file called data.csv to screen       |
|           | cat data1.csv data2.csv   | concatenate data1.csv and data2.csv to screen          |
| less      | less file                 | view contents of file called file                      |
| sudo      | sudo command              | run command as superuser                               |
| chown     | sudo chown root:root file | change owner and group to root of file file            |
| chmod     | chmod 640 file            | change permissions of file to -rw-r-----               |
|           | chmod 775 somedir         | change permissions of of somedir to drwxrwxr-x         |
| groups    | groups user               | print the groups the user is in                        |
| wc        | wc -l file                | print number of lines of file                          |
|           | wc -w file                | print number of words of file                          |
| head      | head file                 | print top ten lines of file                            |
|           | head -n3 file             | print top three lines of file                          |
| tail      | tail file                 | print bottom ten lines of file                         |
|           | tail -n3 file             | print bottom three lines of file                       |
| cut       | cut -d"," -f2 data.csv    | print second column of file data.csv                   |
| sort      | sort -n file              | sort file by numerical order                           |
|           | sort -rn file             | sort file by reverse numerical order                   |
|           | sort -df file             | sort file by dictionary order and ignore case          |
| uniq      | uniq file                 | report or omit repeated lines in sorted file           |
|           | uniq -c file              | report count of duplicate lines in sorted file         |

In addition to the above commands,
we also have pipelines using the ``|``.
Pipelines send the standard output of
one command to a second command
(or more).
The following command sorts the
contents of a file and then
sends the output to the ``uniq``
command to remove duplicates:

```
sort file | uniq
```

Redirection uses the ``>`` or the ``>>``
to redirect output of a command to a file.
A single ``>`` will overwrite the contents
of a file.
A double ``>>`` will append to the
contents of a file.

Redirect the output of the ``ls``
command to a file called **dirlist**:

```
ls > dirlist
```

Append the date to the end of
the file **dirlist**:

```
date >> dirlist
```

## Paths

I introduced the concept of absolute and relative paths
in [section 2.3](03-filesystem-file-management.html).
In this session, the goal is to revisit paths
(locations of files and directories in the filesystem),
and provide some examples.
This will be important as we proceed to Bash scripting
and other tasks going forward.

### Change Directories

The ``cd`` command is used to change directories.
When we login to our systems,
we will find ourselves in our **$HOME** directory,
which is located at ``/home/USER``.

To change to the root directory, type:

```
pwd
/home/sean
cd /
pwd
/
```

From there, to change to the ``/bin`` directory:

```
cd bin
pwd
/bin
```

To change to the previous working directory:

```
cd -
pwd
/
```

To go home quickly, just enter ``cd`` by itself:

```
cd
pwd
/home/sean
```

To change to the ``public_html`` directory:

```
cd public_html
pwd
/home/sean/public_html
```

To change to the directory one level up:

```
cd ..
pwd
cd /home/sean
```

## Make Directories

Sometimes we'll want to create new directories.
To do so, we use the ``mkdir`` command.

To make a new directory in our **$HOME** directory:

```
pwd
/home/sean
mkdir documents
cd documents
pwd
/home/sean/documents
cd
pwd
/home/sean
```

To make more than one directory at the same time,
where the second or additional directories are nested,
use the ``-p`` option:

```
mkdir -p photos/2022
```

## Remove or Delete Files and Directories

To remove a file, we use the ``rm`` command.
If the file is in a subdirectory,
specify the relative path:

```
pwd
/home/sean
rm public_html/index.html
```

To remove a file in a directory one level up,
use the ``..`` notation.
For example, if I'm in my **documents** directory,
and I want to delete a file in my home (parent) directory:

```
cd documents
pwd
/home/sean/documents
rm ../file.txt
```

Alternatively, I could the tilde as shorthand for **$HOME**:

```
rm ~/file.txt
```

To remove a file nested in multiple subdirectories,
just specify the path (absolute or relative).

```
rm photos/2022/05/22/IMG_2022_05_22.jpg
```

Remember that the ``rm`` command deletes files and directories.
Use it with caution,
or with the ``-i`` option.

## Copy Files or Directories

Let's say I want to copy a file in my **$HOME** directory
to a nested directory:

```
cp file.txt documents/ICT418/homework/
```

Or, we can copy a file from one subdirectory to another.
Here I copy a file in my ``~/bin`` directory
to my ``~/documents``directory.
The ``~`` (tilde) is shorthand for my **$HOME** directory.

```
cp ~/bin/file.txt ~/documents/``
```

## Move or Rename Files or Directories

Let's say I downloaded a file to my ``~/Downloads`` directory,
and I want to move it to my ``~/documents`` directory:

```
mv ~/Downloads/article.pdf ~/documents/
```

Or, let's say we rename it in the process:

```
mv ~/Downloads/article.pdf ~/documents/article-2022.pdf
```

We can also move directories.
Since the commandline is case-sensitive,
let's say I rename the **documents** directory
to **Documents**:

```
mv ~/documents ~/Documents
```

## Conclusion

Use this page as a reference to
the commands that we have covered
so far.
