# Regular Expressions with `grep`

By the end of this section, you will:

1. **Understand the purpose of `grep`**: Recognize the versatility of `grep` for searching through text and its use in filtering output, searching for patterns in files, and extracting relevant data.
2. **Perform basic searches using `grep`**: Search for multiword strings and whole words while understanding how to handle case sensitivity and word boundaries.
3. **Utilize regular expressions**: Apply regular expressions with `grep` to search for more complex text patterns, using features like bracket expressions, character classes, and anchoring.
4. **Leverage repetition and OR operators**: Use repetition operators (e.g., `*`, `+`) and Boolean OR searches to find repetitive patterns or multiple possible matches in your text.

## Getting Started

We have already covered `grep` and other utilities for processing and examining patterns in text.
`grep` and other utilities can scan files or input for lines that match a specified pattern, which can be a simple word or a more complex **regular expression**.
`grep` is often used to filter output, search for specific data in logs, or find occurrences of certain text patterns within files.
Its versatility makes it an essential tool for efficiently locating information in large sets of data or documents.

In this section, we learn how to use more advanced regular expressions with `grep` to search files.

### Download Data File

To follow along in this tutorial, download the following file to your home directory on your Google Cloud VM:

```
wget https://raw.githubusercontent.com/cseanburns/linux_sysadmin/refs/heads/master/data/cities.md
```

## Multiword strings

It's good habit to include search strings within quotes, but this is especially important if we search for multiword strings.
In these cases, we must enclose them in quotes.

**Command:**

```
cat cities.md
```

**Output:**

```
| City              | 2020 Census | Founded |
|-------------------|-------------|---------|
| New York City, NY | 8804190     | 1624    |
| Los Angeles, CA   | 3898747     | 1781    |
| Chicago, IL       | 2746388     | 1780    |
| Houston, TX       | 2304580     | 1837    |
| Phoenix, AZ       | 1624569     | 1881    |
| Philadelphia, PA  | 1576251     | 1701    |
| San Antonio, TX   | 1451853     | 1718    |
| San Diego, CA     | 1381611     | 1769    |
| Dallas, TX        | 1288457     | 1856    |
| San Jose, CA      | 983489      | 1777    |
```

**Command:**

```
grep "San Antonio" cities.md
```

**Output:**

```
| San Antonio, TX | 1451853 | 1718 |
```

## Whole words by the edges

To search whole words, we can use special characters to match strings at the start and/or the end of words.
For example, note the output if I search for cities in California in my file by searching for the string **ca**.
Since this string appears in Chi**ca**go, then that city matches (as a false positive) my `grep` search:

**Command:**

```
grep -i "ca" cities.md
```

**Output:**

```
| Los Angeles, CA | 3898747 | 1781 |
| Chicago, IL     | 2746388 | 1780 |
| San Diego, CA   | 1381611 | 1769 |
| San Jose, CA    | 983489  | 1777 |
```

To limit results to only **CA**, we can enclose our search in special characters that tell `grep` to limit by whole words only.
In the last section, we surrounded whole words using the `\<string\>` syntax.
We can also use `\bstring\b` syntax:

**Command:**

```
grep -i "\bca\b" cities.md
```

**Output:**

```
| Los Angeles, CA | 3898747 | 1781 |
| San Diego, CA   | 1381611 | 1769 |
| San Jose, CA    | 983489  | 1777 |
```

We can reverse that output and look for strings within other words.
Here is an example of searching for the string **ca** within words using the capital B version of the above syntax:

**Command:**

```
grep -i "\Bca\B" cities.md
```

**Output:**

```
| Chicago, IL | 2746388 | 1780 |
```

## Bracket Expressions

In conjunction with the `grep` command, we can also use regular expressions to search for more general patterns in text files.
For example, we can use **bracket expressions** to search for patterns in the text.
Here again using `man grep` is very important because it includes instructions on how to use these regular expressions.

From `man grep` on **bracket expressions**:

> A bracket expression is a list of characters enclosed by [ and ].
> It matches any single character in that list.
> If the first character of the list is the caret ^ then it matches any character not in the list.
> For example, the regular expression [0123456789] matches any single digit.
 
And the regular expression [^0123456789] matches the non-number characters.
 
Within a bracket expression, a range expression consists of two characters separated by a hyphen.
It matches any single character that sorts between the two characters, inclusive of the two characters.

For example:

- `[0-9]` is the same as `[0123456789]`
- `[1-4]` is the same as `[1234]`
- `[A-Z]` is the same as `[ABCDEFGHIJKLMNOPQRSTUVWXYZ]`
- `[M-P]` is the same as `[MNOP]`
- `[a-z]` is the same as `[abcdefghijklmnopqrstuvwxyz]`
- `[x-z]` is the same as `[xyz]`
- `[a-zA-Z]` is the same as both all the lower and upper case strings in the alphabet

To see how this works, let's search the **cities.md** file for letters matching **A, B, or C**.
Specifically, in the following command I use a hyphen to match any characters **in** the range A, B, C.
The output does not include the cities **Houston** or **Dallas** (or lines containing only non-alphabet characters) since neither of those lines contain capital **A, B, or C** characters:

**Command:**

```
grep "[A-C]" cities.md 
```

**Output:**

```
| City              | 2020 Census | Founded |
| New York City, NY | 8804190     | 1624    |
| Los Angeles, CA   | 3898747     | 1781    |
| Chicago, IL       | 2746388     | 1780    |
| Phoenix, AZ       | 1624569     | 1881    |
| Philadelphia, PA  | 1576251     | 1701    |
| San Antonio, TX   | 1451853     | 1718    |
| San Diego, CA     | 1381611     | 1769    |
| San Jose, CA      | 983489      | 1777    |
```

### Carat within Brackets

When placed after the first bracket, the carat key acts as a Boolean NOT.
The following command matches any characters **not in** the range A,B,C:

**Command:**

```
grep "[^A-Z]" cities.md
```

The output matches lowercase letters, numbers, and non-alphanumeric characters, like the dashes.

**Output:**

```
| City              | 2020 Census | Founded |
|-------------------|-------------|---------|
| New York City, NY | 8804190     | 1624    |
| Los Angeles, CA   | 3898747     | 1781    |
| Chicago, IL       | 2746388     | 1780    |
| Houston, TX       | 2304580     | 1837    |
| Phoenix, AZ       | 1624569     | 1881    |
| Philadelphia, PA  | 1576251     | 1701    |
| San Antonio, TX   | 1451853     | 1718    |
| San Diego, CA     | 1381611     | 1769    |
| Dallas, TX        | 1288457     | 1856    |
| San Jose, CA      | 983489      | 1777    |
```

Our ranges may be alphabetical or numerical.
The following command matches any numbers **in** the range 1,2,3:

**Command:**

```
grep "[1-3]" cities.md
```

Since all single digits appear in the file, the above command returns all lines.
To invert the search, we can use the following grep command.
This will match all non-integers:

**Command:**

```
grep "[^0-9]" cities.md
```

### Carat Preceding the bracket

We saw in a previous section that the carat `^` key indicates the start of line.
However, we learned above that it can be used to return the inverse of a string in special circumstances,
which is when it is inside the brackets.
To use the carat to signify the start of a line, the carat key must precede the opening bracket.
For example, the following command matches any lines that start with the upper case letters within the range of **N,O,P**:

**Command:**

```
grep "^| [N-P]" cities.md
```

**Output:**

```
New York City, NY | 8804190 | 1624
Phoenix, AZ       | 1624569 | 1881
Philadelphia, PA  | 1576251 | 1701
```

And we can reverse that with the following command, which returns all lines that **do not** start with **N,O, or P**:

**Command:**

```
grep "^| [^N-P]" cities.md
```

**Output:**

```
| City            | 2020 Census | Founded |
| Los Angeles, CA | 3898747     | 1781    |
| Chicago, IL     | 2746388     | 1780    |
| Houston, TX     | 2304580     | 1837    |
| San Antonio, TX | 1451853     | 1718    |
| San Diego, CA   | 1381611     | 1769    |
| Dallas, TX      | 1288457     | 1856    |
| San Jose, CA    | 983489      | 1777    |
```

## Anchoring

Outside of bracket expressions, we use the caret `^` to mark the beginning of a line.
We can also use the `$` to match the end of a line.
Using either (or both) is called **anchoring**.
Anchoring works in many places.
For example, to search all lines that **start** with a vertical bar, a space, and then a capital D through L.

**Command:**

```
grep "^| [D-L]" cities.md
```

**Output:**

```
| Los Angeles, CA | 3898747 | 1781 |
| Houston, TX     | 2304580 | 1837 |
| Dallas, TX      | 1288457 | 1856 |
```

To show how to anchor the end of a line, let's look at the **operating-systems.csv** file.
The following dollar sign `$` signifies the end of line:

**Command:**

```
grep "1993$" operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
Windows NT, Proprietary, 1993
```

We can use both anchors in our `grep` commands.
The following searches for any lines starting with capital letter F and that also ends with the number 3. 
The single dot stands for any character, and the asterisk stands for "the preceding character will zero or more times" (`man grep`).

**Command:**

```
grep "^F.*3$" operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
```

## Repetition

If we want to use regular expressions to identify repeating patterns, then we can use repetition operators.
As we saw above, the most useful one is the `*` asterisk.
We need to add the -E option to extend `grep`'s regular expression functionality for repetitions:

In `man grep`, we can use the following **repetition operators**:

- `?` the preceding item is optional and matched at most once
- `*` the preceding item will be matched zero or more times
- `+` the preceding item will be matched one or more times
- `{n}` the preceding item is matched exactly `n` times
- `{n,}` the preceding item is matched `n` or more times
- `{,m}` the preceding item is matched at most `m` times
- `{n,m}` the preceding item is matched at leat `n` times, but not more than `m` times

Here, the preceding item **S** is matched one or more times:

**Command:**

```
grep -E "S+" cities.md
```

**Output:**

```
| San Antonio, TX | 1451853 | 1718 |
| San Diego, CA   | 1381611 | 1769 |
| San Jose, CA    | 983489  | 1777 |
```

In the next search, the preceding item **l** (that is, a lower case l) is matched exactly 2 times:

**Command:**

```
grep -E "l{2}" cities.md
```

**Output:**

```
| Dallas, TX | 1288457 | 1856 |
```

Finally, in this example, the preceding item **7** is matched at least two times or at most three times:

**Command:**

```
grep -E "7{2,3}" cities.md
```

**Output:**

```
| San Jose, CA | 983489 | 1777 |
```

## Grouping

Just like in match, we can use parenthesis to group objects.
The following command first filters out for the city and year columns and
then matches the number `17` (altogether) exactly one time:

```
cut -d"|" -f2,4 cities.md | grep "(17){1}"
```

**Output:**

```
Los Angeles, CA   | 1781
Chicago, IL       | 1780
Philadelphia, PA  | 1701
San Antonio, TX   | 1718
San Diego, CA     | 1769
San Jose, CA      | 1777
```

## Character classes

Character classes are special types of predefined bracket expressions.
They make it easy to search for general patterns.
From `man grep` on **character classes**:

> Finally, certain named classes of characters are predefined within bracket
> expressions, as follows. Their names are self explanatory, and they are
> [:alnum:], [:alpha:], [:blank:], [:cntrl:], [:digit:], [:graph:], [:lower:],
> [:print:], [:punct:], [:space:], [:upper:], and [:xdigit:]. For example,
> [[:alnum:]] means the character class of numbers and letters ... 

Below I use the `awk` command to select the fourth column (or field) using the pipe as the field delimiter.
I pipe the output to `grep` to select lines exactly four digit numbers `[[:digit:]]{4}` from the results of the `awk` command:

**Command:**

```
awk -F"|" '{ print $4 }' cities.md | grep -Eo "[[:digit:]]{4}"
```

Or the `cut` command:

```
cut -d"|" -f4 cities.md | grep -Eo "[[:digit:]]{4}"
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

Of course, we can then numerically sort these using the `sort` command.

## Conclusion

We covered a lot in this section on `grep` and regular expressions.

We specifically covered:

- multiword strings
- whole word searches
- bracket expressions and character classes
- anchoring
- repetition

Even though we focused on `grep`, many these regular expressions work across many programming languages.

See [Regular-Expression.info][regexInfo] for more in-depth lessons on regular expressions.

[regexInfo]:https://www.regular-expressions.info/
