## The Linux/Unix File System and File Types

- ``tree`` : list contents of directories in a tree-like format
  - ``tree -dfL 1`` : dir only, full path, one level

### The root directories
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
- ``/sbin`` : like ``/bin``, binary files that require superuser privs
- ``/usr`` : user binaries, etc that might be installed by users
- ``/srv`` : contains data for servers 
- ``/sys`` : contains info about devices 
- ``/tmp`` : temp files used by applications
- ``/var`` : variable files, used often for system logs

Source: [Linux Filesystem Explained/][1]

## GNU Coreutils

The GNU Coreutils, or the GNU Core Utilities, "are the basic file, shell and text manipulation utilities of the GNU operating system. These are the core utilities which are expected to exist on every operating system" ([Coreutils, GNU][2]).

In order to do good work on the command line, it's essential that we become familiar with these utilities that cover a range of commands. 

The online manual is located at [GNU Coreutils Manual][3]. Read through it and practice! Look for examples on the web. The commands below were picked from the above online manual. Their descriptions were copied from the man page. E.g.:

```
man -f cat
cat (1)              - concatenate files and print on the standard output
```

We'll use the **cities.txt** file and the **capitals.txt** files in this
tutorial. You will find both of these files in the home directory on our remote
server. 

Here are what the files look like:

```
$ cat cities.txt
lexington, ky, 383780, 1775
knoxville, tn, 178874, 1791
new york city, ny, 8623000, 1624
lansing, mi, 116986, 1859
san diego, ca, 1420000, 1769
huntsville, al, 194585, 1809
columbia, mo, 121717, 1821

$ cat capitals.txt
franfort, ky
nashville, tn
albany, ny
lansing, mi
sacramento, ca
montgomery, al
jefferson city, mo
```

## Practice and examples

Now you can test some of these commands on these files. Be sure to read their
respective manual pages for their available options. In order to read the
manual page, you type the command ``man`` followed by the name of the command
that you're interested in reading about, like ``man cat``. You can navigate the
manual pages using your cursor keys and to exit them, you press ``q``.

### Output entire files

- ``cat`` :  concatenate files and print on the standard output
  - ``cat cities.txt``
  - ``cat cities.txt capitals.txt``
- ``tac`` :  concatenate and print files in reverse
  - ``tac cities.txt``
- ``nl`` :  add line numbers to files
  - ``nl capitals.txt``

### Formatting file contents

- ``fmt`` : simple optimal text formatter
  - ``man fmt``
  - ``fmt -w 50 file.txt``

### Output of parts of files

- ``head`` : output the first part of files
  - ``head file.txt``
  - ``head -n1 file.txt``
  - ``fmt -w 50 file.txt | head -n1``
- ``tail`` : output the last part of files
  - ``tail file.txt``
  - ``tail -n1 file.txt``
  - ``fmt -w 50 file.txt | tail -n1``

### Summarizing files

- ``wc`` : print newline, word, and byte counts for each file
  - ``wc -w cities.txt``
  - ``wc -l cities.txt``
- ``md5sum`` : compute and check MD5 message digest
- ``sha256sum`` : compute and check SHA256 message digest

### Operating on sorted files

- ``sort`` : sort lines of text files
  - ``sort cities.txt``

This does a numerical sort of the cities.txt file by the fourth column, which
is date founded column. Specifically: ``-t`` declares the field separator (,). ``-k`` declares the key (the sorting ID). So we'll sort by first column, second column, third column, and then fourth column, where column is defined by the comma key:

```
sort -t , -k 1 cities.txt
sort -t , -k 2 cities.txt
sort -t , -k 3 cities.txt
sort -t , -k 4 cities.txt
```

- ``uniq`` : report or omit repeated lines
  - ``sort file2.txt | uniq``
  - ``sort file2.txt | uniq -c``
  - ``sort -u file2.txt`` # skipping sort

### Operating on fields

- ``cut`` : remove sections from each line of files

This establishes the comma as the deliminator (field separator) and prints out the second field of the cities.txt file, which is the list of states. Here the field separator is ``-d`` and the key indicator is declared with ``-f``. This line cuts the second field out:

```
cut -d, -f2 cities.txt
```

- ``paste`` : merge lines of files

Our goal here is to create output that only reports the city and state names. In the fourth line, I use what's called [process substitution][4]. This applies the ``fmt`` command on the output of the command (or process) in the parentheses.

```
cut -d, -f1 cities.txt > city_names.txt
cut -d, -f2 cities.txt > state_names.txt
paste city_names.txt state_names.txt
fmt <(paste city_names.txt state_names.txt)
rm city_names.txt state_names.txt
```

Again using **process substitution**, we can do the above with one line and avoid creating extra files like *city_names.txt* and *state_names.txt*:

```
paste -d, <(cut -d, -f1 cities.txt) <(cut -d, -f2 cities.txt)
```

- ``join`` : join lines of two files on a common field

The ``join`` command generally requires files to be sorted first. Using the
same kind of logic as we did above, by redirecting standard output to temp
files and then joining them based on the unique column of data in each one,
which is the state column, happens to be column two in both **cities.txt** and
**capitals.txt**. The ``join`` command declares the first file with ``-1`` and
the second column in that file with ``2``. Then the second file with ``-2`` and
the second column in the second file with ``2``. 

```
sort -t, -k2 cities.txt > cities_sorted.txt
sort -t, -k2 capitals.txt > capitals_sorted.txt
join -t, -1 2 -2 2 cities_sorted.txt capitals_sorted.txt > tables.txt
cat tables.txt
rm cities_sorted.txt capitals_sorted.txt
```

Or, using **process substitution** again, we can make this a one-liner, albeit
a long line:

```
join -t, -1 2 -2 2 <(sort -t, -k2 cities.txt) <(sort -t, -k2 capitals.txt) > tables.txt
```

### Operating on characters

- ``tr`` : translate or delete characters

The ``tr`` command requires that we redirect standard input from a file, but we can also do it from the screen. 

Capitalize all the words in a file called 'tables.txt':

```
tr a-z A-Z < tables.txt
```

Or, capitalize all the words after we them in on the screen. After you've written the last line (below it's 'thanks'), press control-D and the output will be converted:

```
tr a-z A-Z | cat
hello
how are you
thanks
HELLO
HOW ARE YOU
THANKS
```

Translate commas into newlines first and then tabs next:

```
tr , '\n' < tables.txt
tr , '\t' < tables.txt
```

Delete all numerals:

```
tr -d 0-9 < tables.txt
```

Convert tabs to spaces, or vice versa:

- ``expand`` : convert tabs to spaces
- ``unexpand`` : convert spaces to tabs

```
tr , '\t' < tables.txt > tables2.txt
expand tables2.txt > tables3.txt
tr -d '\t' < tables2.txt   # these are tabs so they're deleted
tr -d '\t' < tables3.txt   # these aren't tab so not deleted
```

[1]:https://www.linux.com/tutorials/linux-filesystem-explained/
[2]:https://www.gnu.org/software/coreutils/
[3]:https://www.gnu.org/software/coreutils/manual/coreutils.html
[4]:https://tldp.org/LDP/abs/html/process-sub.html
