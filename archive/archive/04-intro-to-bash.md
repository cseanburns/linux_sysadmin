# Learning Bash

Let's cover some basic commands. I'll list them and go through each one below.

## Navigation

- ``pwd`` : print working directory
- ``ls`` : list directory contents
- ``cd`` : change the shell working directory
- absolute paths: ``/home/sean/public_html/``
- relative paths:

```
pwd
/home/sean/
mkdir testdir
cd testdir
pwd
/home/sean/testdir
cd /home/sean/public_html/ # changing directory using absolute paths
cd ../testdir/ # changing directory using relative paths
```

## File names

- everything is a file: ``file``
- case sensitive
- no spaces in names
  - if do, then quote
  - if do, then use backslashes
- hidden files: ``ls -a``

## Manual pages

- ``man ls``
- ``man -k [search term]``
- ``info`` e.g., ``info sed``

## File manipulation

- ``mkdir`` : make or create a directory
- ``rmdir`` : remove or delete empty directories
- ``touch`` : change file timestamps (also, create an empty file)
- ``cp [source] [destination]`` : copy files and directories
- ``mv [source] [destination]`` : move (rename) files
- ``rm`` remove files or directories
- ``rm -rf`` for removing a directory with content

## Reading Files

- ``more`` : file perusal filter for viewing
- ``less`` : opposite of more
- ``cat`` : concatenate files and print on the standard output

## Creating Output

- ``echo`` : display a line of text

### Practice

Try using all the commands above this week.

Please visit: [https://ryanstutorials.net/linuxtutorial/][ryan_tutorials] for
some good additional tutorials if you want to keep exploring. For now, practice
the above and we'll extend on these commands next week.

## Bash Scripting

In this demo, I'll discuss the following three topics:

- File Ownership and Permissions
- Grep and Regular Expressions
- Test command and ``if`` Statements

## File Ownership and Permissions

All files in Linux have permissions that control whether the files can be read,
modified (edited), or executed if they are scripts/programs or if they are
directories. Directories need to have execute permissions in order to change
into them with the ``cd`` command. Additionally, all files in Linux have
ownership settings that control user ownership and group ownership.

We can examine the permission and owner settings with the ``ls -l`` command and
option. In the following example, I have two regular files called
**capitals.txt** and **cities.txt** and two directories called **documents**
and **public_html**:

```
$ ls -lh
-rw-rw-r--  1 sean sean    0 Aug 21 00:28 capitals.txt
-rw-rw-r--  1 sean sean    0 Aug 21 00:28 cities.txt
drwx------  2 sean sean 4.0K Aug 25 18:35 documents
drwxrwxr-x  1 sean sean 4.0K Aug 25 18:35 public_html
```

The ownership of the file is declared in the two columns where my user name is
listed:

```
sean sean
```

It states that the user ``sean`` (column 1) owns the file and the group
``sean`` (column 2) is the group owner of the file. Each of you are a member of
a group that has the same name as your username. You are also a member of
a student group ``sis_students``. You can see which groups you are in with the
``groups`` command:

```
groups
```

The permissions are stated in the above command with the string of characters
that include ``rwx``, which may be repeated up to three times. Each set of
``rwx`` values represents file permissions for three different entities:

1. First set: the first set of ``rwx`` represents **r**ead, **w**rite, and
   **x**ecute permissions for the **u**ser who owns of the file or
   directory.
1. Second set: the second set of ``rwx`` represents read, write, and execute
   permissions for the **g**roup owner of the file or directory.
1. Third set: this set controls access for all **o**thers.

To read the file permissions for **capitals.txt** file, we read them from left
to right:

-rw-rw-r--

- The first ``rw-`` states that the user who owns the file has **Read** and
  **Write** access but not ``x`` execute access since this is marked with
  a ``-``
- The second ``rw-`` states that the group that owns the file has **Read** and
  **Write** access but not ``x`` execute access since this is marked with
  a ``-``
- The third ``r--`` states that all others have **Read** access but not ``wx``
  **Write** or **Execute** access since this is marked with ``--``

In order to change ownership of the file, we use the ``chown`` command, and to
change file permissions, we use the ``chmod`` command.

If I want to change the group ownership of the **capitals.txt** file so that
members of my faculty group can access it, then the command to do so is:

```
chown sean:sis_fac_staff capitals.txt
```

```
ls -l
```

And the new output is:

```
-rw-rw-r--  1 sean sis_fac_staff 0 Aug 21 00:28 capitals.txt
```

If I want to revert it back, then:

```
chown sean:sean capitals.txt
```

Changing file permissions is trickier. But note those letters that are in bold
above in the transcript. I marked those letters because they are used in the
``chmod`` command to change the file permissions for the user owner, group
owner, and other file permissions. There is also an **a** option for **all**
three sets of permissions.

For example, to remove Write access to the file for all users and thus make the
file read-only:

```
chmod a-w capitals.txt
```

Thus ``a-w`` means for **a**ll users, remove **W**rite access.

If I wanted to make the file executable for me only, since ``sean`` is the
owner of the file:

```
chmod u+x capitals.txt
```

Here ``u+x`` means for the **u**ser that is the owner of the file, make the
file executable. This is helpful in case this is a Bash script.

I can also combine letters. If I want to make the file **w**ritable by the
**u**ser that owns the file and the **g**roup that owns the file:

```
chmod ug+w capitals.txt
```

## Grep and Regular Expressions

Oftentimes, as systems administrators, we will need to search the contents of
a file. The command that we use to do that is the ``grep`` command. Using the
``grep`` command is not unlike doing any kind of search, such as in Google. The
command simply involves running ``grep`` along with the search string and
against a file. So if I wanted to search the **capitals.txt** file for the
search string **Lexington**, then I do this:

```
grep "lexington" cities.txt
```

### Whole words, case sensitive by default

However, ``grep`` is stricter than a Google search. Since the contents of
**cities.txt** are all in lowercase, if I run the above command with the city
named capitalized, then ``grep`` will return nothing:

```
grep "Lexington" cities.txt
```

In order to tell grep to ignore case, then I need to use the ``-i`` option.
This is a reminder for you to run ``man grep`` and to read through the
documentation and see what the various options are for this command.

```
grep -i "Lexington" cities.txt
```

### Character Classes and Bracket Expressions

We can use what are called **character classes** and **bracket expressions** to
search for patterns in the text. Here again ``man grep`` is very important:

```
grep [a-d] cities.txt # matches any characters in the range a,b,c,d
grep [^a-d] cities.txt # matches any characters not in the range a,b,c,d
grep [1-3] cities.txt # matches any numbers in the range 1,2,3
grep [^1-3] cities.txt # matches any numbers not in the range 1,2,3
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

From the ``man`` page for ``grep``, the use of the caret **^** (outside of
character classes and bracket expressions) is used to mark the beginning of
a line, and the use of the **$** is used to match the end of a line:

```
grep "^l" cities.txt # all lines beginning with a "l"
grep "9$" cities.txt # all lines ending with the number "9"
```

### Repetition

If we want to repeat regular expressions (the patterns in a text file), then we
can use certain repetition operators. The most useful one is the ``*`` asterisk
and the two curly bracket examples below:

```
grep "l*" cities.txt # the preceding item "l" matched zero or more times
grep -E "l{2}" cities.txt # the preceding item "l" is matched exactly 2 times
grep -E "l{2,}" cities.txt # the preceding item "l" is matched 2 or more times
```

### Alternation

Here we search for either **lexington** or **lansing**. Since they both appear
in the file, both lines that contain them are returned:

```
grep "lexington\|lansing" cities.txt
```

This alternation works like a Boolean OR statement, which means it'll return
one or the other or both if one is True, the alternate is True, or both are
True. If we repeat this line with a city name that is not in the file, but with
one that is, then it'll return the city name that is in the file since at least
that is True:

```
grep "lexington\|london" cities.txt
```

## Test Command and ``if`` Statements

### Test

Sometime we want to run a test to see if a file exists, or not, or has some
special characteristic. In this case, we can use the ``test`` command. This
command does not have a ``man`` page because it is a Bash **builtin**.
Therefore to read its documentation, we use the ``help`` command for Bash
builtins:

```
help test | less
```

The ``[[ -a FILE ]]`` operators returns **True if file exists** even though it
doesn't print anything to the screen by default. But we can test the logic and
have it print something to the screen depending on the outcome of the logic.

In the following two lines, both of the commands will return **"yes the file
exists"** because the second command runs regardless of the output of the first
command. The semicolon simply allows us to run two commands on one line and
even though **helloworld.txt** doesn't exist in this directory.

```
[[ -a cities.txt ]] ; echo "yes the file exists"
[[ -a helloworld.txt ]] ; echo "yes the file exists"
```

To make the second command run **if and only if** the first command succeeds,
we use the Boolean ``&&`` control operator. Basically, if the first part of the
command succeeds (the command before the ``&&``), then run the second part of
the command.

```
[[ -a cities.txt ]] && echo "yes the file exists"
[[ -a helloworld.txt ]] && echo "yes the file exists"
```

Since the **cities.txt** file exists, then the second part of the command is
executed and **"yes the file exists"** is printed to the screen. Since the
**helloworld.txt** file does not exist, the second part of the command is not
executed and nothing is printed to the screen.

We can perform other file operations. For example, to test if one file is newer
or older than an other:

```
[[ cities.txt -nt capitals.txt ]] && echo "yes"
[[ cities.txt -ot capitals.txt ]] && echo "yes"
```

To test if a number is greater or lesser than another number:

```
[[ $(expr 4 + 3) -gt $(expr 2 + 1) ]] && echo "yes"
```

We use two vertical bars ``||`` to test the opposite of the ``&&`` control
operator. Basically, if the first part of the command does not succeed, then
run the second command. Thus, this will create the **homework.txt** file **if
and only if** the file **does not** exist since the ``-a`` file operator tests
if a file exists:

```
[[ -a homework.txt ]] || touch homework.txt
```

### ``if`` Statements

The ``if`` statement offers an alternative way to do this. When using ``if``
statements, it's helpful to open up ``nano`` and add them to a file, but for
now, let me show you a multi-line statement at the Bash prompt. Note that the
command prompt changes when pressing Enter. This signifies a continuation of
the command:

```
if [[ cities.txt -nt capitals.txt ]] ; then
  echo "cities.txt is newer than capitals.txt"
else
  echo "capitals.txt is newer than cities.txt"
fi
```

If we were to add that to a file, then we need to add what's called
a **shebang** at the top of the file, which looks like this: ``#!/bin/bash``.
This tells the Bash shell that this file is a Bash script. Since we're adding
the above ``if`` statement to a file, we might as well modify it. What this
script will do is test if **cities.txt** is newer than **capitals.txt**, and if
it's not, it'll run the ``touch`` command, which modifies the file's timestamp
to the current time, and if that's successful, because of the double ampersands
``&&``, then it'll echo the next echo statement:

```
#!/bin/bash

# This is a comment.
# This script tests if cities.txt is newer than capitals.txt

if [[ cities.txt -nt capitals.txt ]] ; then
  echo "cities.txt is newer than capitals.txt"
else
  touch cities.txt && echo "cities.txt is now newer than capitals.txt"
fi
```

When we add this in ``nano``, let's save the file as **filecomp.sh** in
``nano`` and make it executable.

```
chmod u+x filecomp.sh
```

Then run the script:

```
./filecomp.sh
```

## Conclusion

In this lesson I demoed the following three topics:

- File Ownership and Permissions
- Grep and Regular Expressions
- Test command and ``if`` Statements

Now it's your turn to practice these.

[ryan_tutorials]:https://ryanstutorials.net/linuxtutorial/
