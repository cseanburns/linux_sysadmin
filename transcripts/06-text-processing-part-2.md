## Processing Data: Grep, Sed, Awk (Part 2)

### Introduction

Hi Class -- in this demo, I will cover three additional utilities for processing text: ``grep``, ``sed``, and ``awk``. This page contains the entire transcript for the three programs, but I will break the video up into the three respective parts.

Thus far in class, we have learned about commands like ``wc``, ``cat``, ``cut``, ``head``, ``tail``, ``sort``, and ``uniq``. There are other utilities that help us process data, and these include:

- ``join`` for joining lines of two files on a common field
- ``paste`` for merging lines of files

We have learned about the ``|`` pipe operator, which we use to redirect **standard output** to a different command so that second (or third) command can process the output. An example is: ``sort file | uniq``, which sorts a file first and then identifies the unique lines (by the way, files must be sorted before piped to ``uniq``).

We have learned about the ``>`` and ``>>`` redirect operators. They work like the pipe operator, but instead of directing output to a new command for the new command to process, they direct output to a file. As a reminder, the single redirect ``>`` will overwrite a file or create a file if it does not exist. The double redirect ``>>`` will append to an existing file or create a file if it does not exist. It's safer thus to use the double redirect, but if you are processing large amounts of data, it could also mean creating really large files really quickly. If that gets out of hand, then you might crash your system.

The real magic of the Linux command line (and other Unix-like OSes) is this ability to use the pipe and redirect operators to string together multiple commands like the ones that we have covered and to redirect output to files.

### Grep, Sed, and Awk

In addition to the above commands (or utilities) described above, we have additional, and very powerful, programs available to us for processing data. In this demo, I will introduce us to these, and they include ``grep``, ``sed``, and ``awk``. I use these more than I use some of the utilities we have covered so far.

#### Grep

The ``grep`` command is one of my most often used commands. Basically, ``grep`` "prints lines that match patterns" (see ``man grep``). In other words, it's search, and it's super powerful.

``grep`` works line by line. So when we use it to search a file for a string of text, it will return the whole line that includes the match. Remember, this **line by line** idea is part of the history of Unix-like operating systems, and it's super important to remember that most utilities and programs that we use on the command line have this as the basis of their approach.

Let's consider the file **operating-systems.csv**, as seen below:

```
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

**Quick note:** In the code snippets below, and like in many of my examples, lines starting with a pound sign **#** signal a comment that explains the purpose of the command that follows on the next line.

```
# to search for a string; here we search for the string "Chrome"
grep "Chrome" operating-systems.csv
# repeat the search by be case insensitive; the default is case sensitive
grep -i "chrome" operating-systems.csv
# return lines that do not match and that are case insensitive
grep -vi "chrome" operating-systems.csv
```

I used the ``tail`` command in class to show how we might use that to remove the header (1st line) in a file, but I don't use ``tail`` very often because I have ``grep``. Part of the power with ``grep`` is that we can use what are called regular expressions (**regex** for short). Regex is a method used to identify patterns in text via abstractions. They can get complicated, but we can use some easy regex methods.

```
# remove the first line from the output; the carat indicates the start of the line
# thus, this returns results that do not match lines where the start of the line begins with "os"
grep -vi "^os" operating-systems.csv
# remove the first line from the output; the dollar sign indicates the end of the line
# thus, this returns results that do not match lines where the start of the line ends with "year"
grep -vi "year$" operating-systems.csv
```

Other ``grep`` options:

```
# returns lines that have the string "proprietary"
grep -i "proprietary" operating-systems.csv
# get a count of those lines
grep -ic "proprietary" operating-systems.csv
# print only the match and not the whole line
grep -io "proprietary" operating-systems.csv

```

#### Sed

I spoke about the ``ed`` command. That and editors like ``vi`` or ``vim`` all belong to the same family of programs. ``sed`` belongs to this family, too. Specifically, ``sed`` is a "stream editor ... used to perform basic text transformations on an input stream (a file or input from a pipeline") (see ``man sed``). By default, ``sed`` works on **standard output**, but it can be used to edit and write to files.

Like ``ed``, ``vim``, and ``grep``, ``sed`` works line by line. Unlike ``grep``, ``sed`` uses **addresses** to specify lines or ranges of lines, and these addresses are followed by a command. 

All text files are considered to have lines that start with the number 1. So another way to remove the header line of our **operating-systems.csv** file is to simply delete the first line:

```
# delete (d command) line one from standard output; 
sed '1d' operating-systems.csv
```

If I wanted to make that a permanent deletion, then I would use the ``-i`` option, which means that I would edit the file in place (see ``man sed``).

```
# Let's work on a copy and not the original file just for the example
cp operating-systems.csv os.csv
# now let's delete the first line from standard output
sed -i '1d' os.csv
```

To refer to line **ranges**, then I add a comma between **addresses**:

```
# delete the lines one through three; you would add the -i option to edit the file inplace
sed '1,3d' operating-systems.csv
```

I can use ``sed`` to **find and replace** strings:

```
# find string "Linux" and replace with "GNU/Linux"
# the 's' command means search
# the string within after the forward slash indicates the search term
# the string after the second forward slash indicates the replace term
# the \ is an escape character so that sed interprets the forward slash literally
# the ending 'g' command means "global", or all instances.
# Without it, it would stop after the first instance

sed 's/Linux/GNU\/Linux/g' operating-systems.csv
```

I can append ``a`` or insert ``i`` text:

```
# append line after line 3 with the 'a' command
sed '3a iOS, Proprietary, 2007' operating-systems.csv
# insert line at line 3 with the 'i' command
sed '3i iOS, Proprietary, 2007' operating-systems.csv
```

For example, say I forgot to add the **shebang** at the top of a script named **test.sh**, I could use ``sed`` like so (**Note:** the above command will only work on a non-empty file):

```
sed -i '1i #!/usr/bin/bash' test.sh
```

#### Awk

``awk`` or ``gawk`` is a complete scripting language for "pattern scanning and processing" text (see ``man awk``). It's a powerful language, and its focus is on columns of structured data.

In ``awk``, columns of a file are identified by a dollar sign and then the number of the column. So, ``$1`` indicates column 1, and ``$2`` indicates column 2. If we use ``$0``, then we refer to the entire file.

The syntax for ``awk`` is a little different. Basically, ``awk`` uses the following syntax, where **pattern** is optional.

```
awk pattern { action statements }
```

To print the first column of our file, then:

```
# print column one
awk '{ print $1 }' operating-systems.csv
# print column one that includes the term 'Linux'
awk '/Linux/ { print $1 }' operating-systems.csv
```

``awk`` by default considers the first empty space as the field delimiter. That's why when I printed the first column above, only the term **Windows** appeared in the results even though it should be **Windows NT**. To specify that we want ``awk`` to treat the comma as a field delimiter, we use the ``-F`` option and we surround the comma with a couple of single quotes:

```
# use -F to tell awk that the comma is the separator or delimiter
awk -F',' '{ print $1 }' operating-systems.csv
```

Now we can do a bit more with columns:

```
# print select columns, like column 1 and 3
awk -F',' '{ print $1 $3 }' operating-systems.csv
# make a report by adding some text
awk -F',' '{ print $1 " was founded in" $3 }' operating-systems.csv
```

Since ``awk`` is a full-fledged programming language, it understands data structures, which means it can do math or work on strings of text. Let's return lines where the year is greater than some number. 

```
# print all of column 3
awk -F',' '{ print $3 }' operating-systems.csv
# print only the parts of column 3 that are greater than 2005
awk -F',' '$3 > 2005 { print $3 }' operating-systems.csv
# print only the parts of column 3 that are equal to 2007
awk -F',' '$3 == 2007 { print $3 }' operating-systems.csv
# print only the parts of columns 1 and 3 where column 3 equals 2007
awk -F',' '$3 == 2007 { print $1 $3 }' operating-systems.csv
# print the entire line where column three equals 2007
awk -F',' '$3 == 2007 { print $0 }' operating-systems.csv
# print only those lines where column 3 is greater than 200 and less than 2008
awk -F',' '$3 > 2000 && $3 < 2008 { print $0 }' operating-systems.csv
# even though we wouldn't normally add years up, let's print the sum of column 3
awk -F',' 'sum += $3 { print sum }' operating-systems.csv
```

Here are a few basic string operations:

```
awk -F',' '{ print toupper($1) }' operating-systems.csv
awk -F',' '{ print tolower($1) }' operating-systems.csv
awk -F',' '{ print length($1) }' operating-systems.csv
```

We can add additional logic. The double ampersands ``&&`` indicate a Boolean/Logical **AND**. The exclamation point ``!`` indicates a Boolean/Logical **NOT**.

```
# print only those lines where column three is greater than 1990
# and the line has the string "BSD" in it
awk -F',' '$3 > 1990 && /BSD/ { print $0 }' operating-systems.csv
# print only those lines where column three is greater than 1990
# and the line DOES NOT have the string "BSD" in it; here we use the 
# exclamation point to signal a Boolean NOT
awk -F',' '$3 > 1990 && !/BSD/ { print $0 }' operating-systems.csv
```

And now, the double vertical bar ``||`` indicates a Boolean/Logical **OR**:

```
# print only those lines that contain the string "Proprietary" or the string "Apache" (prints both)
awk -F',' '/Proprietary/ || /Apache/ { print $0 }' operating-systems.csv
# consider lower case letters. Here use the square brackets to indicate alternate letters
awk -F',' '/[pP]roprietary/ || /[aA]pache/ { print $0 }' operating-systems.csv
```

``awk`` is full-fledged programming language. It provides all sorts of conditionals, control structures, variables, etc. Feel free to explore at:

Here's an example of how I've used ``awk`` recently:

```
#!/bin/bash

# Check how much time left to sync email
# Sean Burns

systemctl status --user mbsync.timer |\
         awk -F";"\
         '/Trigger:/ && $2 == "" { print "Syncing..."}
         /Trigger:/ && $2 != "" { print "Time left to sync: " $2}'
```

### Conclusion

The Linux (and other Unix-like OSes) command line offers a lot of utilities to examine data. Prior to this lesson, we covered a few of them that help us get parts of a file and then pipe those parts through other commands or redirect output to files. We can use pipes and redirects with ``grep``, ``sed``, and ``awk``, also, if needed, but we may be able to avoid using the basic utilities like ``cut``, ``wc``, etc if want to learn more powerful programs like ``grep``, ``sed``, and ``awk``.

It's fun to learn and practice these. Despite this, you do not have to become a ``sed`` or an ``awk`` programmer. Like the utilities that we've discussed in prior lectures, the power of programs like these is that their on hand and easy to use as **one-liners**. If you want to get started, the resources below offer nice lists of pre-made one-liners:

- [sed one-liners][sedoneliners]
- [awk one-liners][awkoneliners] : this is part 1 with links to additional parts
- [compilation of one-liners][otheroneliners] : this one is good just in that is shows how you can use the pipe operator with a bunch of the utilities we've discussed

[sedoneliners]:https://edoras.sdsu.edu/doc/sed-oneliners.html
[awkoneliners]:https://catonmat.net/awk-one-liners-explained-part-one
[otheroneliners]:https://wikis.utexas.edu/display/bioiteam/Scott%27s+list+of+linux+one-liners

Please explore and try these out yourselves!
