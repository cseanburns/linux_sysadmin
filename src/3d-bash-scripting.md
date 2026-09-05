# Bash Scripting

By the end of this section, you will:

1. Understand Bash as both a command and scripting language: Recognize the dual
functionality of Bash, allowing you to automate tasks and manage scripts
   efficiently within a Linux environment.
1. Work with variables and arrays in Bash: Learn to declare and use variables,
   apply command substitution, and manage arrays for more complex scripting
   tasks.
1. Apply conditional expressions for decision-making: Use conditional operators
   such as &&, ||, and if; then; else statements to control the flow of your
   scripts based on conditions and outcomes.
1. Implement loops to automate repetitive tasks: Utilize looping structures,
   such as for, to automate actions that need to be repeated under certain
   conditions or across arrays.
1. Write and execute Bash scripts with the correct structure: Include essential
   elements like the shebang (`#!/usr/bin/env bash`) at the start of your
   scripts, ensuring portability and clarity in execution.
1. Test conditions in Bash scripts: Understand how to test for specific
   conditions in scripts, such as file existence or the comparison of
   variables, to build more reliable and functional scripts.
1. Validate and improve Bash scripts: Learn how to use tools like `shellcheck` to
   check for errors in your Bash scripts and ensure adherence to best practices
   through style guides.

## Getting Started

It's time to get started on Bash scripting.
So far, we've been working on the Linux commandline.
Specifically, we have been working in the [Bash][bash] shell.
Wikipedia refers to Bash as a **command language**.
This means that Bash is used as a commandline language but also as a scripting language.
The main purpose of Bash is to write small applications/scripts that analyze text (e.g., log files) and automate jobs.
However, it can be used for a variety of other purposes.

## Variables

One of the most important abilities of any programming or scripting language is to be able to declare a variable.
Variables enable us to attach some value to a name.
That value may be temporary, and it's used to pass information to other parts of a program.

In Bash, we declare a variable with the name of the variable, an equal sign, and then the value of the variable within double quotes.
Do not insert spaces between the variable and assignment.
In the following code snippet, which can be entered on the commandline, I create a variable named ``NAME`` and assign it the value ``Sean``.
I create another variable named ``BACKUP``  and assign it the value ``/media``.
Then I use the ``echo`` and ``cd`` commands to test the variables:

```
NAME="Sean"
BACKUP="/media"
echo "My name is ${NAME}"
echo "${BACKUP}"
cd "${BACKUP}"
pwd
cd
```

Variables may include values that may change given some context.
For example, if we want a variable to refer to today's day of week, we can use [command substitution][commandsub].
This "allows the output of a command to replace the command name" (see ``man bash``).
In the following, I use the `date +%A` command to assign the current day of the week to the variable named **TODAY**.
The output at the time this variable is set will differ if it is set on a different day.

```
TODAY="$(date +%A)"
echo "${TODAY}"
```

> By default, variables in Bash are global.
> If you are working within functions and want a variable to only be available within the function,
> you can declare it as local using `local var_name=value`.

Curly braces are not strictly necessary when calling a Bash variable, but they offer benefits when we start to use things like [array variables][arrays].
See:

- [How to use curly braces in Bash][curlies]
- [Brace Expansion][braceexp]

For example, let's look at basic **brace expansion**, which can be used to generate arbitrary strings:

```
echo {1..5}
echo {5..1}
echo {a..l}
echo {l..a}
```

Another example: using brace notation, we can generate multiple sub-directories at once.
Start off in your home directory, and:

```
mkdir -p homework/{drafts,notes}
cd homework
ls
```

But more than that, they allow us to deal with arrays (or lists).
Here I create a variable named ``seasons``, which holds an **array**, or multiple values: ``winter spring summer fall``.
Bash lets me access parts of that array.
In the following the `[@]` refers to the entire array and the `[n]` refers to subscript in the array.

```
seasons=(winter spring summer fall)
echo "${seasons[@]}"
echo "${seasons[1]}"
echo "${seasons[2]}"
echo "${seasons[-1]}"
```

See [Parameter expansions][parameterexp] for more advanced techniques.

## Conditional Expressions

Whether working on the commandline, or writing scripts in a text editor, it's sometimes useful to be able to write multiple commands on one line.
There are several ways to do that.
We can include a list of commands on one line in Bash where each command is separated by a semicolon.
In the following example, the `cd` command will run and then the `ls -lt` command will run.

```
cd ; ls -lt
```

We can also use [conditional expressions][condexpr] and apply logic with `&&` (**Logical AND**) or `||` (**Logical OR**).

Here, ``command2`` is executed if and only if ``command1`` is successful:

```
command1 && command2
```

Here, ``command2`` is executed if and only if ``command1`` fails:

```
command1 || command2
```

In essence, `&&` and `||` are short-circuit operators.
This means that if the first command in `command1 && command2` fails, `command2` **will not** be executed.
Conversely, if the first command in `command1 || command2` succeeds, `command2` **will** be executed.

In the example below, lines starting with a `#` indicate a comment that is not evaluated by `bash`:

```
# if documents/ does not exist, then the echo statement will not run
cd documents && echo "success" 
# if documents/ does not exist, then the echo statement will run
cd documents || echo "failed"
```

We can combine these operators:

```
cd test && pwd || echo "no such directory"
mkdir test
cd test && pwd || echo "no such directory"
```

## Shebang or Hashbang

When we start to write scripts, the first thing we add is a [shebang][shebang] or hashbang at line one.
The {she,hash}bang tells the shell what program needs to run.
We can do declare it a couple of ways.
First, we can use the path to `env`, which runs the program in a modified environment that is named after `env`.
In the following {she,hash}bang, we declare that modified environment to be the `bash` shell:

```
#!/usr/bin/env bash
```

> If we were writing a Python script, then we could declare it to be: `#!/usr/bin/env python3`.

The above is more portable, but alternatively, you could put the direct path to Bash:

```
#!/usr/bin/bash
```

> On [POSIX][posix] compliant systems, the `env` program should always be located at `/usr/bin/env`.
> However, even on POSIX compliant systems, `bash` may be located in different paths.
> On some Linux distributions, it's located at `/usr/bin/bash`.
> On others, it may be located at `/bin/bash`.
> On BSD OSes, like FreeBSD, `bash` might be installed at `/usr/local/bin/bash`.
> Thus, by using the `#!/usr/bin/env bash` shebang, you help ensure that your `bash` program is portable across different OSes.

Even for small scripts, it's helpful to follow a consistent style.
A well-written script is easier to maintain and understand.
Consider checking out style guides early on, like the [Google Shell Style Guide][shellstyle].
This will help ensure your scripts remain clean and readable.

## Looping

Looping is a common way to repeat an instruction until some specified condition is met.
There are several looping methods in Bash that include: : `for`, `while`, `until`, and `select`.
The `for` loop is often the most useful.
In the following toy looping example, we instruct `bash` to assign the letter **i** to the sequence **1,2,3,4,5**.
Each time it assigns **i** to those numbers, it `echo`s them to standard output:

```
for i in {1..5} ; do
  echo "i = ${i}"
done
```

> Note that I take advantage of brace expansion in the above for loop.

You might notice in the `echo` statement above that I use `${i}` instead of `$i`.
While the latter is possible, using `${i}` ensures proper variable expansion, particularly when using loops within strings or complex expressions.
For example, `${}` ensures that `i` is correctly interpreted as a variable and not part of a larger string.

Using the above `for` loop, we can create a rudimentary timer by calling the `sleep` command to pause after each count:

```
for i in {5..1} ; do
  echo "T minus ${i}" && sleep 1
done ; echo "BLAST OFF!"
```

> Note that I take advantage of brace expansion again, but this time
> reversing the ordering, as well as conditional execution.

The `sleep` command is particularly useful in automation tasks where you want to pause execution between steps, such as monitoring scripts,
where you might poll a resource at intervals, or in timed alerts.

We can loop through the variable arrays, too.
In the following `for` loop, I loop through the **seasons** variable first introduced above:

```
#!/usr/bin/env bash

seasons=(winter spring summer fall)
for i in "${seasons[@]}" ; do
  echo "I hope you have a nice ${i}."
done
```

> Note that I added the {she,hash}bang in the above example.
> I do this to make it clear that this is the kind of `for` loop that I would want to write in a text editor.

## Testing

Sometimes we will want to test certain conditions.
There are two parts to this, we can use ``if; then ; else`` commands, and we can also use the double square brackets: ``[[``.
There are a few ways to get documentation on these functions.
See the following:

```
man test
help test
help [
help [[
help if
```

> Between `[` and `[[`, I generally prefer to use the `[[` syntax, as demonstrated below.
> It's less error-prone and allows for more complex conditional checks.
> However, `[[` is specific to `bash` and thus slightly less portable than `[`.

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

We can test strings.
Run the command `nano amihome.sh` and type the script below into the file.
Save and exit.
Change the file's permissions: `chmod 766 amihome.sh`.
Then move the file to `/usr/local/bin` with the following command:
`sudo mv amihome.sh /usr/local/bin`

```
#!/usr/bin/env bash

if [[ "$HOME" = "$PWD" ]] ; then
 echo "You are home."
else
 echo "You are not home, but I will take you there."
 cd "$HOME" || exit
 echo "You are now $PWD."
 pwd
fi
```

Now you can run the file by typing at the command prompt: `amihome.sh`.

**IMPORTANT**: Running the above commands in a script won't result in changing your directory
outside the script to your home directory.
This is because of what Bash calls `subshells`.
Subshells are a forked processes.
So the script will do things in those other directories, but once the script exits,
you will remain in the directory where you ran the script.
If you want to execute a script in the current shell so that changes like `cd` persist after the script runs,
you can use the `source` command to run the script.
For example:

```
source script.sh
```

We can test file conditions.
Let's first create a file called **paper.txt** and a file called **paper.bak**.
We will add some trivial content to **paper.txt** but not to the **paper.bak**.
The following ``if`` statement will test if **paper.txt**  has a more recent modification date.
If so, it'll back up the file with the ``cp`` and echo back its success:

```
if [[ "$HOME/paper.txt" -nt "$HOME/paper.bak" ]] ; then
  cp "$HOME/paper.txt" "$HOME/paper.bak" && echo "Paper is backed up."
fi
```

Here's a script that prints info depending on which day of the week it is.
Let's save it in a text file and call it `schedule.sh`:

```
#!/usr/bin/env bash

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

Finally, you can check your shell scripts using the `shellcheck` shell script analysis tool.
First you will need to install it:

```
sudo apt -y install shellcheck
```

Then use it on shell script files you create.
For example, let's say I have a script in a file named **backup.sh**, I can use the `shellcheck` command to find any errors:

```
shellcheck backup.sh
```

If there are errors, `shellcheck` will tell you what they are and provide a link to documentation on the error.

If you become seriously interested in `bash` scripting, then you should check out the various style guides that exist.
For example, see the [Shell Style Guide][shellstyle] that was authored by coders at Google.

## Resources

I encourage you to explore some useful guides and cheat sheets on Bash scripting:

- [Advanced Bash-Scripting Guide][advancedbash]
- [Bash scripting cheatsheet][bashcheat]
- [Bash shellcheck][bashshellcheck]
- [Shell Scripting for Beginners][bashbeginners]
- [Bash Shell Scripting for Beginners][bashshellbeginners]
- [Introduction to Bash][introtobash]

## Conclusion

In this lecture, we've covered the basics of Bash scripting, including working with variables, loops, and conditionals.
These tools form the foundation for automating tasks and creating powerful scripts.
Continue practicing by writing small scripts for your own workflow, and explore the resources and style guides provided to deepen your understanding.

## Summary

In this demo, we learned about:

- creating and referring to variables
- conditional expressions with ``&&`` and ``||``
- adding the **shebang** or **hashbang** at the beginning of a script
- looping with the ``for`` statement
- testing with the ``if`` statement

[advancedbash]:https://tldp.org/LDP/abs/html/index.html
[arrays]:https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_10_02.html
[bashbeginners]:https://www.freecodecamp.org/news/shell-scripting-crash-course-how-to-write-bash-scripts-in-linux/
[bashcheat]:https://devhints.io/bash
[bash]:https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[bashshellbeginners]:https://fedoramagazine.org/bash-shell-scripting-for-beginners-part-1/
[bashshellcheck]:https://www.shellcheck.net/
[braceexp]:https://www.linuxjournal.com/content/bash-brace-expansion
[commandsub]:https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html
[condexpr]:https://ss64.com/bash/syntax-execute.html
[curlies]:https://www.howtogeek.com/725657/how-to-use-brace-expansion-in-linuxs-bash-shell/
[introtobash]:https://cs.lmu.edu/~ray/notes/bash/
[parameterexp]:https://devhints.io/bash#parameter-expansion
[shebang]:https://en.wikipedia.org/wiki/Shebang_(Unix)
[shellstyle]:https://google.github.io/styleguide/shellguide.html
[posix]:https://posix.opengroup.org/
