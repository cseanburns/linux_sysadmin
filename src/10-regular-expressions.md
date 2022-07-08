# Grep and Regular Expressions

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

```
cat cities.csv
City | 2020 Census | Founded
New York City, NY | 8804190 | 1624
Los Angeles, CA | 3898747 | 1781
Chicago, IL | 2746388 | 1780
Houston, TX | 2304580 | 1837
Phoenix, AZ | 1624569 | 1881
Philadelphia, PA | 1576251 | 1701
San Antonio, TX | 1451853 | 1718
San Diego, CA | 1381611 | 1769
Dallas, TX | 1288457 | 1856
San Jose, CA | 983489 | 1777

grep "San Antonio" cities.csv
San Antonio, TX | 1451853 | 1718
```

## Whole words, case sensitive by default

However, ``grep`` can employ stricter and
more powerful syntax than a Google search.
Since the contents of **cities.csv** are all in lowercase,
if I run the above command without the city named capitalized,
then ``grep`` will return nothing:

```
grep "san antonio" cities.csv
```

In order to tell grep to ignore case,
I need to use the ``-i`` option.
This is a reminder for you to run ``man grep`` and
to read through the documentation and
see what the various options exit for this command.

```
grep -i "san antonio" cities.csv
```

## Bracket Expressions and Character Classes

In conjunction with the ``grep`` command,
we can also use regular expressions to search the content of text files.
For example, we can use what are called **bracket expressions** and
**character classes** to search for patterns in the text.
Here again using ``man grep`` is very important because
it includes instructions on how to use these regular expressions.

### Bracket expressions

From ``man grep`` on **bracket expressions**:

> A  bracket  expression  is  a  list  of  characters  enclosed  by  [ and ].
> It matches any single character in that list.  If the first character of the
> list is the caret ^ then it matches any character not in the list ... For
> example, the regular expression [0123456789] matches any single digit.

> Within a bracket expression, a range expression consists of two characters
> separated by a hyphen. It matches any single character that sorts between the
> two characters

To see how this works, let's search the **cities.csv** file
for letters matching **x, y, z**.
Specifically, the following command,
because we are using a hyphen,
matches any characters **in** the range x,y,z:

```
grep -i [x-z] cities.csv 
```

Since the carat key acts as a Boolean NOT
when placed **within the brackets**,
the following command matches any
characters **not in** the range x,y,z:

```
grep -i [^x-z] cities.csv
```

Our ranges may be alphabetical or numerical.
The following command matches any numbers **in** the range 1,2,3:

```
grep [1-3] cities.csv
```

Likewise, the following matches any numbers **not in** the range 1,2,3:

```
grep [^1-3] cities.csv
```

We saw previously that the carat ``^`` key indicates
the start of line.
This is true here,
if the carat key precedes the opening bracket.
For example, the following command matches
any lines that start with the upper case letters
within the range of **N,M,O,P**:

```
grep ^[N..P] cities.csv
New York City, NY | 8804190 | 1624
Phoenix, AZ | 1624569 | 1881
Philadelphia, PA | 1576251 | 1701
```

And we can reverse that with the following command:

```
grep ^[^N..P] cities.csv
City | 2020 Census | Founded
Los Angeles, CA | 3898747 | 1781
Chicago, IL | 2746388 | 1780
Houston, TX | 2304580 | 1837
San Antonio, TX | 1451853 | 1718
San Diego, CA | 1381611 | 1769
Dallas, TX | 1288457 | 1856
San Jose, CA | 983489 | 1777
```

### Character classes

Character classes are special types of predefined 
bracket expressions.
They make it easy to search for general data.
From ``man grep`` on **character classes**:

> Finally, certain named classes of characters are predefined
> within bracket expressions, as follows.
> Their names are self explanatory, and they are
> [:alnum:], [:alpha:], [:blank:], [:cntrl:],
> [:digit:], [:graph:], [:lower:], [:print:],
> [:punct:], [:space:], [:upper:], and [:xdigit:].
> For example, [[:alnum:]] means the character class
> of numbers and letters ... 

Here I search for anything that matches the Year column.
Specifically, I search for a blank (empty space) ``[[:blank:]]``,
a four digit string ``[[:digit:]]{4}``,
(the ``{4}`` means "The preceding item is
matched exactly 4 times" ``man grep``,
and the number 4 can be replaced with any relevant number).
and an end of line ``$``:

```
grep -Eo "[[:blank:]][[:digit:]]{4}$" cities.csv 
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

In the above command, the ``[[:blank:]]`` can be excluded and
we'd still retrieve the desired results, but
I include it here for demonstration purposes.

## Anchoring

As seen above, outside of bracket expansions and character classes,
we use the caret ``^`` to mark the beginning of a line.
We can also use the ``$`` to match the end of a line.
This is called **anchoring**.
Anchoring works in many places.
For example, search all lines that start with capital **D through L**

```
grep "^[D-L]" cities.csv
Los Angeles, CA | 3898747 | 1781
Houston, TX | 2304580 | 1837
Dallas, TX | 1288457 | 1856
```

And all lines that end with the numbers **4, 5, or 6**:

```
grep "[4-6]$" cities.csv
New York City, NY | 8804190 | 1624
Dallas, TX | 1288457 | 1856
```

```
grep "^[D-L].*[4-6]$" cities.csv
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

```
grep -E "S+" cities.csv
San Antonio, TX | 1451853 | 1718
San Diego, CA | 1381611 | 1769
San Jose, CA | 983489 | 1777
```

In this search, the preceding item **l** is
matched exactly 2 times:

```
grep -E "l{2}" cities.csv
Dallas, TX | 1288457 | 1856
```

Finally, in this example, the preceding item **7** is matched 
at least two times or at most three times:

```
grep -E "7{2,3}" cities.csv
San Jose, CA | 983489 | 1777
```

## OR searches

We can use the vertical bar ``|`` to do a Boolean OR search.
In a Boolean OR statement, the statement is True if either
one part is true, the other part is true, or both are true.
In a search statement, this means that at least one part
of the search is true.

The following will return lines for each city because they
both appear in the file:

```
grep -E "San Antonio|Dallas" cities.csv
San Antonio, TX | 1451853 | 1718
Dallas, TX | 1288457 | 1856
```

The following will return the San Antonio line even though
Lexington does not appear in the file:

```
grep -E "San Antonio|Lexington" cities.csv
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
many these regular expressions work across many programming languages.
