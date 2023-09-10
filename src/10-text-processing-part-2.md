# Text Processing: Part 2

## Introduction

In the last section, we covered the
``cat``, ``cut``, ``head``, ``sort``, ``tail``, ``uniq``, and ``wc`` utilities.

We also learned about the ``|`` pipe operator,
which we use to redirect **standard output**
from one command
to a second command so that second command
can process the output from the first command.
An example is:

```
sort file.txt | uniq
``` 

This sorts the lines in a file named **file.txt** and
then prints to standard output only the unique lines
(by the way, files must be sorted before piped to ``uniq``).

We learned about the ``>`` and ``>>`` redirect operators.
They work like the pipe operator, but
instead of directing output to a new command
for the new command to process,
they direct output to a file for saving.
As a reminder,
the single redirect ``>`` overwrites a file or creates a file
if it does not exist.
The double redirect ``>>`` appends to a file or
creates a file if it does not exist.
It's safer to use the double redirect, but
if you are processing large amounts of data,
it could also mean creating large files really quickly.
If that gets out of hand,
then you might crash your system.
To build on our prior example,
we can add ``>>`` to send the output to
a new file called **output.txt**:

```
sort file.txt | uniq >> output.txt
```

We have available more powerful utilities and programs
to process, manipulate, and analyze text files.
In this section, we will cover the following three of these:

- ``grep`` : print lines that match patterns
- ``sed``  : stream editor for filtering and transforming text
- ``awk``  : pattern scanning and text processing language

## Grep

The ``grep`` command is one of my most often used commands.
Basically, ``grep`` "prints lines that match patterns"
(see ``man grep``).
In other words, it's search, and
it's super powerful.

``grep`` works line by line.
So when we use it to search a file for a **string** of text,
it will return the whole line that matches the string.
This **line by line** idea is part of the history of
Unix-like operating systems,
and it's super important to remember that most utilities
and programs that we use on the commandline
are line oriented.

> "A string is any series of characters that are interpreted
> literally by a script. For example, 'hello world' and 'LKJH019283'
> are both examples of strings." -- [Computer Hope][computerhope].
> More generally, it's the literal characters that we type. It's data.

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

If we want to search for the string **Chrome**,
we can use ``grep``.
Notice that even though the string **Chrome** only appears once,
and in one part of a line,
``grep`` returns the entire line.

**Command:**

```
grep "Chrome" operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
```

Be aware that, by default, ``grep`` is case-sensitive,
which means a search for the string **chrome**,
with a lower case **c**,
would return no results.
Fortunately, ``grep`` has an ``-i`` option,
which means to ignore the case of the search string.
In the following examples, ``grep`` returns nothing in the first search
since we do not capitalize the string **chrome**.
However, adding the ``-i`` option results in success:

**Command:**

```
grep "chrome" operating-systems.csv
```

**Output:**

None.

**Command:**

```
grep -i "chrome" operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
```

We can also search for lines that **do not** match our string 
using the ``-v`` option.
We can combine that with the ``-i`` option to ignore the string's case.
Therefore, in the following example,
all lines that do not contain the string **chrome** are returned:

**Command:**

```
grep -vi "chrome" operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

I used the ``tail`` command in the prior section to show
how we might use ``tail`` to remove the header (1st line) line in a file,
but it's an odd use of the ``tail`` command,
which normally just returns the last lines of a file.
Instead, we can use ``grep`` to remove the first line.
To do so, we use what's called a **regular expression**,
or **regex** for short.
Regex is a method used to identify patterns in text via abstractions.
They can get complicated, but we can use some easy regex methods.

Let's use a version of the above file with the header line:

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

To use ``grep`` to remove the first line of a file,
we can invert our search to select all lines not matching
"OS" at the start of a line.
Here the carat key ``^`` is a **regex** indicating the
start of a line.
Again, this ``grep`` command returns all lines that
do not match the string **os** at the start of a line,
ignoring case:

**Command:**

```
grep -vi "^os" operating-systems.csv
```

**Output**:

```
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

Alternatively, since we know that the string **Year** comes
at the end of the first line,
we can use ``grep`` to invert search for that.
Here the dollar sign key ``$`` is a **regex** indicating the
end of a line.
Like the above, this ``grep`` command returns all lines that
do not match the string **year** at the end of a line,
ignoring case:

**Command**:

```
grep -vi "year$" operating-systems.csv
```

**Output**:

```
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

The ``man grep`` page lists other options,
but a couple of other good ones include:

Get a count of the matching lines with the ``-c`` option:

**Command:**

```
grep -ic "proprietary" operating-systems.csv
```

**Output**:

```
4
```

Print only the match and not the whole line with the ``-o`` option:

**Command:**

```
grep -io "proprietary" operating-systems.csv
```

**Output:**

```
Proprietary
Proprietary
Proprietary
Proprietary
```

We can simulate a Boolean OR search, and
print lines matching one or both strings
using the ``-E`` option.
We separate the strings with a vertical bar ``|``.
This is similar to a Boolean OR search
since there's at least one match in the following string,
there is at least one result.

Here is an example where only one string
returns a true value:

**Command:**

```
grep -Ei "bsd|atari" operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
```

Here's an example where both strings evaluate to true:

**Command:**

```
grep -Ei "bsd|gpl" operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
Linux, GPL, 1991
```

By default, ``grep`` will return results where the
string appears within a larger word,
like **OS** in **macOS**.

**Command:**

```
grep -i "os" operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
iOS, Proprietary, 2007
macOS, Proprietary, 2001
```

However, we might want to limit results so that
we only return results where **OS** is a complete word.
To do that, we can surround the string with
special characters:

**Command:**

```
grep -i "\<os\>" operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
```

Sometimes we want the context for a result;
that is,
we might want to print lines that surround our matches.
For example, print the matching line plus the two lines
after the matching line using the ``-A NUM`` option:

**Command:**

```
grep -i "chrome" -A 2 operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
```

Or, print the matching line plus the two lines
before the matching line using the ``-B NUM`` option:

**Command**

```
grep -i "android" -B 2 operating-systems.csv
```

**Output:**

```
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

We can combine many of the variations.
Here I search for the whole word **BSD**,
case insensitive, and
print the line before and the line after
the match:

**Command:**

```
grep -i -A 1 -B 1 "\<bsd\>" operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
```

``grep`` is very powerful, and
there are more options listed in its ``man`` page.

> Note that I enclose my search strings in double quotes.
> For example: ``grep "search string" filename.txt``
> It's not always required to enclose a search string
> in double quotes,
> but it's good practice because
> if your string contains more than one word or
> empty spaces, the search will fail.

## Sed

``sed`` is a type of non-interactive text editor
that filters and transforms text (``man sed``).
By default ``sed`` works on **standard output**,
and edits can be redirected (``>`` or ``>>``) to new files
or, more appropriately,
made **in-place** using the ``-i`` option.

Like the other utilities and programs we've covered,
including ``grep``,
``sed`` works line by line.
But unlike ``grep``,
``sed`` provides a way to **address**
specific lines or ranges of lines,
and then run filters or transformations on those lines.
Once the lines in a text file have been identified or addressed,
``sed`` offers a number of commands to filter or transform the text
at those specific lines.

This concept of the line address is important, but
not all text files are explicitly numbered by each line.
Below I use the ``nl`` command to number lines in our file,
even though the contents of the file do not actually display line numbers:

**Command:**

```
nl operating-systems.csv
```

**Output:**

```
     1	OS, License, Year
     2	Chrome OS, Proprietary, 2009
     3	FreeBSD, BSD, 1993
     4	Linux, GPL, 1991
     5	iOS, Proprietary, 2007
     6	macOS, Proprietary, 2001
     7	Windows NT, Proprietary, 1993
     8	Android, Apache, 2008
```

After we've identified the lines in a file that we want to edit,
``sed`` offers commands to filter, transform, or edit
the text at the line addresses.
Some of these commands include:

- ``a`` : appending text
- ``c`` : replace text
- ``d`` : delete text
- ``i`` : inserting text
- ``p`` : print text
- ``r`` : append text from file
- ``s`` : substitute text
- ``=`` : print the current line number

Let's see how to use ``sed`` to print line numbers
instead of using the ``nl`` command.
To do so, we use the equal sign ``=`` to
identify line numbers
(although note that it places the line numbers
just above each line):

**Command:**

```
sed '=' operating-systems.csv
```

**Output:**

```
1
OS, License, Year
2
Chrome OS, Proprietary, 2009
3
FreeBSD, BSD, 1993
4
Linux, GPL, 1991
5
iOS, Proprietary, 2007
6
macOS, Proprietary, 2001
7
Windows NT, Proprietary, 1993
8
Android, Apache, 2008
```

In the last section,
we used the ``tail`` command to
remove the header line of our file, and above,
we used ``grep`` to accomplish this task.
It's much easier to use ``sed``
to remove the header line of the **operating-systems.csv**.
We simply specify the line number (``1``) and
then use the delete command (``d``).
Thus, we delete line 1:

**Command:**
 
```
sed '1d' operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

> Note that I use single apostrophes for the ``sed`` command.
> This is required.

If I wanted to make that a permanent deletion,
then I would use the ``-i`` option,
which means that I would edit the file **in-place**
(see ``man sed``):

**Command:**

```
sed -i '1d' operating-systems.csv
```

To refer to line **ranges**,
I add a comma between **addresses**.
Therefore, to edit lines 1, 2, and 3:

**Command:**

```
sed '1,3d' operating-systems.csv
```

**Output:**

```
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

I can use ``sed`` to **find and replace** strings.
The syntax for this is:

```
sed 's/regexp/replacement/' filename.txt
```

The **regexp** part of the above command can take
regular expressions, but
simple strings like words work here, too,
since they are treated as
regular expressions themselves.

In the next example,
I use ``sed`` to search for the string "Linux",
and replace it with the string "GNU/Linux":

**Command:**

```
sed 's/Linux/GNU\/Linux/' operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
GNU/Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

> Because the string **GNU/Linux** contains a forward slash, and because
> ``sed`` uses the forward slash as a separator, note that I **escaped** the
> forward slash with a back slash. This escape tells ``sed`` to interpret the
> forward slash in **GNU/Linux** literally and not as a special ``sed``
> character.

If we want to add new rows to the file,
we can append ``a`` or insert ``i``
text after or at specific lines:

To append text **after line 3**, use ``a``:

**Command:**

```
sed '3a FreeDOS, GPL, 1998' operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
FreeDOS, GPL, 1998
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

To insert **at line 3**, use ``i``:

**Command:**

```
sed '3i CP\/M, Proprietary, 1974' operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
CP/M, Proprietary, 1974
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

Note that the FreeDOS line doesn't appear
in the last output.
This is because I didn't use the ``-i`` option nor 
did I redirect output to a new file.
If we want to edit the file **in-place**,
that is, save the edits,
then the commands would look like so:

```
sed -i '3a FreeDOS, GPL, 1998' operating-systems.csv
sed -i '3i CP\/M, Proprietary, 1974' operating-systems.csv
```

Instead of using line numbers to specify
addresses in a text file,
we can use regular expressions as addresses,
which may be simple words.
In the following example,
I use the regular expression ``1991$``
instead of specifying line 4.
The regular expression ``1991$``  means
"lines ending with the string **1991**".
Then I use the ``s`` command to start a find and replace.
``sed`` finds the string **Linux** and then replaces
that with the string **GNU/Linux**.
I use the back slash to escape the
forward slash in GNU/Linux: 

**Command:**

```
sed '/1991$/s/Linux/GNU\/Linux/' operating-systems.csv
```

**Output:**

```
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
GNU/Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

Here's an example using ``sed`` to
simply search for a pattern.
In this example,
I'm interested in searching for all operating systems
that were released on or after 2000:

**Command:**

```
sed -n '/20/p' operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Android, Apache, 2008
```

The above would be equivalent to
``grep "20" operating-systems.csv``.

``sed`` is much more powerful than
what I've demonstrated here, and
if you're interested in learning more,
there are lots of tutorials on the web.
Here are a few good ones:

- [Learn to use the Sed text editor][learnSed]
- [Sed Introduction][gnuSed] 
- [Sed One-Liners Explained, Part I: File Spacing, Numbering and Text Conversion and Substitution][sedCatonmat]
- [sed one-liners][sedoneliners]
- [Sed Tutorial][sedTutorial]

## Awk

``awk`` is a complete scripting language designed for
"pattern scanning and processing" text.
It generally performs some **action** when
it detects some **pattern** and
is particularly suited for **columns of structured data**
(see ``man awk``).

``awk`` works on columns 
regardless if the contents include structured data 
(like a CSV file) or not (like a letter or essay).
If the data is structured,
then that means the data will be formatted in some way.
In the last few sections,
we have looked at a CSV file.
This is structured data because the data points 
in this file are separated by commas.

For ``awk`` to work with columns in a file,
it needs some way to refer to those columns.
In the examples below, we'll see that columns in a text 
file are referred to by a dollar sign and
then the number of the column ``$n``.
So, ``$1`` indicates column one, 
``$2`` indicates column two, and so on.
If we use ``$0``, then we refer to the entire file.
In our example text file,
``$1`` indicates the OS Name column,
``$2`` indicates the License column,
``$3`` indicates the release Year column,
and ``$0`` indicates all columns.

The syntax for ``awk`` is a little different
than what we've seen so far.
Basically, ``awk`` uses the following syntax,
where **pattern** is optional.

```
awk pattern { action statements }
```

Let's see some examples.

To print the first column of our file,
we do not need the **pattern** part of the command but
only need to state an action statement
(within curly braces).
In the command below,
the action statement is ``'{ print $1 }'``.

**Command:**

```
awk '{ print $1 }' operating-systems.csv
```

**Output:**

```
OS,
Chrome
FreeBSD,
Linux,
iOS,
macOS,
Windows
Android,
```

By default,
``awk`` considers the first empty space
as the field delimiter.
That's why in the command above
only the term **Windows** and **Chrome** appear in the results
even though it should be **Windows NT** and **Chrome OS**.
It's also why we see commas in the output.
To fix this,
we tell ``awk`` to use a comma as the field separator,
instead of the default empty space.
To specify that we want ``awk``
to treat the comma as a field delimiter,
we use the ``-F`` option, and
we surround the comma with single quotes:

**Command:**

```
awk -F',' '{ print $1 }' operating-systems.csv
```

**Output:**

```
OS
Chrome OS
FreeBSD
Linux
iOS
macOS
Windows NT
Android
```

By specifying the comma as the field separator,
our results are more accurate,
and the commas no longer appear either.

Like ``grep`` and ``sed``,
``awk`` can do search.
In this next example,
I print the column containing the string **Linux**.
Here I am using the **pattern** part
of the command: ``'/Linux/'``.

**Command:**

```
awk -F',' '/Linux/ { print $1 }' operating-systems.csv
```

**Output:**

```
Linux
```

Note how ``awk`` does not return the whole
line but only the match.

With ``awk``,
we can retrieve more than one column, and
we can use ``awk`` to generate reports,
which was part of the original motivation
to create this language.

In the next example,
I select columns two and one in that order,
which is something the ``cut`` command cannot do.
I also add a space between the columns
using the double quotes to surround an empty space,
and I modified the field delimiter to include both
a comma and a space to get the output that I want:

**Command:**

```
awk -F', ' '{ print $2 " " $1 }' operating-systems.csv
```

**Output:**

```
License OS
Proprietary Chrome OS
BSD FreeBSD
GPL Linux
Proprietary iOS
Proprietary macOS
Proprietary Windows NT
Apache Android
```

I can make output more readable by adding
text to print:

**Command:**

```
awk -F',' '{ print $1 " was released in" $3 "." }' operating-systems.csv
```

**Output:**

```
OS was released in Year.
Chrome OS was released in 2009.
FreeBSD was released in 1993.
Linux was released in 1991.
iOS was released in 2007.
macOS was released in 2001.
Windows NT was released in 1993.
Android was released in 2008.
```

Since ``awk`` is a full-fledged programming language,
it understands data structures,
which means it can do math or work on strings of text.
Let's illustrate this by doing some math
or logic on column 3.

Here I print all of column three:

**Command:**

```
awk -F',' '{ print $3 }' operating-systems.csv
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

Next I print only the parts of column three that
are greater than 2005, and
then pipe ``|`` the output through the ``sort`` command
to sort the numbers in numeric order:

**Command:**

```
awk -F',' '$3 > 2005 { print $3 }' operating-systems.csv | sort
```

**Output:**

```
 2007
 2008
 2009
```

If I want to print only the parts of column one where
column three equals to 2007,
then I would run this command:

**Command:**

```
awk -F',' '$3 == 2007 { print $1 }' operating-systems.csv
```

**Output:**

```
iOS
```

If I want to print only the parts of columns one and three
where column 3 equals 2007:

**Command:**

```
awk -F',' '$3 == 2007 { print $1 $3 }' operating-systems.csv
```

**Output:**

```
iOS 2007
```

Or, print the entire line where column three equals 2007:

**Command:**

```
awk -F',' '$3 == 2007 { print $0 }' operating-systems.csv
```

**Output:**

```
iOS, Proprietary, 2007
```

I can print only those lines where column three
is greater than 2000 and less than 2008:

**Command:**

```
awk -F',' '$3 > 2000 && $3 < 2008 { print $0 }' operating-systems.csv
```

**Output:**

```
iOS, Proprietary, 2007
macOS, Proprietary, 2001
```

Even though we wouldn't normally sum years,
let's print the sum of column three 
to demonstrate how summing works in ``awk``:

**Command:**

```
awk -F',' 'sum += $3 { print sum }' operating-systems.csv
```

**Output:**

```
2009
4002
5993
8000
10001
11994
14002
```

Here are a few basic string operations.
First, print column one in upper case:

**Command:**

```
awk -F',' '{ print toupper($1) }' operating-systems.csv
```

**Output:**

```
OS
CHROME OS
FREEBSD
LINUX
IOS
MACOS
WINDOWS NT
ANDROID
```

Or print column on in lower case:

**Command:**

```
awk -F',' '{ print tolower($1) }' operating-systems.csv
```

**Output:**

```
os
chrome os
freebsd
linux
ios
macos
windows nt
android
```

Or, get the length of each string in column one:

**Command:**

```
awk -F',' '{ print length($1) }' operating-systems.csv
```

**Output:**

```
2
9
7
5
3
5
10
7
```

We can add additional logic.
The double ampersands ``&&`` indicate a
Boolean/Logical **AND**.
The exclamation point ``!`` indicates a
Boolean/Logical **NOT**.
In the next example,
I print only those lines where
column three is greater than 1990,
and the line has the string "BSD" in it:

**Command:**

```
awk -F',' '$3 > 1990 && /BSD/ { print $0 }' operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
```

Now I reverse that, and
print only those lines where column three
is greater than 1990
and the line DOES NOT have the string "BSD" in it:

**Command:**

```
awk -F',' '$3 > 1990 && !/BSD/ { print $0 }' operating-systems.csv
```

**Output:**
 
```
Chrome OS, Proprietary, 2009
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

The double vertical bar ``||`` indicates
a Boolean/Logical **OR**.
The next command prints only those lines that
contain the string "Proprietary"
or the string "Apache",
or it would print both if both strings were in the text:

**Command:**

```
awk -F',' '/Proprietary/ || /Apache/ { print $0 }' operating-systems.csv
```
**Output:**

```
Chrome OS, Proprietary, 2009
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

I can take advantage of regular expressions.
If the file that I was looking at was large,
and if I wasn't sure that some fields
would be upper or lower case,
then I could use regular expressions
to consider both possibilities.
That is, by adding **[pP]** and **[aA]**,
``awk`` will check for both the words **Proprietary**
and **proprietary**,
and **Apache** and **apache**.

**Command:**

```
awk -F',' '/[pP]roprietary/ || /[aA]pache/ { print $0 }' operating-systems.csv
```

**Output:**

```
Chrome OS, Proprietary, 2009
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

``awk`` is full-fledged programming language.
It provides conditionals, control structures, variables, etc.,
and so I've only scratched the surface.
If you're interested in learning more,
then check out some of these tutorials:

- [Awk Command][awkCommand]
- [Awk One-Liners Explained, Part I: File Spacing, Numbering and Calculations][awkCatonmat]
- [Awk Tutorial][awkTutorial]
- [How To Become a 10x Engineer using the Awk Command][awk10]
- [Linux/BSD command line wizardry: Learn to think in sed, awk, and grep][awkArs]
- [Understanding AWK][understandingAwk]

## Conclusion

The Linux (and other Unix-like OSes) command line
offers a lot of utilities to examine data.
Prior to this lesson, we covered a few of
them that help us get
parts of a file and then pipe those parts
through other commands
or redirect output to files.
We can use pipes and redirects with
``grep``, ``sed``, and ``awk``.
If needed, we may be able to avoid using
the basic utilities like
``cut``, ``wc``, etc if want to learn more powerful programs
like ``grep``, ``sed``, and ``awk``.

It's fun to learn and practice these.
Despite this, you do not have to become
a ``sed`` or an ``awk`` programmer.
Like the utilities that we've discussed in prior lectures,
the power of programs like these is that their on hand and
easy to use as **one-liners**.
If you want to get started,
the resources listed above can guide you.

[awk10]:https://blog.robertelder.org/intro-to-awk-command/
[awkArs]:https://arstechnica.com/gadgets/2021/08/linux-bsd-command-line-101-using-awk-sed-and-grep-in-the-terminal/
[awkCatonmat]:https://catonmat.net/awk-one-liners-explained-part-one
[awkCommand]:https://www.tecmint.com/category/awk-command/
[awkoneliners]:https://catonmat.net/awk-one-liners-explained-part-one
[awkTutorial]:https://www.grymoire.com/Unix/Awk.html
[computerhope]:https://www.computerhope.com/jargon/s/string.htm
[gnuSed]:https://www.gnu.org/software/sed/manual/sed.html
[learnSed]:https://opensource.com/article/20/12/sed
[sedCatonmat]:https://catonmat.net/sed-one-liners-explained-part-one
[sedoneliners]:https://edoras.sdsu.edu/doc/sed-oneliners.html
[sedTutorial]:https://www.tutorialspoint.com/sed/index.htm
[understandingAwk]:https://earthly.dev/blog/awk-examples/
