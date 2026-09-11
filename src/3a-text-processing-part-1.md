# Text Processing: Part 1

In this section, we will cover

1. **Text processing tools are fundamental**: Learning to process and manipulate text is a crucial skill for systems administrators, programmers, and data analysts.
Linux provides a variety of tools to examine, manipulate, and analyze text.
2. **Plain text is foundational**: Programs and data are often stored in plain text, and it is essential to know how to handle text files effectively.
3. **Essential text processing commands**: Commands such as `cat`, `cut`, `head`, `paste`, `tail`, `sort`, `uniq`, and `wc` allow users to view, manipulate, and analyze text files, even large datasets, with ease.
4. **Power of pipes and redirection**: Using pipes (`|`) and redirection (`>`, `>>`), you can chain commands together to create more complex workflows for processing text files.
5. **CSV data manipulation**: This section shows how to work with CSV (comma-separated value) files, demonstrating how to view, sort, and filter data with tools like `cut` and `uniq`.

## Getting Started

One of the more important sets of tools that Linux (as well Unix-like) operating systems provide are tools that [aid processing and manipulating text][textProcessing].
The ability to process and manipulate text is a basic and essential part of many programming languages, (e.g., Python, JavaScript, etc), and
learning how to process and manipulate text is an important skill for a variety of jobs including statistics, data analytics, data science, programming, web programming, systems administration, and so forth.
In other words, this functionality of Linux (and Unix-like) operating systems essentially means that to learn Linux and the tools that it provides is akin to learning how to program.

> Plain text files are the basic building blocks of programs and data.
> Programs are written in plain text editors (Vim, VS Code, etc), and data is often stored as plain text.
> Linux offers many tools to examine, manipulate, process, analyze, and visualize data in plain text files.

In this section, we will learn some of the basic tools to examine plain text (i.e., data).
We will do some programming later in this class, but for us, the main objective with learning to program aligns with our work as systems administrators.
That means our text processing and programming goals will serve our interests in managing users, security, networking, system configuration, and so forth as Linux system administrators.

In the meantime, the goal of this section is to acquaint ourselves with some of the tools that can be used to process text.
In this section, we will only cover a handful of text processing programs or utilities, but here is a fairly comprehensive list, and we'll examine some additional ones from this list later in the semester:

- `cat`      : concatenate files and print on the standard output
- `cut`      : remove sections from each line of files
- `diff`     : compare files line by line
- `echo`     : display a line of text
- `expand`   : convert tabs to spaces
- `find`     : search for files in a directory hierarchy
- `fmt`      : simple optimal text formatter
- `fold`     : wrap each input line to fit in specified width
- `grep`     : print lines that match patterns
- `head`     : output the first part of files
- `join`     : join lines of two files on a common field
- `look`     : display lines beginning with a given string
- `nl`       : number lines of files
- `paste`    : merge lines of files
- `printf`   : format and print data
- `shuf`     : generate random permutations
- `sort`     : sort lines of text files
- `tail`     : output the last part of files
- `tr`       : translate or delete characters
- `unexpand` : convert spaces to tabs
- `uniq`     : report or omit repeat lines
- `wc`       : print newline, word, and byte counts for each file

We will also discuss two types of operators, the pipe and the redirect.
The latter has a version that will write over the contents of a file, and a version that will append contents to the end of a file:

- `|` : redirect standard output from command1 to standard input for command2
- `>` : redirect to standard output to a file, overwriting
- `>>` : redirect to standard output to a file, appending

Today I want to cover a few of the above commands for processing data in a file;
specifically:

- `cat`  : concatenate files and print on the standard output
- `cut`  : remove sections from each line of files
- `head` : output the first part of files
- `paste` : merge lines of files
- `sort` : sort lines of text files
- `tail` : output the last part of files
- `uniq` : report or omit repeat lines
- `wc`   : print newline, word, and byte counts for each file

Let's look at a toy, sample file that contains structured data as a CSV (comma separated value) file.
You can download the file to your `gcloud` virtual machine using the following command:

```
wget https://raw.githubusercontent.com/cseanburns/linux_sysadmin/master/data/operating-systems.csv
```

The file contains a list of operating systems (column one), their software license (column two), and the year the OSes were released (column three).
We can use the `cat` command to view the entire contents of this small file:

**Command:**

```
cat operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

It's a small file, but we might want the line and word count of the file.
To acquire that, we can use the ``wc`` (word count) command.
By itself, the ``wc`` command will print  the number of lines, words, and bytes of a file.
The following output states that the file contains seven lines, 23 words, and 165 bytes:

**Command:**

```
wc operating-systems.csv
```

**Output:**

```
  8  26 183 operating-systems.csv
```

We can use the `head` command to output the first ten lines of a file.
Since our file is only seven lines long, we can use the `-n` option  to change the default number of lines.
In the following example, I print the first three lines of the file:

**Command:**

```
head -n3 operating-systems.csv
```
**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
```

Using the `cut` command, we can select data from file.
In the first example, I want to select column two (or field two), which contains the license information.
Since this is a CSV file, the fields (aka, columns) are separated by commas.
Therefore I use `-d` option to instruct the `cut` command to use commas as the separating character.
The `-f` option tells the `cut` command to select field two.
Note that a CSV file may use other characters as the separator character, like the Tab character or a colon.
In such cases, it may still be called a CSV file but you might also see `.dat` files for data files or other variations.

**Command:**

```
cut -d"," -f2 operating-systems.csv
```

**Output:**

```
 License
 Proprietary
 BSD
 GPL
 Proprietary
 Proprietary
 Proprietary
 Apache
```

From there it's trivial to select a different column.
In the next example, I select column three to get the release year:

**Command:**

```
cut -d"," -f3 operating-systems.csv
```

**Output:**

```
 Year
 2009
 1993
 1991
 2007
 2001
 1993
 2008
```

A genius aspect of the Linux (and Unix) commandline is the ability to **pipe** and **redirect** output from one program to another program.
Output can be further directed to a file.
By stringing together multiple programs in this way, we can create small programs that do much more than the simple programs that compose them.

In the following example, I use pipe operators to send the output of the `tail` command
(which extracts the seven lines from the bottom of the file to just before the header,
thereby removing the header line) to the `cut` command, and
the output of the `cut` command to the `sort` command.
This sorts the data in alphabetical or numerical order, depending on the character type (lexical or numerical).
I then pipe that output to the `uniq` command, which removes duplicate rows.
Finally, I redirect that final output to a new file titled **os-years.csv**.
Since the year **1993** appears twice in the original file, it only appears once in the output because the `uniq` command removed the duplicate:

**Command:**

```
tail -n7 operating-systems.csv | cut -d"," -f3 | sort | uniq > os-years.csv
```

**Output:**

```
cat os-years.csv
 1991
 1993
 2001
 2007
 2008
 2009
```

The `man` page for `tail` offers a better way to remove header lines.
According to `man tail`, the `-n +NUM` option lets us skip starting lines.
From the `man` page:

> use -n +NUM to skip NUM-1 liines at the start
 
To apply this function, in the following command, we remove the first line using `-n +2` option, where:

- `NUM = 2` ; and therefore
- `NUM - 1 = 2 - 1 = 1`

I can also add the `-c` option to the `uniq` command to give us a frequency count of duplicated lines.
In the following command, we apply this to the second field, which is the license data:

**Command:**

```
tail -n +2 operating-systems.csv | cut -d"," -f2 | sort | uniq -c > license-data.csv
cat license-data.csv
```

**Output:**

```

 Apache
 BSD
 GPL
 Proprietary
```

> The ``tail`` command generally outputs the last lines of a file, but the ``-n +2`` option is special.
> It makes the ``tail`` command output a file starting at the second line.
> We could specify a different number in order to start output at a different line.
> See ``man tail`` for more information.

Next, let's say I have the following file called `companies.txt`.

```
Companies
Google
FreeBSD Foundatino
Linux Foundation
Apple
Apple
Microsoft
Google
```

Using the `paste` command, I can merge the two files together:

```
paste operating-systems.csv companies
```

And get the following output:

```
OS, License, Year       Company
Chrome OS, Proprietary, 2009    Google
FreeBSD, BSD, 1993      FreeBSD Foundation
Linux, GPL, 1991        Linux Foundation
iOS, Proprietary, 2007  Apple
macOS, Proprietary, 2001        Apple
Windows NT, Proprietary, 1993   Microsoft
Android, Apache, 2008   Google
```

Now we have added data to our file.
We would still need to edit the file to add commas after the Year field.
We could automate that using other utilities, like `sed`.
More on that next.

## Redirection

In the above commands, we used the single `>` redirection operator to redirect output from the commands to text files.
We can also use the double `>>` redirection operator.
The difference is that the single redirection operator will **overwrite** data to a file.
Therefore, if the file we're sending output to contains data (or content), that data will be replaced with the new data.

The `>>` redirection operator does not overwrite data.
Instead, it **appends** (adds to) data to the end of a file.

## Pipe

Also in the above commands, we used the pipe `|` operator.
Remember, the pipe operator sends the output of one command to be processed by a new command to the right of the pipe operator.
In the next example, I run the `ls` command, pipe the output to the `grep` command in order to search for a name of a file or directory.
In this case, I'm looking for a file or directory named *Mail*:

```
ls | grep "Mail"
```

## Conclusion

In this lesson, we learned how to process and make sense of data held in a text file.
We used some commands that let us select, sort, de-duplicate, redirect, and view data in different ways.
Our data file was a small one, but these are powerful and useful command and operators that would make sense of large data file.

The commands we used in this lesson include:

- `cat`  : concatenate files and print on the standard output
- `cut`  : remove sections from each line of files
- `head` : output the first part of files
- `paste` : merge lines of files
- `sort` : sort lines of text files
- `tail` : output the last part of files
- `uniq` : report or omit repeat lines
- `wc`   : print newline, word, and byte counts for each file

We also used two types of operators, the pipe and the redirect:

- `|` : redirect standard output command1 to standard input of command2
- `>` : redirect to standard output to a file, overwriting

[textProcessing]:https://tldp.org/LDP/abs/html/textproc.html
