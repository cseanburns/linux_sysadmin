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

