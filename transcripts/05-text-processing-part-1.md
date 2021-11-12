## Processing Data: GNU Coreutils (Part 1)

### Text Processing

We've touched on a few of these commands already, such as:

1. ``touch``
1. ``cat``
1. ``echo``
1. ``pwd``
1. ``mkdir``
1. ``rmdir``
1. ``head``
1. ``wc``

We have commands also for getting data on the users:

1. ``who``
1. ``w``

Or the local time:

1. ``date``

Today I want to cover some file related commands for processing data in a file; specifically:

1. ``sort`` for sorting lines of text files
1. ``uniq`` for reporting or omitting repeats lines
1. ``cut`` for removing from each line of files
1. ``head`` for outputting the first part of files
1. ``tail`` for outputting the last part of files

Let's look at a toy, sample file that contains structured data as a CSV (comma separated value) file:

```
cat operating-systems.csv

Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Propietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

To get data from file:

```
# get the second field, where the fields are separated by a comma ","
cut -d"," -f2 operating-system.csv

# get the third field
cut -d"," -f3 operating-system.csv

# sort it, unique it, and save it in a separate file
cut -d"," -f3 operating-system.csv | sort | uniq > os-years.csv
```

If that CSV file has a header line, then we may want to remove it from the output. First, let's look at the file:

```
cat operating-systems.csv

OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Propietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

Say we want the license field data but we want to remove that first line, then we need the tail command:

```
tail -n +2 operating-system-csv | cut -d, -f2 | sort | uniq > license-data.csv
```

### Conclusion

In this lesson, we learned how to process and make sense of data held in a text file. We drew upon some commands we learned in prior lessons that help us navigate the command line and create files and directories. We also added commands that let us sort and view data in different ways. The commands we used in this lesson include:

- ``sort`` : for sorting lines of text files
- ``uniq`` : for reporting or omitting repeats lines
- ``cut`` : for removing from each line of files
- ``head`` : for outputting the first part of files
- ``tail`` : for outputting the last part of files
- ``who``  : show who is logged on
- ``w`` : show who is logged on and what they are doing.
- ``touch`` : change file timestamps
- ``cat`` : concatenate files and print on the standard output
- ``echo`` : display a line of text
- ``pwd`` : print name of current/working directory
- ``mkdir`` : show who is logged on
- ``rmdir`` : remove empty directories
- ``head`` : output the first part of files
- ``wc`` : print newline, word, and byte counts for each file

We also used two types of operators, the pipe and the redirect:

- ``|`` : redirect standard output command1 to standard input of command2
- ``>`` : redirect to standard output to a file, overwriting
- ``>>`` : redirect to standard output to a file, appending

