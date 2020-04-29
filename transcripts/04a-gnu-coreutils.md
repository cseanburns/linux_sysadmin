# Intro material

- Discuss the Podcast: [Command Line Heroes][3] by RedHat.
- Talk about the [latest episode][5] with an interview with [Brian Fox][6].
- Play the [Command Line Heroes Bash Game][4].
- The host of Command Line Heroes is Saron Yitbarek, who founded [CodeNewbie][7].

Start off with students demonstrating some Bash:

```
# Pick a random number between 1 and 15:
echo $((1 + RANDOM%15))
```

# GNU Coreutils

The GNU Coreutils, or the GNU Core Utilities, "are the basic file, shell and text manipulation utilities of the GNU operating system. These are the core utilities which are expected to exist on every operating system" ([Coreutils, GNU][1]).

In order to do good work on the command line, it's essential that we become familiar with these utilities that cover a range of commands. 

The online manual is located at [https://www.gnu.org/software/coreutils/manual/coreutils.html][2]. Read through it and practice! Look for examples on the web. The commands below were picked from the above online manual. Their descriptions were copied from the man page. E.g.:

```
man -f cat
cat (1)              - concatenate files and print on the standard output
```

We'll use the ``cities.txt`` file and the ``capitals.txt`` files in this
tutorial. If you login to SISED, you'll find copies of these files in
``/home/dropbox/``. You can copy those to your own directory like so (I'll explain this kind of command later):

```
cp /home/dropbox/*txt $HOME
```

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

Now you can test some of these commands out on these files. Be sure to read their respective manpages for their available options:

### Output entire files

- ``cat`` :  concatenate files and print on the standard output
- ``tac`` :  concatenate and print files in reverse
- ``nl`` :  number lines of files

### Formatting file contents

- ``fmt`` : simple optimal text formatter

### Output of parts of files

- ``head`` : output the first part of files
- ``tail`` : output the last part of files

### Summarizing files

- ``wc`` : print newline, word, and byte counts for each file
- ``md5sum`` : compute and check MD5 message digest
- ``sha256sum`` : compute and check SHA256 message digest

### Operating on sorted files


- ``sort`` : sort lines of text files

This does a numerical sort of the cities.txt file by the fourth column, which
is date founded column.

```
sort -t , -k 4n cities.txt
```

- ``uniq`` : report or omit repeated lines
- ``comm`` : compare two sorted files line by line

### Operating on fields

- ``cut`` : remove sections from each line of files

This establishes the comma as the deliminator (field separator) and prints out the second field of the cities.txt file, which is the list of states.

```
cut -d, -f2 cities.txt
```

- ``paste`` : merge lines of files

Our goal here is to create output that only reports the city and state names:

```
cut -d, -f1 cities.txt > city_names.txt
cut -d, -f2 cities.txt > state_names.txt
paste city_names.txt state_names.txt
rm city_names.txt state_names.txt
```

Or, using **process substitution**, we can do the above with one line and avoid creating extra files like *city_names.txt* and *state_names.txt*:

```
paste -d, <(cut -d, -f1 cities.txt) <(cut -d, -f2 cities.txt)
```

- ``join`` : join lines of two files on a common field

The ``join`` command generally requires files to be sorted first. Using the
same kind of logic as we did above, by redirecting standard output to temp
files and then joining them based on the unique column of data in each one,
which is the state column:

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

Translate commas into newlines, tabs:

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
tr -d '\t' < tables3.txt   # these aren't tables so not deleted
```

[1]:https://www.gnu.org/software/coreutils/
[2]:https://www.gnu.org/software/coreutils/manual/coreutils.html
[3]:https://www.redhat.com/en/command-line-heroes
[4]:https://www.redhat.com/en/command-line-heroes/bash
[5]:https://www.redhat.com/en/command-line-heroes/season-3/heroes-in-a-bash-shell
[6]:https://en.wikipedia.org/wiki/Brian_Fox_(computer_programmer)
[7]:https://www.codenewbie.org/
