# Regular Expressions

Oftentimes, as systems administrators,
we will need to search the contents of a file, like a log file.
One of the commands that we use to do that is the ``grep`` command.
We have already discussed using the ``grep`` command,
which is not unlike doing any kind of search,
such as in Google.
The command simply involves running ``grep``
along with the search string and against a file.

## Multiword strings

It's good habit to include search strings within quotes,
but this is especially important if
we would search for multiword strings.
In these cases, we must enclose them in quotes.

**Command:**

```
cat cities.csv
```

**Output:**

```
City              | 2020 Census | Founded
New York City, NY | 8804190     | 1624
Los Angeles, CA   | 3898747     | 1781
Chicago, IL       | 2746388     | 1780
Houston, TX       | 2304580     | 1837
Phoenix, AZ       | 1624569     | 1881
Philadelphia, PA  | 1576251     | 1701
San Antonio, TX   | 1451853     | 1718
San Diego, CA     | 1381611     | 1769
Dallas, TX        | 1288457     | 1856
San Jose, CA      | 983489      | 1777
```

**Command:**

```
grep "San Antonio" cities.csv
```

**Output:**

```
San Antonio, TX | 1451853 | 1718
```

## Whole words, case sensitive by default

As a reminder,
``grep`` commands are case-sensitive
by default, and
since the contents of **cities.csv**
are all in lowercase,
if I run the above command without
the city named capitalized,
then ``grep`` will return nothing:

**Command:**

```
grep "san antonio" cities.csv
```

In order to tell grep to ignore case,
I need to use the ``-i`` option.
We also want to make sure that
we enclose our entire search string
withing double quotes.

This is a reminder for you to run ``man grep`` and
to read through the documentation and
see what the various options exit for this command.

**Command:**

```
grep -i "san antonio" cities.csv
```

**Output:**

```
San Antonio, TX   | 1451853     | 1718
```

### Whole words by the edges

To search whole words,
we can use special characters
to match strings at the start
and/or the end of words.
For example, note the output
if I search for cities
in California in my file by
searching for the string **ca**.
Since this string appears
in Chi**ca**go,
then that city matches my
grep search:

**Command:**

```
grep -i "ca" cities.csv
```

**Output:**

```
Los Angeles, CA   | 3898747     | 1781
Chicago, IL       | 2746388     | 1780
San Diego, CA     | 1381611     | 1769
San Jose, CA      | 983489      | 1777
```

To limit results to only **CA**,
we can enclose our search in
certain special characters:

**Command:**

```
grep -i "\bca\b" cities.csv
```

**Output:**

```
Los Angeles, CA   | 3898747     | 1781
San Diego, CA     | 1381611     | 1769
San Jose, CA      | 983489      | 1777
```

We can reverse that output
and look for strings within
other words.
Here is an example of searching
for the string **ca** within words:

**Command:**

```
grep -i "\Bca\B" cities.csv
```

**Output:**

```
Chicago, IL       | 2746388     | 1780
```

## Bracket Expressions and Character Classes

In conjunction with
the ``grep`` command,
we can also use regular expressions
to search for more general patterns
in text files.
For example, we can use **bracket expressions** and
**character classes** to search
for patterns in the text.
Here again using ``man grep``
is very important because
it includes instructions on
how to use these regular expressions.

### Bracket expressions

From ``man grep`` on **bracket expressions**:

> A  bracket  expression  is  a  list  of  characters  enclosed  by  [ and ].
> It matches any single character in that list.  If the first character of the
> list is the caret ^ then it matches any character not in the list ... For
> example, the regular expression [0123456789] matches any single digit.

> Within a bracket expression, a range expression consists of two characters
> separated by a hyphen. It matches any single character that sorts between the
> two characters

To see how this works,
let's search the **cities.csv** file
for letters matching **A, B, or C**.
Specifically in the following command
I use a hyphen to match
any characters **in** the range A, B, C.
The output does not include
the cities **Houston** or **Dallas**
since neither of those lines contain
capital **A, B, or C** characters:

**Command:**

```
grep "[A-C]" cities.csv 
```

**Output:**

```
City              | 2020 Census | Founded
New York City, NY | 8804190     | 1624
Los Angeles, CA   | 3898747     | 1781
Chicago, IL       | 2746388     | 1780
Phoenix, AZ       | 1624569     | 1881
Philadelphia, PA  | 1576251     | 1701
San Antonio, TX   | 1451853     | 1718
San Diego, CA     | 1381611     | 1769
San Jose, CA      | 983489      | 1777
```

### Bracket expressions, inverse searches

When placed after the first bracket,
the carat key acts as a Boolean NOT.
The following command matches any
characters **not in** the range A,B,C:

**Command:**

```
grep "[^A-C]" cities.csv
```

However, the output matches
all lines since there are no
instances of **A, B, and C**
in all lines:

**Output:**

```
City              | 2020 Census | Founded
New York City, NY | 8804190     | 1624
Los Angeles, CA   | 3898747     | 1781
Chicago, IL       | 2746388     | 1780
Houston, TX       | 2304580     | 1837
Phoenix, AZ       | 1624569     | 1881
Philadelphia, PA  | 1576251     | 1701
San Antonio, TX   | 1451853     | 1718
San Diego, CA     | 1381611     | 1769
Dallas, TX        | 1288457     | 1856
San Jose, CA      | 983489      | 1777
```

#### Process substitution

We can confirm that output
from the first command
does not include Houston or Dallas
in the second command by comparing
the outputs of the two commands 
using **process substitution**.
This is a technique that pipes
the standard output of multiple
commands to be processed by
another command.
Here I use the ``diff`` command
to compare the output of both
``grep`` commands:

**Command:**

```
diff <(grep "[A-C]" cities.csv) <(grep "[^A-C]" cities.csv)
```

The ``diff`` output shows
that the second ``grep``
command includes the
two lines below that
are not in the output
of the first ``grep`` command: 

**Output:**

```
4a5
> Houston, TX       | 2304580     | 1837
8a10
> Dallas, TX        | 1288457     | 1856
```

> The output of the ``diff`` command is nicely explained in this [Stack
> Overflow][diffStack] answer.

Try this command for an alternate output:

```
diff -y <(grep "[A-C]" cities.csv) <(grep "[^A-C]" cities.csv)
```

Our ranges may be alphabetical or numerical.
The following command matches any numbers **in** the range 1,2,3:

**Command:**

```
grep [1-3] cities.csv
```

Since all single digits appear
in the file, the above command
returns all lines.
To invert the search,
we can use the following
grep command.
This will match all non-integers:

**Command:**

```
grep [^0-9] cities.csv
```

### Bracket expressions, carat preceding the bracket

We saw in a previous
section that the carat ``^``
key indicates
the start of line;
however, we learned above
that it is used to
return the inverse of a string.
To use the carat to signify
the start of a line,
the carat key must precede
the opening bracket.
For example, the following command matches
any lines that start with the upper case letters
within the range of **N,O,P**:

**Command:**

```
grep ^[N-P] cities.csv
```

**Output:**

```
New York City, NY | 8804190 | 1624
Phoenix, AZ       | 1624569 | 1881
Philadelphia, PA  | 1576251 | 1701
```

And we can reverse that
with the following command,
which returns all lines
that **do not** start with
**N,O, or P**:

**Command:**

```
grep ^[^N-P] cities.csv
```

**Output:**

```
City            | 2020 Census | Founded
Los Angeles, CA | 3898747     | 1781
Chicago, IL     | 2746388     | 1780
Houston, TX     | 2304580     | 1837
San Antonio, TX | 1451853     | 1718
San Diego, CA   | 1381611     | 1769
Dallas, TX      | 1288457     | 1856
San Jose, CA    | 983489      | 1777
```

### Character classes

Character classes are special
types of predefined 
bracket expressions.
They make it easy to
search for general patterns.
From ``man grep`` on **character classes**:

> Finally, certain named classes of characters are predefined
> within bracket expressions, as follows.
> Their names are self explanatory, and they are
> [:alnum:], [:alpha:], [:blank:], [:cntrl:],
> [:digit:], [:graph:], [:lower:], [:print:],
> [:punct:], [:space:], [:upper:], and [:xdigit:].
> For example, [[:alnum:]] means the character class
> of numbers and letters ... 

Here I search for anything
that matches the Year column.
Specifically, I search for
a empty space ``[[:blank:]]``,
a four digit string ``[[:digit:]]{4}``.
The ``{4}`` means
"The preceding item is matched
exactly 4 times" (``man grep``),
and the number 4 can be replaced
with any relevant number.
and an end of line ``$``:

**Command:**

```
grep -Eo "[[:blank:]][[:digit:]]{4}$" cities.csv 
```

**Output:**

```
 1624
 1781
 1780
 1837
 1881
 1701
 1718
 1769
 1856
 1777
```

In the above command, the ``[[:blank:]]``
can be excluded and
we'd still retrieve the desired results because
we've included the dollar sign to
mark the end of the line, but
I include it here for demonstration purposes.
Note that I also added the ``-E`` option.
This is required for character classes.

## Anchoring

As seen above,
outside of
bracket expressions and character classes,
we use the caret ``^``
to mark the beginning of a line.
We can also use the ``$``
to match the end of a line.
Using either (or both)
is called **anchoring**.
Anchoring works in many places.
For example, to search all lines
that start with capital **D through L**

**Command:**

```
grep "^[D-L]" cities.csv
```

**Output:**

```
Los Angeles, CA | 3898747 | 1781
Houston, TX     | 2304580 | 1837
Dallas, TX      | 1288457 | 1856
```

And all lines that end with the numbers **4, 5, or 6**:

**Command:**

```
grep "[4-6]$" cities.csv
```

**Output:**

```
New York City, NY | 8804190 | 1624
Dallas, TX        | 1288457 | 1856
```

We can use both anchors in
our ``grep`` commands.
The following searches
for any lines starting
with capital letters ranging
from D through L and any lines
ending with the numbers
starting from 4 through 6.
The single dot stands for any character,
and the asterisk stands for
"the preceding character will
zero or more times" (``man grep``).

**Command:**

```
grep "^[D-L].*[4-6]$" cities.csv
```

**Output:**

```
Dallas, TX        | 1288457     | 1856
```

## Repetition

If we want to use regular expressions to identify repetitive patterns,
then we can use repetition operators.
As we saw above,
the most useful one is the ``*`` asterisk.
But there are other options:

In come cases, we need to add the -E option
to extend ``grep``'s regular expression functionality:

Here, the preceding item **S** is matched one or more times:

**Command:**

```
grep -E "S+" cities.csv
```

**Output:**

```
San Antonio, TX | 1451853 | 1718
San Diego, CA   | 1381611 | 1769
San Jose, CA    | 983489  | 1777
```

In the next search,
the preceding item **l** is
matched exactly 2 times:

**Command:**

```
grep -E "l{2}" cities.csv
```

**Output:**

```
Dallas, TX | 1288457 | 1856
```

Finally, in this example,
the preceding item **7** is matched 
at least two times or
at most three times:

**Command:**

```
grep -E "7{2,3}" cities.csv
```

**Output:**

```
San Jose, CA | 983489 | 1777
```

## OR searches

We can use the vertical bar ``|``
to do a Boolean OR search.
In a Boolean OR statement,
the statement is True if either
one part is true,
the other part is true,
or both are true.
In a search statement,
this means that at least one part
of the search is true.

The following will return lines
for each city because they
both appear in the file:

**Command:**

```
grep -E "San Antonio|Dallas" cities.csv
```

**Output:**

```
San Antonio, TX | 1451853 | 1718
Dallas, TX      | 1288457 | 1856
```

The following will match
San Antonio even though
Lexington does not appear
in the file:

**Command:**

```
grep -E "San Antonio|Lexington" cities.csv
```

**Output:**

```
San Antonio, TX   | 1451853     | 1718
```

## Conclusion

We covered a lot in this section on ``grep`` and regular expressions.

We specifically covered:

- multiword strings
- whole word searches and case sensitivity
- bracket expressions and character classes
- anchoring
- repetition
- Boolean OR searches

Even though we focused on ``grep``,
many these regular expressions work
across many programming languages.

See [Regular-Expression.info][regexInfo] for
more in-depth lessons on regular expressions.

[diffStack]:https://unix.stackexchange.com/a/216131
[regexInfo]:https://www.regular-expressions.info/
