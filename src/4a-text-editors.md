# Text editors

Working on the command line
means writing a lot of commands.
But there will be times when we
want to save some of the commands
that we write in order to re-use them later,
or we might want to develop the commands
into a script (i.e., program) because we might
want to automate a process.
The shell is great for writing one off commands,
so-called **one-liners**,
but it's not a great place
to write multi-line or very long commands.
Therefore it can be helpful
to write and save our commands
in a text editor.
In this lesson,
we'll learn about three text editors:
``ed``, ``vim``, and ``nano``.
Of these,
I'll encourage you to use ``nano``, but
I want you to know something about
``ed`` and ``vim`` because
``ed``, even if not often used,
is historically important
to the Unix and Linux ecosystem.
(I use ``ed`` almost daily).
Vim, which is my everyday editor,
is important and
highly used and 
under active development to this day.
If you want to use Vim,
I'd encourage you to do so, but
know that it's not required because
it takes some time and
consistent practice to get good at it.

Another thing to keep
in mind is that
the shell that we are
working with is called ``bash``,
and ``bash`` is a
full-fledged programming language.
That means that when we write a simple command,
like ``cd public_html``,
we are programming.
It makes sense that the
more programming that we do,
the better we'll get at it.
This requires 
more sophisticated environments
to help manage our programs
than the command line
prompt can provide.
Text editors fulfill that role.

As we learn more about
how to do systems administration
with Linux,
we will need to edit
configuration files, too.
Most configuration files exist
in the ``/etc`` directory.
For example,
later in the semester
we will install the
[Apache Web Server][apache], and
we will need to edit
Apache's configuration
files in the process.
We could do this using
some of the tools
that we've already covered,
like ``sed`` and ``awk``,
but it'll make our lives
much easier to use a text editor.

In any case,
in order to save our
commands or edit text files, 
a text editor is very helpful.
Programmers use text editors
to write programs,
but because programmers 
often work in
graphical user environments,
they may often use 
graphical text editors
or graphical [IDE][ide]s. 
As systems administrators,
it would be unusual to have a
graphical user interface
installed on a server.
The servers that we
manage will contain
limited or specific software
that serves the server's
main purpose.
Additional software on a server
that is not relevant to the
main function of a server
only takes up extra disk space,
consumes valuable computing resources, and
poses an additional security footprint.

As stated,
although ``ed`` and ``vim``
are difficult,
they are very powerful editors.
I use both daily, and
am in fact using ``vim``
to write what this.
I believe they are
both worth learning;
however, for the purposes
of this course,
I think it's more important
that you are aware of them.
If you wish to learn more,
there are lots of additional
tutorials on the web
on how to use these
fine, esteemed text editors.

## ``ed``

``ed`` is a line editor
that is installed by default
on many Linux distributions.
Ken Thompson created ``ed``
in the late 1960s
to write the original
Unix operating system.
It was used without computer monitors
because those were still uncommon,
and instead for [teletypewriters (TTYs)][ttys]
and [printers][printers].
The lack of a visual display,
like a monitor,
is the reason
that ed(1) was written
as a line editor.
If you visit that second link,
you will see the
terminal interface
from those earlier days.
It is the same basic
interface you are using now
when you use
your terminal applications,
which are virtualised versions
of those old teletypewriters.
I think this is a testament
of the power of the terminal:
that advanced computer users
still use the same
basic technology today.

In practice,
when we use a
line editor like ``ed``,
the main process of
entering text is like
any other editor.
The big difference is
when we need
to manipulate text.
In a graphical text editor,
if we want
to delete a word or
edit some text,
we might backspace
over the text or
highlight a word
and delete it.
In a line editor,
we manipulate text by
referring to lines or
across multiple lines and
then run commands
on the text in those line(s).
This is much
the same process
we followed when
we covered
``grep``, ``sed``, and ``awk``,
and especially ``sed``, and
it should not
surprise you that
[these are related][oreillyEd].

To operationalize this,
like in ``sed``,
each line has an **address**.
The address for
line 7 is **7**,
and so forth.
Line editors like
``ed`` are command driven. 
There is no menu to
select from at
the top of the *window*,
and in fact,
when we used ``ed``
to open an existing file,
the text in the file
isn't even printed on the screen.
If a user wants
to delete a word, or
print (to screen) some text,
the user has to command
the line editor
to print the relevant line
by specifying its address and
issuing a command
to delete the word on that line,
or print the line.
Line editors also
work on ranges of line,
including all the
lines in the file,
just like ``sed`` does.

In fact,
many of the commands
that ``ed`` uses are
also used by ``sed``,
since ``sed`` is
based on ``ed`` .
To compare:

| Command         | ``sed``   | ``ed``   |
| ---------       | --------- | -------- |
| append text     | ``a``     | ``a``    |
| replace text    | ``c``     | ``c``    |
| delete text     | ``d``     | ``d``    |
| insert text     | ``i``     | ``i``    |
| print text      | ``p``     | ``p``    |
| substitute text | ``s``     | ``s``    |
| print w/ line # | ``=``     | ``n``    |

However, there are big
differences that mainly relate
to the fact that
``ed`` is a text editor
and ``sed`` is not.
For example,
here are some commands
that mostly make sense in
``ed`` as a text editor.
``sed`` can do
some of these tasks,
where it makes sense
(e.g., we don't quit ``sed``),
but sometimes in a non-trivial way.

| Command                 | ``ed`` only   |
| ---------               | ------------- |
| edit file               | ``e``         |
| join lines              | ``j``         |
| copies lines            | ``t``         |
| moves lines             | ``m``         |
| undo                    | ``u``         |
| saves file              | ``w``         |
| quits ``ed``            | ``q``         |
| Quits ``ed`` w/o saving | ``Q``         |

There are other differences,
but these are sufficient for our purposes.

Let's see how to use
``ed`` to open a file, and
print the content with
and without line numbers.

```
ed operating-systems.csv
183
1,$p
OS, License, Year
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
1,$n
1 OS, License, Year
2 Chrome OS, Proprietary, 2009
3	FreeBSD, BSD, 1993
4	Linux, GPL, 1991
5	iOS, Proprietary, 2007
6	macOS, Proprietary, 2001
7	Windows NT, Proprietary, 1993
8	Android, Apache, 2008
```

Using ``ed``,
another way to remove
the header line of the
**operating-systems.csv** file
is to specify the line number (``1``)
and then the delete command (``d``),
just like in ``sed``.
This becomes a permanent change
if I save the file
with the ``w`` (write) command:

```
1d
1,$p
Chrome OS, Proprietary, 2009
FreeBSD, BSD, 1993
Linux, GPL, 1991
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
```

To refer to line **ranges**,
I add a comma between **addresses**.
Therefore, to delete lines 1, 2, and 3,
and then quit without saving:

```
1,3d
,p
iOS, Proprietary, 2007
macOS, Proprietary, 2001
Windows NT, Proprietary, 1993
Android, Apache, 2008
Q
```

Note that with ``sed``,
in order to make a change **in-place**,
we need to use the ``-i`` option.
But with ``ed``,
we save changes
with the ``w`` command.

I can use ``ed``
to **find and replace** strings.
The syntax is the same as it is in ``sed``.
I'll start with a fresh version of the file:

```
ed operating-systems.csv
183
1,$s/Linux/GNU\/Linux/
```

If we want to add
new rows to the file,
we can append ``a``
or insert ``i`` text 
after or at specific lines.
To append text after
line 3, use ``a``.
We enter a period
on a newline to leave
input mode and return
to command mode:

```
3a
FreeDOS, GPL, 1998
.
```

Because we enter input mode
when using the ``a``, ``i``,
or ``c`` commands,
we enter a period ``.`` on a line
by itself to revert 
to command mode.

To insert at line 2, use ``i``:

```
2i
CP/M, Proprietary, 1974
.
```

Like ``sed``,
we can also
**find and replace** using
regular expressions instead
of line numbers.
I start a new ``ed`` session
to reload the file to start fresh:

```
ed operating-systems.csv
183
/Linux/s/Linux/GNU\/Linux/
```

Of course,
``ed`` can be used
to write and
not simply edit files.
Let's start fresh,
in the following session,
I'll start ``ed``,
enter append mode ``a``,
write a short letter,
exit append mode ``.``,
name the file ``f``,
write ``w`` (save) the file,
and quit ``q``:

```
ed
a
Dear Students,

I hope you find this really interesting.
Feel free to practice and play on the command line,
as well as use tools like ed, the standard editor.

Sincerely,
Dr. Burns
.
f letter.txt
w
q
```

It's good to know something
about ``ed`` not just
for historical reasons,
but also because
the line editing technology
developed for it
is still in use today,
and is a basic part of
the ``vim`` text editor,
which is a very
widely used application.

## ``vim``

The ``vim`` text editor
is an **improved** version of
the ``vi`` text editor
and is in fact called **Vi IMproved**.
(The original ``vi`` text editor is
usually available via the ``nvi``
editor these days.
``nvi`` is a rewrite
of the original.)
``vim`` is a visual editor.
It is multi-modal like ``ed`` and
is a direct descendant through [vi][vi].
Due to this genealogy,
``vim`` can use many
of the same commands as ``ed`` does
when ``vim`` is in command mode.
Like ``ed``,
we can start ``vim`` at the Bash prompt
with or without a file name.
Here I will open
the **letter.txt** file with ``vim``.
The default mode is **command mode**:

```
vim letter.txt
Dear Students,

I hope you find this really interesting.
Feel free to practice and play on the command line,
as well as use tools like ed, the standard editor.

Sincerely,
Dr. Burns
```

To enter **insert mode**,
I can type ``i`` or ``a``
for **insert** or **append** mode.
There isn't any difference
on an empty file,
but on a file that has text,
``i`` will start **insert**
mode where the cursor lies,
and **a** will start
**insert** mode
right-adjacent to the cursor.
Once in **insert** mode,
you can type text
as you normally would and
use the arrow keys
to navigate around the file.

To return to **command mode** in ``vim``,
you press the **Esc** key.
And then you can enter
commands like you would with ``ed``,
using the same syntax.

Unlike ``ed``,
when in **command mode**,
the commands we type are
not placed wherever the cursor is,
but at the bottom of the screen.
Let's first turn on
line numbers to know
which address is which,
and then we'll
replace **ed** with **Ed**.
Note that I precede
these commands with a colon:

```
:set number
:5s/ed/Ed/
```

One of the more powerful things
about both ``ed`` and ``vim`` is that
I can call Bash shell
commands from the editors.
Let's say that I wanted
to add the date to my letter file.
To do that,
Linux has a command
called ``date`` that
will return today's
date and time.
To call the ``date`` command
within Vim and
insert the output
into the file,
I press **Esc** to enter **command mode**
(if I'm not already in it),
enter a colon,
type ``r`` for the
read into buffer command,
then enter the shell escape command,
which is an exclamation point ``!``,
and then the Bash shell ``date`` command:

```
:r !date
Dear Students,

I hope you find this really interesting.
Feel free to practice and play on the command line,
as well as use tools like ed, the standard editor.
Thu Jun 30 02:44:08 PM EDT 2022

Sincerely,
Dr. Burns
```

Since the last edit I made
was to replace **ed** with **Ed**,
``vim`` entered the date
after that line,
which is line 6.
To move that date line
to the top of the letter,
I can use the move ``m``
command and move it to line 0,
which is the top of the file:

```
:6m0
Thu Jun 30 02:44:30 PM EDT 2022
Dear Students,

I hope you find this really interesting.
Feel free to practice and play on the command line,
as well as use tools like Ed, the standard editor.

Sincerely,
Dr. Burns
```

Although you can use the
arrow keys and Page Up/Page Down keys
to navigate in ``vim`` and ``vi``,
by far the most excellent thing
about this editor is to be
able to use the **j,k,l,h** keys
to navigate around a file:

- ``j`` moves down line by line
- ``k`` moves up line by line
- ``l`` moves right letter by letter
- ``h`` moves left letter by letter

Like the other commands,
you can precede this with addresses.
To move 2 lines down,
you type ``2j``,
and so forth.
``vi`` and ``vim`` have had
such a powerful impact on
software development that
you can in fact use these
same keystrokes to navigate
a number of sites such as
Gmail, Facebook, Twitter, and more.

To save the file and exit ``vim``,
return to **command mode**
by pressing the **Esc** key,
and then write and quit:

```
:wq
```

The above barely
scratches the surface.
There are whole books
on these editors as well as
websites, videos, etc that explore them, and
especially ``vim`` in more detail.
But now that you have
some familiarity with them,
you might find this funny:
[Ed, man! !man ed][maned].

## ``nano``

The ``nano`` text editor
is the user-friendliest
of these text editors but
still requires some adjustment
as a new commandline user.
The friendliest thing about
``nano`` is that it is modeless,
which is what you're
already accustomed to using,
because it can be used
to enter text and manipulate text
without changing to
insert or command mode.
It is also friendly because,
like many graphical text editors
and software,
it uses control keys
to perform its operations.
The tricky part is that
the control keys are assigned
to different keystroke combinations
than what
many graphical editors
(or word processors) use
by convention today.
For example,
instead of Ctrl-c or Cmd-c to copy,
in ``nano`` you press the ``M-6`` key
(press ``Alt, Cmd, or Esc key``
and ``6``) to copy.
Then to paste,
you press ``Ctrl-u`` instead
of the more common ``Ctrl-v``.
Fortunately, ``nano`` lists
the shortcuts at the bottom
of the screen.

The shortcuts listed
need some explanation, though.
The carat mark is shorthand
for the keyboard's **Control (Ctrl)** key.
Therefore to **Save As** a file,
we **write** out the file
by pressing ``Ctrl-o``.
The **M-** key is also important,
and depending on your keyboard
configuration,
it may correspond to your
``Alt, Cmd, or Esc`` keys.
To search for text,
you press ``^W``,
If your goal is to copy,
then press **M-6**
to copy a line.
Move to where you want
to paste the text,
and press **Ctrl-u**
to paste.

For the purposes of this class,
that's all you really
need to know about ``nano``.
Use it and get comfortable writing in it.
Some quick tips:

1. ``nano file.txt`` will open and display the file named **file.txt**.
1. ``nano`` by itself will open to an empty page.
1. Save a file by pressing ``Ctrl-o``.
1. Quit and save by pressing ``Ctrl-x``.
1. Be sure to follow the prompts at the bottom of the screen.

## Conclusion

In prior lessons,
we learned how to use the
Bash interactive shell and
how to view, manipulate, and
edit files from that shell.
In this lesson,
we learned how to use
several command line text editors.
Editors allow us to save our commands,
create scripts,
and in the future,
edit configuration files.

The commands we used in this lesson include:

- ``ed`` : line-oriented text editor
- ``vim`` : Vi IMproved, a programmer's text editor
- ``nano`` : Nano's ANOther editor, inspired by Pico

[ttys]:https://en.wikipedia.org/wiki/Teleprinter
[printers]:https://www.youtube.com/watch?v=S81GyMKH7zw
[attacksurface]:https://en.wikipedia.org/wiki/Attack_surface
[modesui]:https://en.wikipedia.org/wiki/Mode_(user_interface)
[vi]:https://en.wikipedia.org/wiki/Vi
[maned]:https://www.gnu.org/fun/jokes/ed-msg.en.html
[apache]:https://httpd.apache.org/
[ide]:https://en.wikipedia.org/wiki/Integrated_development_environment
[oreillyEd]:https://www.oreilly.com/library/view/sed-awk/1565922255/ch02s01.html
