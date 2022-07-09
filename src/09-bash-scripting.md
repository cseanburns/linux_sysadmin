# Bash Scripting

It's time to get started on Bash scripting.
So far, we've been working on the Linux commandline.
Specifically, we have been working in the [Bash][bash] shell.
Wikipedia refers to Bash as a **command language**, and
by that it means that Bash is used as a commandline language
but also as a scripting language.
The main purpose of Bash is to write small applications/scripts
that analyze text (e.g., log files) and automate jobs, but
it can be used for a variety of other purposes.

## Variables

One of the most important abilities of any programming or scripting language
is to be able to declare a variable.
Variables enable us to attach some value to a name.
That value may be temporary,
and it's used to pass information to other parts of a program.

In Bash, we declare a variable with the name of the variable,
an equal sign,
and then the value of the variable within double quotes.
Do not insert spaces.
In the following code snippet,
which can be entered on the commandine,
I create a variable named ``name``
and assign it the value ``Sean``.
I create another variable named ``backup`` 
and assign it the value ``/media``.
Then I use the ``echo`` and ``cd`` commands
to test the variables:

```
name="Sean"
backup="/media"
echo "My name is ${name}"
echo "${backup}"
cd "${backup}"
pwd
cd
```

Variables may include values that may change given some context.
For example, if we want a variable to refer to today's day of week,
we can use [command substitution][commandsub],
which "allows the output of a command
to replace the command name" (see ``man bash``).
Thus, the output at the time this variable is set
will differ if it is set on a different day.

```
today="$(date +%A)"
echo "${today}"
```

The curly braces are not strictly necessary,
but they offer benefits when we start to use things
like [array variables][arrays].
See:

- [How to use curly braces in Bash][curlies]
- [Brace Expansion][braceexp]

For example, let's look at basic **brace expansion**,
which can be used to generate arbitrary strings:

```
echo {1..5}
echo {5..1}
echo {a..l}
echo {l..a}
```

Another example: using brace notation,
we can generate multiple sub-directories at once.
Start off in your home directory, and:

```
mkdir -p homework/{drafts,notes}
cd homework
ls
```

But more than that, they allow us to deal with arrays (or lists).
Here I create a variable named ``seasons``,
which holds an **array**, or multiple values: ``winter spring summer fall``.
Bash lets me access parts of that array:

```
seasons=(winter spring summer fall)
echo "${seasons[@]}"
echo "${seasons[1]}"
echo "${seasons[2]}"
echo "${seasons[-1]}"
```

See [Parameter expansions][parameterexp] for more advanced techniques.

## Conditional Expressions

Whether working on the commandline, or
writing scripts in a text editor,
it's sometimes useful to be able to write multiple commands
on one line.
There are several ways to do that.
We can include a list of commands on one line in Bash
where each command is separated by a semicolon:

```
cd ; ls -lt
```

But we can use [conditional expressions][condexpr] and
apply logic with ``&&`` (**Logical AND**) or ``||`` (**Logical OR**).

Here, ``command2`` is executed if and only if ``command1`` is successful:

```
command1 && command2
```

Here, ``command2`` is executed if and only if ``command1`` fails:

```
command1 || command2
```

Example:

```
cd documents && echo "success"
cd documents || echo "failed"
# combine them:
cd test && pwd || echo "no such directory"
mkdir test
cd test && pwd || echo "no such directory"
```

## Shebang or Hashbang

When we start to write scripts,
the first thing we add is a [shebang][shebang] at line one.
We can do so a couple of ways:

```
##!/usr/bin/env bash
```

The first one should be more portable, but alternatively,
you could put the direct path to Bash:

```
#!/usr/bin/bash
```

## Looping

There are several looping methods Bash,
including: ``for``, ``while``, ``until``, and ``select``.
The ``for`` loop is often very useful. 

```
for i in {1..5} ; do
  echo "${i}"
done
```

With that, we can create a rudimentary timer:

```
for i in {1..5} ; do
  echo "${i}" && sleep 1
done
```

We can loop through our **seasons** variable:

```
seasons=(winter spring summer fall)
for i in ${seasons[@]} ; do
  echo "I hope you have a nice ${i}"
done
```

## Testing

Sometimes we will want to test certain conditions.
There are two parts to this,
we can use ``if; then ; else`` commands,
and we can also use the double square brackets: ``[[``.
There are a few ways to get documentation on these functions.
See the following:

```
man test
help test
help [
help [[
help if
```

We can test integers:

```
if [[ 5 -ge 3 ]] ; then
  echo "true"
else
  echo "false"
fi
```

Reverse it to return the else statement:

```
if [[ 3 -ge 5 ]] ; then
  echo "true"
else
  echo "false"
fi
```

We can test strings:

```
if [[ "$HOME" = "$PWD" ]] ; then
 echo "You are home."
else
 echo "You are not home, but I will take you there."
 cd "$HOME"
 pwd
fi
```

We can test file conditions.
Let's first create a file called **paper.txt** and
a file called **paper.bak**.
We will add some trivial content to **paper.txt**
but not to the **paper.bak**.
The following ``if`` statement will test if **paper.txt** 
has a more recent modification date, and if so,
it'll back up the file with the ``cp`` and echo back its success:

```
if [[ "$HOME/paper.txt" -nt "$HOME/paper.bak" ]] ; then
  cp "$HOME/paper.txt" "$HOME/paper.bak" && echo "Paper is backed up."
fi
```

Here's a script that prints info depending on which day of the week it is:

```
day1="Tue"
day2="Thu"
day3="$(date +%a)"

if [[ "$day3" = "$day1" ]] ; then
  printf "\nIf %s is %s, then class is at 9:30am.\n" "$day3" "$day1"
elif [[ "$day3" = "$day2" ]] ; then
  printf "\nIf %s is %s, then class is at 9:30am.\n" "$day3" "$day2"
else
  printf "\nThere is no class today."
fi
```
## Resources

I encourage you to explore
some useful guides and cheat sheets on Bash scripting:

- [Advanced Bash-Scripting Guide][advancedbash]
- [Bash scripting cheatsheet][bashcheat]
- [Bash shellcheck][bashshellcheck]
- [Shell Scripting for Beginners][bashbeginners]
- [Bash Shell Scripting for Beginners][bashshellbeginners]
- [Introduction to Bash][introtobash]

## Summary

In this demo, we learned about:

- creating and referring to variables
- conditional expressions with ``&&`` and ``||``
- adding the **shebang** or **hashbang** at the beginning of a script
- looping with the ``for`` statement
- testing with the ``if`` statement

These are the basics.
I'll cover more practical examples in upcoming demos,
but note that mastering the basics requires understanding
a lot of the commands and paths that we have covered so far in class.
So keep practicing.

[advancedbash]:https://tldp.org/LDP/abs/html/index.html
[bash]:https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[bashbeginners]:https://www.freecodecamp.org/news/shell-scripting-crash-course-how-to-write-bash-scripts-in-linux/
[bashshellbeginners]:https://fedoramagazine.org/bash-shell-scripting-for-beginners-part-1/
[bashcheat]:https://devhints.io/bash
[bashshellcheck]:https://www.shellcheck.net/
[commandsub]:https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html
[curlies]:https://www.howtogeek.com/725657/how-to-use-brace-expansion-in-linuxs-bash-shell/
[braceexp]:https://wiki.bash-hackers.org/syntax/expansion/brace
[shebank]:https://en.wikipedia.org/wiki/Shebang_(Unix)
[condexpr]:https://ss64.com/bash/syntax-execute.html
[parameterexp]:https://devhints.io/bash#parameter-expansion
[arrays]:https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_10_02.html
[introtobash]:https://cs.lmu.edu/~ray/notes/bash/
