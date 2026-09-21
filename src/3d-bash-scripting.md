# Bash Scripting

By the end of this section, you will:

1. Understand Bash as both a command and scripting language: Recognize the dual functionality of Bash, allowing you to automate tasks and manage scripts efficiently within a Linux environment.
1. Work with variables and arrays in Bash: Learn to declare and use variables, apply command substitution, and manage arrays for more complex scripting tasks.
1. Apply conditional expressions for decision-making: Use conditional operators such as &&, ||, and if; then; else statements to control the flow of your scripts based on conditions and outcomes.
1. Implement loops to automate repetitive tasks: Utilize looping structures, such as for, to automate actions that need to be repeated under certain conditions or across arrays.
1. Write and execute Bash scripts with the correct structure: Include essential elements like the shebang (`#!/usr/bin/env bash`) at the start of your scripts, ensuring portability and clarity in execution.
1. Test conditions in Bash scripts: Understand how to test for specific conditions in scripts, such as file existence or the comparison of variables, to build more reliable and functional scripts.
1. Validate and improve Bash scripts: Learn how to use tools like `shellcheck` to check for errors in your Bash scripts and ensure adherence to best practices through style guides.

## Getting Started

So far, we've been working on the Linux commandline.
Specifically, we have been working in the [Bash][bash_wiki] shell.
Bash serves as both an interactive command language and a [scripting language][script_wiki].
The same language we've been using at the command line can therefore be used to write programs and automate Linux tasks.

Unix-like operating systems, including Linux, offer many shells, each with different advantages.
Besides `bash`, a few examples include:

- `sh`
- `tcsh`
- `csh`
- `ksh`
- `zsh`

Other operating systems may include their own shells.
Windows OS has PowerShell, which includes the older `cmd.exe` (Command Prompt) shell as well as the much more capable PowerShell.

Shells serve two purposes.
They provide a mechanism for interactively using the operating system from a command prompt, and
they provide programming capabilities for automation, or job control.

The following is a brief intro to the main parts of scripting in Bash.
If you have ever programmed before, many of these concepts will not be new to you.

## Shebang or Hashbang

When we start to write scripts, the first thing we add is a [shebang][shebang_wiki] or hashbang at line one.
The {she,hash}bang tells the shell what program needs to run.

In the example below, the `#!/usr/bin/env bash` form uses `env` to locate `bash` using the current `PATH`.
This can make the script more portable across systems where Bash is installed in different locations.

```
#!/usr/bin/env bash
```

> As an alternate example, if we were writing a Python script, then we could declare it to be: `#!/usr/bin/env python3`.

This is the more portable method, because POSIX compliance dictates that the `env` binary exists at `/usr/bin/`, regardless where in the path `bash` (or some other shell) exists.
However, you may see the following forms, too:

```
#!/usr/bin/bash
```

Or:

```
#!/bin/bash
```

> On [POSIX][posix] compliant systems, the `env` program should always be located at `/usr/bin/env`.
> However, even on POSIX compliant systems, `bash` may be located in different paths.
> On some Linux distributions, it's located at `/usr/bin/bash`.
> On others, it may be located at `/bin/bash`.
> On BSD OSes, like FreeBSD, `bash` might be installed at `/usr/local/bin/bash`.
> Thus, by using the `#!/usr/bin/env bash` shebang, you help ensure that your `bash` program is portable across different OSes.

## Style

To help ensure that your scripts are clean and readable, even for small scripts, it's helpful to follow a consistent style.
Just like when we write academic papers, where we might use APA, Chicago, MLA, or some other style guide, style guides exist for programming and scripting languages, too.
Adhering to a style guide helps us to write clean, visually appealing scripts that are easier to maintain and understand.
Consider checking out style guides early on, like the [Google Shell Style Guide][shellstyle].

## Variables

One of the most important abilities of any programming or scripting language is to declare a variable.
Variables enable us to attach some value to a name.
Variables are often used to pass information to other parts of a program.

In Bash, we declare variables first with the name of the variable, an equal sign, and then the value of the variable (the assignment) within double quotes.
Unlike other programming languages, we do not insert spaces between the variable and assignment.
In the following code snippet, which can be entered on the commandline, I create a variable named `name` and assign it the value `Sean`.
I create another variable named `backup`  and assign it the value `/media`, representing a path on my filesystem.
Then I use the `echo` and `cd` commands to test the variables:

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
For example, if we want a variable to refer to today's day of week, we can use [command substitution][commandsub].
This "allows the output of a command to replace the command name" (see `man bash`).
In the following, I use the `date +%A` command to assign the current day of the week to the variable named **today**.
The output at the time this variable is set will differ if it is set on a different day.

```
today="$(date +%A)"
echo "${today}"
```

Curly braces are not strictly necessary when calling a Bash variable, but it is good practice to use them for a variety of reasons (e.g., [array variables][arrays_tldp] and [parameter expansion][parameter_opensource]).
See:

- [How to use curly braces in Bash][curlies]
- [Brace Expansion][braceexp]


We also use curly braces in **brace expansion** to generate strings:

```
echo {1..5}
echo {5..1}
echo {a..l}
echo {l..a}
```

Another example: using brace notation, we can generate multiple sub-directories at once.
The following command creates a directory called `homework/` that contains two subdirectories: `drafts/` and `notes/`.
From your home directory, do:

```
mkdir -p homework/{drafts,notes}
cd homework
ls
drafts/ notes/
```

### Lists / Arrays

I can assign a list or an array to a variable using `()` parentheses.
To create a variable named `seasons`, that contains multiple values, such as `winter spring summer fall`, I declare my variable as follows:

```
seasons=(winter spring summer fall)
```

Bash lets me access parts of that array.
In the following example, the `[@]` refers to the entire array and the `[n]` refers to a subscript in the array.
Like other programming languages, the first subscript in an array begins with 0.

```
echo "${seasons[@]}"
winter spring summer fall
echo "${seasons[0]}"
winter
echo "${seasons[1]}"
spring
echo "${seasons[2]}"
summer
```

I can also access subscripts in an array from right to left, starting with `-1`:

```
echo "${seasons[-1]}"
fall
echo "${seasons[-2]}"
summer
```

See [Parameter expansions][parameterexp] for more advanced techniques.

### Variable Naming

When naming variables, use lowercase or snake_case: `name` is more appropriate than `NAME`.
By convention, variables created by your script generally use lowercase or `snake_case`.
Uppercase names are commonly used for environmental variables and sometimes for values treated as constants.
Using lowercase for ordinary variables also helps avoid accidentally conflicting with special shell or environmental variables such as `PATH`, `HOME`, `USER`, and `PWD`.

## Looping

Looping is a common way to repeat an instruction until some specified condition is met.
There are several looping methods in Bash that include: `for`, `while`, `until`, and `select`.

### `for` Loops

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
Braces explicitly delimit the variable name.
For example, `${i}th` expands variable `i` followed by `th`, but `$ith` asks Bash to expand a variable `$ith`.

Using the above `for` loop, we can create a rudimentary timer by calling the `sleep` command to pause after each count.
Once the `for` loop closes, the final `echo` statement runs:

```
for i in {5..1} ; do
  echo "T minus ${i}"
  sleep 1
done ; echo "BLAST OFF!"
```

> Note that I take advantage of brace expansion again, but this time reversing the ordering, as well as conditional execution.

The `sleep` command is particularly useful in automation tasks where you want to pause execution between steps, such as monitoring scripts,
where you might poll a resource at intervals, or in timed alerts.

### `while` Loops

We can use a `while` loop instead of a `for` loop.
Before entering a `while` loop, we initialize the counter with `count=5`.
The `while` statement then tests a **condition** before each iteration.
As long as that condition is true, the loop continues.

```
count=5

while [[ $count -ge 1 ]] ; do
    echo "$count"
    ((count--))
    sleep 1
done ; echo "blast off"
```

### `until` Loops

`while` loops terminate when the condition becomes false.
In the above example, the condition (initially `count=5`) becomes false when `$count` is no longer greater than or equal to one.

The `until` loop works in the reverse order, and terminates when the condition becomes true.
In this example, the condition becomes true when `$count` equals zero.

```
count=5

until [[ $count -eq 0 ]] ; do
    echo "$count"
    ((count--))
    sleep 1
done ; echo "blast off"
```

### Looping Arrays

We can loop through variable arrays (or lists).
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
There are two parts to this, we can use `if; then ; else` commands, and we can also use the double square brackets: `[[`.
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
> However, `[[` is a `bash` specific conditional construct and is not standard POSIX `sh` syntax, like `[` is.
> Since we are writing Bash scripts, we generally prefer it for its versatility.

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

We can test file conditions.
Let's first create a file called **paper.txt** and a file called **paper.bak**.
We will add some trivial content to **paper.txt** but not to the **paper.bak**.
The following `if` statement will test if **paper.txt**  has a more recent modification date.
If so, it'll back up the file with the `cp` and echo back its success:

```
touch "$HOME/paper.bak"
sleep 1
echo "My paper" > "$HOME/paper.txt"

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

> `printf` is an alternate way of displaying text on the screen to the `echo` command.

### Nested Conditions: Combining Loops and Tests

We can test strings and nest conditions within loops.
Consider our array example above.
In the following, if the value of the array equals fall or spring, then the script will wish you an appropriate greeting:

```
seasons=(winter spring summer fall)

for i in "${seasons[@]}" ; do
    if [[ ${i} == "spring" || ${i} == "fall" ]] ; then
        echo "I hope you have a nice ${i} semester."
    fi
done
```

## Functions

Functions are blocks of code.
We use functions to organize or re-use code in other programs or scripts.
In `bash`, we define a function using the following syntax:

```
function_name() {
    command 1
    command 2
}
```

In the above `greetings` script, I can place the code within a function that I might call `student_greeting`, and add another function I will call `break_greeting`.
Since I am re-using the array variable in both functions, I can move it outside the function.
This makes it a global variable, since it is available to all the functions in the script.
We still have the `$i` variable within the script.
I can declare that to be a `local` variable to make it explicit.
Then call the functions at the end of the script:

```
#!/usr/bin/env bash
 
SEASONS=(winter spring summer fall)

student_greeting() {
	local i
	for i in "${SEASONS[@]}" ; do
		if [[ ${i} == "spring" || ${i} == "fall" ]] ; then
			echo "I hope you have a nice ${i} semester."
		fi
	done
}

break_greeting() {
	local i
	for i in "${SEASONS[@]}" ; do
		if [[ ${i} == "winter" || ${i} == "summer" ]] ; then
			echo "I hope you have a nice ${i} break."
		fi
	done
}

student_greeting
break_greeting
```

### Global Versus Local Variables

By default, variables in Bash are global.
Since `SEASONS`, in the example above, is a script-wide value that we are treating as fixed, I use an uppercase name (although it will work in lower case, too).
The loop variable `i`, on the other hand, is explicitly declared `local` inside each function.
If you are working within functions and want a variable to only be available within the function, you can declare it as local using `local var_name=value` or `local var_name`.

## Checking Scripts with ShellCheck

Finally, you can check your shell scripts using the `shellcheck` shell script analysis tool.
To use it, let's say I have saved the above script in a file named `greetings` in my `~/bin` directory.
With the proper {she,hash}bang, the file looks like this:

```
#!/usr/bin/env bash
 
seasons=(winter spring summer fall)

for i in "${seasons[@]}" ; do
	if [[ ${i} == "spring" || ${i} == "fall" ]] ; then
		echo "I hope you have a nice ${i} semester."
	fi
done
```

Then to check for errors, run the following command:

```
shellcheck ~/bin/greetings
```

If there are errors, `shellcheck` will tell you what they are and provide a link to documentation on the error.

## `case` and `select`

This is only an introduction to `bash` scripting, and there is far more to learn.
For example, `bash` also includes `case` and `select` statements.
Both of these add interactive elements to our scripts.

## Conclusion

In this lecture, we've covered the basics of Bash scripting, including working with variables, loops, and conditionals.
These tools form the foundation for automating tasks and creating powerful scripts.
Continue practicing by writing small scripts for your own workflow, and explore the resources and style guides provided to deepen your understanding.

If you become interested in `bash` scripting, then you should check out the various style guides that exist.
For example, see the [Shell Style Guide][shellstyle_google] that was authored by coders at Google and the additional resources listed below.

## Resources

I encourage you to explore some useful guides and cheat sheets on Bash scripting:

- [Advanced Bash-Scripting Guide][advancedbash_tldp]
- [Bash scripting cheatsheet][bashcheat]
- [Bash shellcheck][bashshellcheck]
- [Shell Scripting for Beginners][bashbeginners]
- [Bash Shell Scripting for Beginners][bashshellbeginners]
- [Introduction to Bash][introtobash]

[advancedbash_tldp]:https://tldp.org/LDP/abs/html/index.html
[arrays_tldp]:https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_10_02.html
[bashbeginners]:https://www.freecodecamp.org/news/shell-scripting-crash-course-how-to-write-bash-scripts-in-linux/
[bashcheat]:https://devhints.io/bash
[bashshellbeginners]:https://fedoramagazine.org/bash-shell-scripting-for-beginners-part-1/
[bashshellcheck]:https://www.shellcheck.net/
[bash_wiki]:https://en.wikipedia.org/wiki/Bash_(Unix_shell)
[braceexp]:https://www.linuxjournal.com/content/bash-brace-expansion
[commandsub]:https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html
[curlies]:https://www.howtogeek.com/725657/how-to-use-brace-expansion-in-linuxs-bash-shell/
[introtobash]:https://cs.lmu.edu/~ray/notes/bash/
[parameterexp]:https://devhints.io/bash#parameter-expansion
[parameter_opensource]:https://opensource.com/article/17/6/bash-parameter-expansion
[posix]:https://posix.opengroup.org/
[script_wiki]:https://en.wikipedia.org/wiki/Scripting_language
[shebang_wiki]:https://en.wikipedia.org/wiki/Shebang_(Unix)
[shellstyle_google]:https://google.github.io/styleguide/shellguide.html
