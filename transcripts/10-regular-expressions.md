## Grep and Regular Expressions

Oftentimes, as systems administrators, we will need to search the contents of a file. One of the commands that we use to do that is the ``grep`` command. We have already discussed using the ``grep`` command, which is not unlike doing any kind of search, such as in Google. The command simply involves running ``grep`` along with the search string and against a file. So if I wanted to search a file called **cities.txt** file for the search string **Lexington**, then I can do this:

```
grep "lexington" cities.txt
```

### Whole words, case sensitive by default

However, ``grep`` can employ stricter and more powerful syntax than a Google search. Since the contents of **cities.txt** are all in lowercase, if I run the above command with the city
named capitalized, then ``grep`` will return nothing:

```
grep "Lexington" cities.txt
```

In order to tell grep to ignore case, then I need to use the ``-i`` option. This is a reminder for you to run ``man grep`` and to read through the documentation and see what the various options are for this command.

```
grep -i "Lexington" cities.txt
```

### Character Classes and Bracket Expressions

In conjuction with the the ``grep`` command, we can also use regular expressions to search the content of text files. For example, we can use what are called **character classes** and **bracket expressions** to search for patterns in the text. Here again ``man grep`` is very important.

Note that the regular expression that marks the beginning of a line is the carat key ``^``, but the carat key serves a different function in bracket expansion. Specifically, it functions like a Logical NOT. Here are examples of bracket expansion and character class searches:

```
# bracket expansion
grep [a-d] cities.txt # matches any characters in the range a,b,c,d
grep [^a-d] cities.txt # matches any characters not in the range a,b,c,d
grep [1-3] cities.txt # matches any numbers in the range 1,2,3
grep [^1-3] cities.txt # matches any numbers not in the range 1,2,3

# character classes
grep [[:alpha:]] cities.txt
grep [^[:alpha:]] cities.txt
grep [[:lower:]] cities.txt
grep [^[:lower:]] cities.txt
grep [[:upper:]] cities.txt
grep [^[:upper:]] cities.txt
grep [[:digit:]] cities.txt
grep [^[:digit:]] cities.txt
```

### Anchoring

Outside of bracket expansions and character classes, we use the caret **^** to mark the beginning of a line. We can also use the **$** to match the end of a line:

```
grep "^l" cities.txt # all lines beginning with a "l"
grep "9$" cities.txt # all lines ending with the number "9"
```

### Repetition

If we want to use regular expressions to identify repetitive patterns, then we can use certain repetition operators. The most useful one is the ``*`` asterisk and the two curly bracket examples below:

```
grep "l*" cities.txt # the preceding item "l" matched zero or more times

# In come cases, we need to add the -E option to extend grep's basic functionality:
grep -E "l?" cities.txt    # the preceding item "l" is matched at most once
grep -E "l+" cities.txt    # the preceding item "l" is matched one or more times
grep -E "l{2}" cities.txt  # the preceding item "l" is matched exactly 2 times
grep -E "l{2,}" cities.txt # the preceding item "l" is matched 2 or more times
```

### OR searches

Here we search for either **lexington** or **lansing**. Since they both appear in the file, both lines that contain them are returned:

```
grep "lexington\|lansing" cities.txt
```

This works like a Boolean OR statement, which means it'll return one or the other or both if one is True, the alternate is True, or both are True. If we repeat this line with a city name that is not in the file, but with one that is, then it'll return the city name that is in the file since at least that is True:

```
grep "lexington\|london" cities.txt
```

### Multiword strings

If we would like to find multiword strings, then we enclose them in quotes:

```
grep "lexington, ky" cities.txt
```
