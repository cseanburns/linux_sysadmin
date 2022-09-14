# Text Processing: Part 1

One of the more important sets of tools that Linux (as well Unix-like)
operating systems provide are tools that
[aid processing and manipulating text][textProcessing].
The ability to process and manipulate text, programmatically,
is a basic and essential part of many programming languages,
(e.g., Python, JavaScript, etc),
and learning how to process and manipulate text is
an important skill for a variety of jobs including
statistics, data analytics, data science, programming, web programming,
systems administration, and so forth.
In other words,
this functionality of Linux (and Unix-like) operating systems
essentially means that to learn Linux and the tools that it provides
is akin to learning how to program.

> Plain text files are the basic building blocks of programs and data.
> Programs are written in plain text editors, and
> data is often stored as plain text.
> Linux offers many tools to examine, manipulate, process, analyze,
> and visualize data in plain text files.

In this section, we will learn some of the basic
tools to examine plain text (i.e., data).
We will do some programming later in this class, but for us,
the main objective with learning to program
aligns with our work as systems administrators.
That means our text processing and programming goals will serve our interests
in managing users, security, networking, system configuration, and so forth
as Linux system administrators.

In the meantime, the goal of this section is to acquaint ourselves with
some of the tools that can be used to process text.
In this section, we will only cover a handful of text processing
programs or utilities,
but here is a fairly comprehensive list,
and we'll examine some additional ones from this list
later in the semester:

- ``cat``      : concatenate files and print on the standard output
- ``cut``      : remove sections from each line of files
- ``diff``     : compare files line by line
- ``echo``     : display a line of text
- ``expand``   : convert tabs to spaces
- ``find``     : search for files in a directory hierarchy
- ``fmt``      : simple optimal text formatter
- ``fold``     : wrap each input line to fit in specified width
- ``grep``     : print lines that match patterns
- ``head``     : output the first part of files
- ``join``     : join lines of two files on a common field
- ``look``     : display lines beginning with a given string
- ``nl``       : number lines of files
- ``paste``    : merge lines of files
- ``printf``   : format and print data
- ``shuf``     : generate random permutations
- ``sort``     : sort lines of text files
- ``tail``     : output the last part of files
- ``tr``       : translate or delete characters
- ``unexpand`` : convert spaces to tabs
- ``uniq``     : report or omit repeat lines
- ``wc``       : print newline, word, and byte counts for each file

We will also discuss two types of operators, the pipe and the redirect.
The latter has a version that will write over the contents of a file,
and a version that will append contents to the end of a file:

- ``|`` : redirect standard output from command1 to standard input for command2
- ``>`` : redirect to standard output to a file, overwriting
- ``>>`` : redirect to standard output to a file, appending

Today I want to cover a few of the above commands for processing data in a file;
specifically:

- ``cat``  : concatenate files and print on the standard output
- ``cut``  : remove sections from each line of files
- ``head`` : output the first part of files
- ``sort`` : sort lines of text files
- ``tail`` : output the last part of files
- ``uniq`` : report or omit repeat lines
- ``wc``   : print newline, word, and byte counts for each file

Let's look at a toy, sample file that contains
structured data as a CSV (comma separated value) file.
The file contains a list of operating systems (column one),
their software license (column two),
and the year they were released (column three).
We can use the ``cat`` command to view the entire
contents of this small file:

```
cat operating-systems.csv
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

It's a small file, but
we might want the line and word count of the file.
To acquire that, we can use the ``wc`` (word count) command.
By itself, the ``wc`` command will print 
the number of lines, words, and bytes of a file.
The following output states that the file contains
seven lines, 23 words, and 165 bytes:

```
wc operating-systems.csv
  7  23 165 operating-systems.csv
```

We can use the ``head`` command to output,
by default,
the first ten lines of a file.
Since our file is only seven lines long,
we can use the ``-n`` option 
to change the default number of lines:

```
head -n3 operating-systems.csv
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
```

Using the ``cut`` command, we can select data from file.
In the first example, I want to select column two (or field two),
which contains the license information.
Since this is a CSV file,
the fields (aka, columns) are separated by commas.
The ``-d`` option tells the ``cut`` command to use commas
as the separator character.
(A CSV file may use other characters as the separator character,
like the Tab character or a colon.)

```
# get the second field, where the fields are separated by a comma ","
cut -d"," -f2 operating-system.csv
 Proprietary
 BSD
 GPL
 Proprietary
 Proprietary
 Proprietary
 Apache
```

From there it's trivial to select a different column.
In the next example,
I select field (or column) three to get the release year:

```
# get the third field
cut -d"," -f3 operating-system.csv
 2009
 1993
 1991
 2007
 2001
 1993
 2008
```

One of the magical aspects of the Linux (and Unix) commandline
is the ability to **pipe** and **redirect** output from one program
to another program, and then to a file.
By stringing together multiple programs with these operators,
we can create small programs that do much more than the
simple programs that compose them.
In this next example,
I use the pipe operators to send the output of the ``cut``
command to the ``sort`` command,
which sorts the data in alphabetical or numerical order,
depending on the character type (lexical or numerical),
pipe that output to the ``uniq`` command,
which removes duplicate rows,
and then redirect that final output to a new
file titled **os-years.csv**.
Since the year **1993** appears twice in the original file,
it only appears once in the output
because the ``uniq`` command removed the duplicate:

```
# select field, sort it, unique it, and save it in a separate file
cut -d"," -f3 operating-system.csv | sort | uniq > os-years.csv
cat os-years.csv
 1991
 1993
 2001
 2007
 2008
 2009
```

Data files like this often have a
header line at the top row that
names the data columns.
It's useful to know how
to work with such files, so
let's add a header row to the top of the file.
In this example,
I'll use the ``sed`` command,
which we will learn more about in the
next lesson.
For now,
we use ``sed`` with the option ``-i``
to edit the file,
then ``1i`` instructs ``sed`` to **insert**
text at **line 1**.
``\OS, License, Year`` is the text
that we want inserted at line 1.
We wrap the argument within single quotes:

```
sed -i '1i \OS, License, Year' operating-systems.csv
```

Now, let's look at the file:

```
cat operating-systems.csv
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

Since the CSV file now has a header line,
we want to remove it from the output.
Say we want the license field data,
but we need to remove that first line.
In this case, we need the tail command:

```
tail -n +2 operating-system-csv | cut -d"," -f2 | sort | uniq > license-data.csv
cat license-data.csv
 Apache
 BSD
 GPL
 Proprietary
```

> The ``tail`` command generally outputs the last lines of a file,
> but the ``-n +2`` option is special.
> It makes the ``tail`` command ouput a file starting
> at the second line.
> We could specify a different number in order
> to start output at a different line.
> See ``man tail`` for more information.

## Conclusion

In this lesson, we learned how to process and
make sense of data held in a text file.
We used some commands that let us select,
sort, de-duplicate, redirect, and view data in different ways.
Our data file was a small one,
but these are powerful and useful command and operators
that would easily make sense of large amounts of data
in a file.

The commands we used in this lesson include:

- ``cat``  : concatenate files and print on the standard output
- ``cut``  : remove sections from each line of files
- ``head`` : output the first part of files
- ``sort`` : sort lines of text files
- ``tail`` : output the last part of files
- ``uniq`` : report or omit repeat lines
- ``wc``   : print newline, word, and byte counts for each file

We also used two types of operators, the pipe and the redirect:

- ``|`` : redirect standard output command1 to standard input of command2
- ``>`` : redirect to standard output to a file, overwriting

[textProcessing]:https://tldp.org/LDP/abs/html/textproc.html
