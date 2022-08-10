# Revisiting Directory Paths

I introduced the concept of absolute and relative paths
in [section 2.3](03-filesystem-file-management.html).
In this session, the goal is to revisit paths
(locations of files and directories in the filesystem),
and provide some examples.
This will be important as we proceed to Bash scripting
and other tasks going forward.

## Change Directories

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

We revisited working with paths in this section,
and we used the following commands to do so:

- ``cd`` : change directories
- ``mkdir`` : make directories
- ``rm`` : remove (delete) files or directories
- ``cp`` : copy files or directories
- ``mv`` : move or rename files or directories
