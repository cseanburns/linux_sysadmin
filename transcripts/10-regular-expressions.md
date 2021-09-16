## Grep and Regular Expressions

Oftentimes, as systems administrators, we will need to search the contents of a file, like a log. One of the commands that we use to do that is the ``grep`` command. We have already discussed using the ``grep`` command, which is not unlike doing any kind of search, such as in Google. The command simply involves running ``grep`` along with the search string and against a file. So if I wanted to search a file called **cities.txt** for the search string **Lexington**, then I can do this:

```
grep "lexington" cities.txt
```

### Whole words, case sensitive by default

However, ``grep`` can employ stricter and more powerful syntax than a Google search. Since the contents of **cities.txt** are all in lowercase, if I run the above command with the city named capitalized, then ``grep`` will return nothing:

```
grep "Lexington" cities.txt
```

In order to tell grep to ignore case, I need to use the ``-i`` option. This is a reminder for you to run ``man grep`` and to read through the documentation and see what the various options exit for this command.

```
grep -i "Lexington" cities.txt
```

### Multiword strings

If we would search for multiword strings, then we enclose them in quotes:

```
grep "lexington, ky" cities.txt
```

### Character Classes and Bracket Expressions

In conjunction with the ``grep`` command, we can also use regular expressions to search the content of text files. For example, we can use what are called **character classes** and **bracket expressions** to search for patterns in the text. Here again ``man grep`` is very important.

Note that the regular expression that marks the beginning of a line is the carat key ``^``, but the carat key serves a different function in bracket expressions. Specifically, it functions like a Logical NOT. Here are examples of bracket expressions and character class searches:

```
# bracket expressions
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

Outside of bracket expansions and character classes, we use the caret ``^`` to mark the beginning of a line. We can also use the ``$`` to match the end of a line:

```
grep "^l" cities.txt # all lines beginning with a "l"
grep "9$" cities.txt # all lines ending with the number "9"
```

### Repetition

If we want to use regular expressions to identify repetitive patterns, then we can use repetition operators. The most useful one is the ``*`` asterisk, but there are other options:

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

## Real World Example

The log file at ``/var/log/auth.log`` records all attempts to authenticate and login to the server, including "invalid" attempts. Invalid attempts will include actual invalid, malicious attempts but may also capture real user mistakes when logging into the server via ``ssh``. We're interested in the malicious attempts, made by automated bots, on the system. Let's use ``less`` to take a quick look at that file:

```
less /var/log/auth.log
Sep 12 00:00:08 sised-summer2020 sshd[78312]: Invalid user uu from 152.231.25.170 port 61921
Sep 12 00:00:08 sised-summer2020 sshd[78312]: pam_unix(sshd:auth): check pass; user unknown
Sep 12 00:00:08 sised-summer2020 sshd[78312]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=152.231.25.170 
Sep 12 00:00:10 sised-summer2020 sshd[78312]: Failed password for invalid user uu from 152.231.25.170 port 61921 ssh2
Sep 12 00:00:11 sised-summer2020 sshd[78312]: Received disconnect from 152.231.25.170 port 61921:11: Bye Bye [preauth]
Sep 12 00:00:11 sised-summer2020 sshd[78312]: Disconnected from invalid user uu 152.231.25.170 port 61921 [preauth]
Sep 12 00:00:40 sised-summer2020 sshd[78314]: User root from 107.170.153.57 not allowed because none of user's groups are listed in AllowGroups
Sep 12 00:00:40 sised-summer2020 sshd[78314]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=107.170.153.57  user=root
Sep 12 00:00:42 sised-summer2020 sshd[78314]: Failed password for invalid user root from 107.170.153.57 port 60118 ssh2
Sep 12 00:00:44 sised-summer2020 sshd[78314]: Received disconnect from 107.170.153.57 port 60118:11: Bye Bye [preauth]
```

If we continue to peruse that log file, we can also see valid, successful authentications. They follow the pattern below.

```
Sep 12 02:20:05 sised-summer2020 sshd[79540]: Accepted password for user1 from 192.128.0.1 port 56000 ssh2
Sep 12 15:08:10 sised-summer2020 sshd[87434]: Accepted password for user2 from 192.128.0.2 port 43501 ssh2
Sep 12 17:02:55 sised-summer2020 sshd[89235]: Accepted password for user3 from 192.128.0.3 port 57996 ssh2
Sep 12 17:03:36 sised-summer2020 sshd[89341]: Accepted password for user4 from 192.128.0.4 port 56188 ssh2
```

Note: I've obfuscated the usernames and IP addresses in the above snippet. Where it our reports **user1, user2, ...**, it would report our usernames, and the IP addresses are made up:

As we examine the file, we should look for patterns in the text. For example, we see the following kind of line over and over again:

```
Sep 12 00:00:08 sised-summer2020 sshd[78312]: Invalid user uu from 152.231.25.170 port 61921
```

The user listed here is ``uu``. That's a made up user. So let's grep for one of the fixed parts of that string, which is ``Invalid user``. We can pipe the output through the ``head`` command to look the first ten results:

```
grep "Invalid user" /var/log/auth.log | head
Sep 12 00:00:08 sised-summer2020 sshd[78312]: Invalid user uu from 152.231.25.170 port 61921
Sep 12 00:00:52 sised-summer2020 sshd[78316]: Invalid user reshma from 42.200.109.74 port 33028
Sep 12 00:02:16 sised-summer2020 sshd[78320]: Invalid user julie from 95.85.43.241 port 50010
Sep 12 00:02:39 sised-summer2020 sshd[78322]: Invalid user sasha from 113.161.37.216 port 46615
Sep 12 00:02:49 sised-summer2020 sshd[78324]: Invalid user a from 177.83.39.253 port 39699
Sep 12 00:05:39 sised-summer2020 sshd[78330]: Invalid user scan from 152.231.25.170 port 64587
Sep 12 00:06:45 sised-summer2020 sshd[78334]: Invalid user postgres from 95.85.43.241 port 37766
Sep 12 00:08:48 sised-summer2020 sshd[78341]: Invalid user apidoc from 113.161.37.216 port 32963
Sep 12 00:09:10 sised-summer2020 sshd[78407]: Invalid user sentry from 124.89.83.117 port 42690
Sep 12 00:09:15 sised-summer2020 sshd[78414]: Invalid user apidoc from 177.83.39.253 port 10693
```

Let's apply a brace expression and a asterisk to extract the list of invalid users from that output. I want everything from this log file, but I'll pipe the output through the ``head`` command to examine the validity of the results:

```
# note: we may also not grep for the string "from"
grep -o "Invalid user [a-zA-Z]* from" auth.log | head
Invalid user uu from
Invalid user reshma from
Invalid user julie from
Invalid user sasha from
Invalid user a from
Invalid user scan from
Invalid user postgres from
Invalid user apidoc from
Invalid user sentry from
Invalid user apidoc from
```

This is good progress, but I really just want the list of usernames. Let's modify that to remove the text "Invalid user " and "from ". We can use the ``cut`` or the ``awk`` command. I'll show both and just a bit of the output. The output is same with both commands:

```
# Using cut
grep -o "Invalid user [a-zA-Z]* from" auth.log | cut -d' ' -f3

# Using awk
grep -o "Invalid user [a-zA-Z]* from" auth.log | awk '{ print $3 }'
uu
reshma
julie
sasha
a
scan
postgres
apidoc
sentry
apidoc
```

Goal accomplished, but we can do better. Right now we have an un-ordered list of users. Let's sort them, get a count and list of usernames that are the most commonly used, and then sort those by their counts. We'll continue to use the ``|`` pipe operator, along with an assortment of utilities, to create a powerful command:

```
grep -o "Invalid user [a-zA-Z]* from" auth.log | awk '{ print $3 }' | sort | uniq -c | sort
```

Once we have that, we may want to save the data to a file:

```
grep -o "Invalid user [a-zA-Z]* from" auth.log | awk '{ print $3 }' | sort | uniq -c | sort > invalid-user-attempts.txt
```

Or, we may want to save our command as a script in order to automate the process. In the following code snippet, I use the **backslash** to split our single command over multiple lines. This makes the command more readable. I also save the output to a file with the current date as part of the file name. This makes the file name unique, which is good since I only use a single ``>`` redirect.

```
#!/usr/bin/env bash

# Get sorted list of invalid attempts to ssh into server
grep -o "Invalid user [a-zA-Z]* from" auth.log |\
  awk '{ print $3 }' |\
  sort |\
  uniq -c |\
  sort > invalid-user-attempts-"$(date +%Y-%m-%d)".txt
```

And from there we can investigate whether any of these users truly exist on the system and conduct other security checks.

### Addendum

The goal in this lesson is to learn a bit about regular expressions, but there are a number of ways to get a list of users from the **auth.log** file and also avoid using complicated regular expressions. We can ``grep`` for a multistring and take more advantage of ``awk``. For example:

```
grep "Invalid user " auth.log | awk '{ print $8 }' | sort | uniq -c | sort
```

We can also not ``grep`` at all, and use only ``awk``, because ``awk`` can search. To search in ``awk``, we insert the search string within forward slashes, i.e., ``/search string/``:

```
awk '/Invalid user / { print $8 }' auth.log | sort | uniq -c | sort
```

In both examples above, we depend on the default behavior of ``awk`` to treat spaces as a field separator. Hence, in order for me to know that the users are listed in field 8 (``$8``), I had to count the columns.
