# Text editors

In addition to writing commands at the command prompt, we can also write commands (and other kinds of text) in text editors, save those files as scripts, and then execute the files so that the commands in the script run. This process can save lots of time, especially when we find ourselves writing longer commands. We can enter long commands at the command prompt, but it is difficult to fix errors when writing multi-line commands there.

It's important to have some familiarity with command line text editors not just because we may need to write out longer scripts, but also because command line text editors may be the primary way we have of modifying configuration files on a server. We'll learn more about configuration files later in the semester, but these are files, often in the ``/etc/`` directory, which define the parameters of various services on a server, such as how a web server delivers web sites or how a firewall blocks certain kinds of internet connections. Graphical based text editors can be nice, but graphical user environments are not always available on servers because of the computer resources they require, which are better used for the purposes of the server, and because the security bugs that come with graphical user software unnecessarily increase the [attack surface][attack_surface] of the server.

In this demo, I am going to address three text editor programs and I will start with the most difficult one to learn (``ed``) and end with the easiest one to learn (``nano``). For this course, I suggest that you use ``nano``, but the first two text editors, ``ed`` and ``vim``, are very much a part of Unix and Linux culture. I want you to be familiar with them for that reason but also because their basic designs have influenced a lot of other common technologies.

## ``ed``

``ed`` is specifically a line editor, and it's the most likely text editor to be installed on a Linux distribution (``nano`` is installed by default on Fedora now). ``ed``, or an early version of it, is also the first text editor for the Unix operating system and was developed by Ken Thompson, one of the Unix creators, in the late 1960s. It was written without computer monitors in mind, because those were still uncommon, and instead for [teletypewriters (TTYs)][ttys] and [printers][printers]. If you visit that second link, what you will essentially see is the terminal interface from those earlier days, and it is the same basic interface you're using when you use your terminal applications, which are now virtualised versions of those old teletypewriters. It's a testament of the power of the terminal that advanced computer users still use the same basic technology today.

In practice, when we use a line editor like ``ed``, the main process of entering text is like any other editor. The big difference is when we need to manipulate the text. In a graphical based text editor, if we want to delete a word or edit some text, we might just backspace over the text or highlight a word and delete it. In a line editor, we manipulate text by referring to lines or across multiple lines and then run commands on the text in those line(s). To operationalize this, this means that each line has an **address**, and the address for line 7 is, for example, **7**, and so forth. Line editors like ``ed`` are command driven. There is no menu to select from at the top of the *window*. Instead, if a user wants to delete a word, the user first has to direct the line editor to the relevant line by its address and then command the line editor to delete the word on that line. Line editors can also work on ranges of line, including all the lines in the file.

Commands are cryptic in line editors and usually are called by a single letter. For example, to delete a line in ``ed``, we use the **d** command. To print a line, we use the **p** command. To **substitute** (or replace) a word in a line, we use the **s** command. If I wanted to delete line 7 in ``ed``, I'd first enter the address and then the **d** command at the ``ed`` prompt:

```
7d
```

And to print it, I would enter the address and then the **p** command:

```
7p
```

Substituting a word is a tiny bit more complicated because it involves first addressing the line and then searching the line for the word to substitute. This process means that there is a bit more to the command. Here the syntax is:

```
[ADDRESS[,ADDRESS]]COMMAND[PARAMETERS]
```

The square brackets in this format example are not used in the actual commands but only to demarcate the parts of the command. The first ADDRESS is required, but the second ADDRESS is optional and would be used only if I wanted to indicate a range of lines. The COMMAND is stated, and if additional parameters are needed, then those are optional. Imagine then that on line 7, I had the following sentence:

```
I use linux.
```

Now imagine that I am editing the file and realize that the word **linux** is a proper noun and should be capitalized. The substitute command requires that I first **address** line 7, then state the command **s**, and then search for the word **linux**, and then replace it with the word **Linux**.

```
7s/linux/Linux/
```

You can see that the operation we're doing is familiar to you already because it's like finding and replacing text in a word processor:

```
7s/find/replace/
```

If I wanted to substitute or replace the word **linux** with **Linux** on lines 5-7, then I'd indicate that on the **address range** by typing ``5,7``, which ``ed`` interprets as lines 5, 6, 7 (like **5-7**):

```
5,7s/linux/Linux/
```

Line editors like ``ed`` are also modal, which means they have separate [modes][modes_ui] for inputting text and for issuing commands on text. Text editors in graphical user environments, like Notepad on Microsoft Windows or TextEdit on macOS, are **modeless**---the user can switch between writing text and editing text without changing the environment and by using keyboard shortcuts (like Ctrl-c or Cmd-c to copy) or using the menu bar. But in modal text editors, ``vim`` included, the user has to enter one mode to write text (the **input mode**) and another mode to run commands on the text (the **command mode**) (``vim`` has many modes but three main ones).

To start with ed, I simply type ``ed`` on the Bash prompt followed by an optional file name to work on, which could be a new file or an existing file. Let's say I wanted to create a file called **letter.txt**, then I'd type:

```
ed letter.txt
letter.txt: No such file or directory
```

Here we see that when ``ed`` opens, it's not very forthcoming or user friendly and if the file **letter.txt** does not already exist, it returns an error message informing of us that. Also, by default we are in command mode. To enter **insert** mode so that I an start writing my letter, I can type an **i** for **insert** or an **a** for **append**:

```
a
Dear Students,

I hope you find this really interesting and that you feel free to practice and play on the command line, as well as use tools like ed, the standard editor.

Sincerely,
Dr. Burns
.
```

After I've typed that letter, my goal is to leave **insert** mode and enter **command** mode, which I need to do if I just want to save and exit ``ed``. I do that at the end when I press return to get a new line and typed a period by itself. This is how we tell ``ed`` to exit **input** mode and enter **command** mode.

The first line is line 1, but it's not obvious that this is always so, and it would be hard to know a line number in ``ed`` when the file is long. To see line numbers, I can tell ``ed`` to show them to me with the following command:

```
,n
```

That will display all the line numbers in the file because the comma is
shorthand for the entire address space. Or I could tell ``ed`` to show me line
numbers for a range:

```
2,3n
```

And that will print out lines 2 and 3 with line numbers. If I wanted to print those two lines without line numbers, then I switch **n** for **p**:

```
2,3p
```

The non-shorthand way to refer to the entire address space, range 1 to the last line, would be to write ``1,$n``, where **1** marks the first line and **$** marks the last line.

There's a lot more we can do with this text editor because it's extremely powerful, but for now, let me just show you how to exit. To do so, make sure you're in **command** mode (press enter to get a new line and then press **.** (or period) to enter **command** mode. If you want to save the file and then quit, then type:

```
w
q
```

If you want to quit without saving, then type:

```
Q
```

It's good to know something about ``ed`` not just for cultural reasons, but also because the line editing technology developed for it is still in use today, and is a basic part of the ``vim`` text editor, which is a very widely used application.

## ``vim``

The ``vim`` text editor is a take on the ``vi`` text editor and is in fact called **Vi IMproved**. Although ``vim`` is not a line editor, but a screen-oriented editor, it is multi-modal like ``ed`` and in fact is its direct descendant through [vi][vi].  Due to this genealogy, ``vim`` can use many of the same commands as ``ed`` does when ``vim`` is in command mode. Like ``ed``, we can start ``vim`` at the Bash prompt with or without a file name. Here I will open the **letters.txt** file with ``vim``, and will automatically be in **command mode**:

```
vim letters.txt
```

To enter **insert mode**, I can type **i** or **a** for **insert** or **append** mode. The difference is that **i** will start **insert** mode where the cursor lies, and **a** will start **insert** mode right-adjacent to the cursor. Once in **insert** mode, you can type text as you normally would and use the arrow keys to navigate around the file.

To get into **command mode** in ``vim``, you can press the **Esc** key. And then you can enter commands like you would with ``ed``, using the same syntax:

```
[ADDRESS[,ADDRESS]]COMMAND[PARAMETERS]
```

Unlike ``ed``, when in **command mode**, the commands we type are not wherever the cursor is, but at the bottom of the screen. Let's first turn on line numbers so we know which address is which, and then we'll replace **ed** with **Ed**. Note that I precede these commands with a colon:

```
:set number
:3s/ed/Ed/
```

One of the more powerful things about both ``ed`` and ``vim`` is that I can call Bash shell commands from the editors. Let's say that I wanted to add the date to my letter file. To do that, Linux has a command called ``date`` that when typed and executed, will return today's date. To call the ``date`` command within Vim and insert the output into the file, I press **Esc** to enter **command mode** (if I'm not already in it), enter a colon, and then use the shell escape command, which is an exclamation point ``!``, type a space, then ``r`` for the read file into buffer command, and then the Bash shell ``date`` command:

```
:! r date
```

Vim/vi users also love the navigation keystrokes to move around ``vim``, which are the **j,k,l,h** keystrokes:

- **j** moves down line by line
- **k** moves up line by line
- **l** moves right letter by letter
- **h** moves left letter by letter

Like the other commands, you can precede this with addresses. To move 2 lines down in ``vim``, you type ``2j``, and so forth. Vi/Vim have had such a powerful impact on software development that you can in fact use these same keystrokes to navigate a number of sites such as Gmail and Facebook.

To save the file and exit ``vim``, we go into **command mode** by pressing the **Esc** key, and then:

```
:wq
```

The above only barely scratches the surface and there are whole books on these editors as well as websites, videos, etc that explore them, and especially ``vim`` in more detail. But now that you have some familiarity with them, you might find this hilarious: [Ed, man! !man ed][man_ed].

## ``nano``

The ``nano`` text editor is the user-friendliest of these text editors but still requires some adjustment as a new command line user. The friendliest thing about ``nano`` is that it is modeless, which is what you're already accustomed to using, because it can be used to enter text and manipulate the text without changing to insert or command mode. It is also friendly because, like many graphical text editors and other graphical software, it uses control keys to perform its operations. The tricky part is that the control keys are assigned to different keystroke combinations than what many graphical editors (or word processors) use. For example, instead of Ctrl-c or Cmd-c to copy, in ``nano`` you press the **Alt-6** keys (press **Alt** and **6**). Then to paste, you press **Ctrl-u** instead of the more common **Ctrl-v**. Fortunately, ``nano`` lists the shortcuts at the bottom of the screen.

The shortcuts listed need some explanation. The carat mark is shorthand for the keyboard's **Control (Ctrl)** key. Therefore to Save As a file, we **write** out the file by pressing **Ctrl-o** (**Ctrl-s** works but will not return any prompts). The **Alt** key is also important, and the shorthand for that is **M-**. To mark (highlight) text, you press **Alt-a**, which is listed as **M-A** in the shortcut list at the bottom of the screen, then move the cursor over the text that you want to highlight. If your goal is to copy, then press **Alt-6** to copy the marked (highlighted) text. Move to where you want to paste the text, and press **Ctrl-u** to paste.

For the purposes of this class, that's all you really need to know about ``nano``. Use it and get comfortable writing in it. Some quick tips:

1. ``nano file.txt`` will open the file named file.txt
1. ``nano`` will open to an empty page
1. In ``nano``, save a file by pressing ``Ctrl-o`` or ``Ctrl-s``
1. Be sure to follow the prompts at the bottom of the screen
1. Use the arrow keys to navigate around the page/file

[ttys]:https://en.wikipedia.org/wiki/Teleprinter
[printers]:https://www.youtube.com/watch?v=2B-U-5ylvWo
[attack_surface]:https://en.wikipedia.org/wiki/Attack_surface
[modes_ui]:https://en.wikipedia.org/wiki/Mode_(user_interface)
[vi]:https://en.wikipedia.org/wiki/Vi
[man_ed]:https://www.gnu.org/fun/jokes/ed-msg.en.html
