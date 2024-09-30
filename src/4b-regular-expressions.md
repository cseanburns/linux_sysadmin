# Regular Expressions with `grep`

By the end of this section, you will:

1. **Understand the purpose of `grep`**: Recognize the versatility of `grep`
   for searching through text and its use in filtering output, searching for
   patterns in files, and extracting relevant data.
2. **Perform basic searches using `grep`**: Search for multiword strings and
   whole words while understanding how to handle case sensitivity and word
   boundaries.
3. **Utilize regular expressions**: Apply regular expressions with `grep` to
   search for more complex text patterns, using features like bracket
   expressions, character classes, and anchoring.
4. **Leverage repetition and OR operators**: Use repetition operators (e.g.,
   `*`, `+`) and Boolean OR searches to find repetitive patterns or multiple
   possible matches in your text.
5. **Compare outputs with process substitution**: Understand how to compare the
   output of multiple `grep` commands using process substitution techniques
   like `diff`.
6. **Understand broader applications**: Gain a foundational understanding of
   regular expressions that apply across multiple programming languages and
   tools beyond just `grep`.

## Getting Started

The `grep` command is a powerful tool used in the Linux command line for searching through text.
It scans files or input for lines that match a specified pattern, which can be a simple word or a more complex **regular expression**.
`grep` is often used to filter output, search for specific data in logs, or find occurrences of certain text patterns within files.
Its versatility makes it an essential tool for efficiently locating information in large sets of data or documents.

In this section, we learn how to use `grep` to search files.
We will use simple search strings with `grep` to search for regular words.
But we will use **regular expressions** to search for more complex patterns.

### Download Data File

To follow along in this tutorial, download the following file to your home directory on your Google Cloud VM:

```
wget https://raw.githubusercontent.com/cseanburns/linux_sysadmin/refs/heads/master/data/cities.md
```

## Multiword strings

It's good habit to include search strings within quotes, but this is especially important if we would search for multiword strings.
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

## Whole words, case sensitive by default

As a reminder, `grep` commands are case-sensitive by default.
Thus, note that the contents of **cities.md** are all in lowercase.
If I run the above command without the city named capitalized, then `grep` will return nothing:

**Command:**

```
grep "san antonio" cities.md
```

To tell grep to ignore case, I need to use the `-i` option.
We also want to make sure that we enclose our entire search string withing double quotes.

This is a reminder for you to run `man grep` and to read through the documentation and see what the various options exit for this command.

**Command:**

```
grep -i "san antonio" cities.md
```

**Output:**

```
| San Antonio, TX | 1451853 | 1718 |
```

### Whole words by the edges

To search whole words, we can use special characters to match strings at the start and/or the end of words.
For example, note the output if I search for cities in California in my file by searching for the string **ca**.
Since this string appears in Chi**ca**go, then that city matches my grep search:

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

To limit results to only **CA**, we can enclose our search in special characters that tell `grep` to limit by whole words only:

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

> **Note:** in some cases you might need an extra backslash: `grep -i "\\bca\\b" cities.md`.

We can reverse that output and look for strings within other words.
Here is an example of searching for the string **ca** within words:

**Command:**

```
grep -i "\Bca\B" cities.md
```

**Output:**

```
| Chicago, IL | 2746388 | 1780 |
```

## Bracket Expressions and Character Classes

In conjunction with the `grep` command, we can also use regular expressions to search for more general patterns in text files.
For example, we can use **bracket expressions** and **character classes** to search for patterns in the text.
Here again using `man grep` is very important because it includes instructions on how to use these regular expressions.

### Bracket expressions

From `man grep` on **bracket expressions**:

> A bracket expression is a list of characters enclosed by [ and ]. It matches
> any single character in that list. If the first character of the list is the
> caret ^ then it matches any character not in the list. For example, the
> regular expression [0123456789] matches any single digit.

The regular expression \[^0123456789] matches the inverse.

> Within a bracket expression, a range expression consists of two characters
> separated by a hyphen. It matches any single character that sorts between the
> two characters.

To see how this works, let's search the **cities.md** file for letters matching **A, B, or C**.
Specifically, in the following command I use a hyphen to match any characters **in** the range A, B, C.
The output does not include the cities **Houston** or **Dallas** since neither of those lines contain capital **A, B, or C** characters:

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

> **Note:** Use `grep -i "[A-C]" cities.md` for a case insensitive search.

### Bracket expressions, inverse searches

When placed after the first bracket, the carat key acts as a Boolean NOT.
The following command matches any characters **not in** the range A,B,C:

**Command:**

```
grep "[^A-C]" cities.md
```

The output matches all lines since there are no instances of **A, B, and C** in all lines:

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

#### Process substitution

Process substitution allows you to use the output of a command as if it were a file.
This is particularly useful when you want to compare the outputs of two commands directly, without having to save them to temporary files.

For example, we can confirm that output from one command does not include Houston or Dallas in a second command by comparing the outputs.
Specifically, we compare the outputs of two or more commands using **process substitution**.
This works because the **process substitution** creates temporary files from the outputs.

**Command:**

```
diff <(grep "[A-C]" cities.md) <(grep "[^A-C]" cities.md)
```

**Output:**

```
1a2
> |-----------------|-------------|------|
4a6
> | Houston, TX     | 2304580     | 1837 |
8a11
> Dallas, TX        | 1288457     | 1856
```

---

##### How It Works

- `<(command)` creates a temporary file (or file-like stream) that holds the output of command.
- `diff` can then read from these streams as if they were regular files, comparing their contents without needing you to manually save and load files.
  The output of the ``diff`` command is nicely explained in this [Stack Overflow][diffStack] answer.

Without process substitution, you would need to save the outputs of both grep commands to temporary files and then compare them:

```
grep "[A-C]" cities.md > output1.txt
grep "[^A-C]" cities.md > output2.txt
diff output1.txt output2.txt
```

This alternative works but is more cumbersome, as it requires managing temporary files.
Process substitution simplifies the process by handling this behind the scenes.

---

Try this command for an alternate output:

```
diff -y <(grep "[A-C]" cities.md) <(grep "[^A-C]" cities.md)
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

### Bracket expressions, carat preceding the bracket

We saw in a previous section that the carat `^` key indicates the start of line.
However, we learned above that it can be used to return the inverse of a string in special circumstances.
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

### Character classes

Character classes are special types of predefined bracket expressions.
They make it easy to search for general patterns.
From ``man grep`` on **character classes**:

> Finally, certain named classes of characters are predefined within bracket
> expressions, as follows. Their names are self explanatory, and they are
> [:alnum:], [:alpha:], [:blank:], [:cntrl:], [:digit:], [:graph:], [:lower:],
> [:print:], [:punct:], [:space:], [:upper:], and [:xdigit:]. For example,
> [[:alnum:]] means the character class of numbers and letters ... 

Below I use the `awk` command to select the fourth column (or field) using the pipe as the field delimiter.
I pipe the output to `grep` to select lines containing a vertical bar and four digit numbers `[[:digit:]]{4}` from the results of the `awk` command:

**Command:**

```
awk -F"|" '{ print $4 }' cities.md | grep -Eo "[[:digit:]]{4}"
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

> I first tested that the `awk` command selects the appropriate field by running it by itself: `awk -F"|" '{ print $4 }' cities.md`.

## Anchoring

As seen above, outside of bracket expressions and character classes, we use the caret ``^`` to mark the beginning of a line.
We can also use the ``$`` to match the end of a line.
Using either (or both) is called **anchoring**.
Anchoring works in many places.
For example, to search all lines that start with capital **D through L**

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

**Command:**

```
grep "1993$" operating-systems.csv
```

**Output:**

```
FreeBSD, BSD, 1993
Windows NT, Proprietary, 1993
```

We can use both anchors in our ``grep`` commands.
The following searches for any lines starting with capital letters that range from C through F.
Then any lines ending with the numbers starting from 3 through 6.
The single dot stands for any character, and the asterisk stands for "the preceding character will zero or more times" (`man grep`).

**Command:**

```
grep "^[C-F].*[3-6]$" operating-systems.csv
```

**Output:**

```
CP/M, Proprietary, 1974
FreeBSD, BSD, 1993
```

## Repetition

If we want to use regular expressions to identify repetitive patterns, then we can use repetition operators.
As we saw above, the most useful one is the ``*`` asterisk.
But there are other options:

In come cases, we need to add the -E option
to extend `grep`'s regular expression functionality:

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

In the next search, the preceding item **l** is matched exactly 2 times:

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

## OR searches

We can use the vertical bar `|` to do a Boolean OR search.
In a Boolean OR statement, the statement is True if either one part is true, the other part is true, or both are true.
In a search statement, this means that at least one part of the search is true.

The following will return lines for each city because they both appear in the file:

**Command:**

```
grep -E "San Antonio|Dallas" cities.md
```

**Output:**

```
| San Antonio, TX | 1451853 | 1718 |
| Dallas, TX      | 1288457 | 1856 |
```

The following will match San Antonio even though Lexington does not appear in the file:

**Command:**

```
grep -E "San Antonio|Lexington" cities.md
```

**Output:**

```
| San Antonio, TX | 1451853 | 1718 |
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

Even though we focused on ``grep``, many these regular expressions work across many programming languages.

See [Regular-Expression.info][regexInfo] for more in-depth lessons on regular expressions.

[diffStack]:https://unix.stackexchange.com/a/216131
[regexInfo]:https://www.regular-expressions.info/
