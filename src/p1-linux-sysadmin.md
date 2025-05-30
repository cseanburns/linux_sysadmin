# Linux Systems Administration

Author: C. Sean Burns  
Date: 2024-08-23  
Email: [sean.burns@uky.edu](sean.burns@uky.edu)  
Website: [cseanburns.net](https://cseanburns.net)  
GitHub: [@cseanburns](https://github.com/cseanburns)  

## Introduction

This book was written for my Linux Systems Administration course.
The book and course's goals are to provide students with the skills to use Linux for systems administration, and to teach students:

1. how to use the command line in order to become more efficient computer users and more comfortable with using computers in general;
2. how to use command line utilities and programs and to learn what can be accomplished using those programs;
3. how to administer users and manage software on a Linux server;
4. how to secure a Linux server; and
6. the basics of cloud computing;

And finally, this book/course ends on walking students through the process of building a [LAMP stack][lampWikipedia].

## How to Use this Book

### Text and Video

All sections of this book will be accompanied by a video demonstrating the practices described in those sections.
Your are **highly encouraged** to **read through the text first** and **then watch the video**.
Revisit the text to help cement the ideas in place and to work through tasks.

### Markup

There are two markup styles that I want to bring to your attention:

#### Code Blocks

Text that looks like **code blocks** indicate some kind of command or series of commands.
Do not simply copy and paste these commands into your terminal.
You can cause errors if you copy and paste multiple lines of code into your terminal.
Rather, you should type these commands out.
For example, you might copy and paste the following command and be okay in doing so:

```
ls ~
```

But copying and pasting multiple lines can cause problems.
Here's an example of a series of commands in a code block that can cause problems if you copy and paste them into your terminal:

```
cd /important/directory
rm -rf *
echo "All files in /important/directory have been deleted."
```

In the above example,
a mistake in copying and/or pasting the `cd /important/directory` command will result in the deletion of other directories and their files.
It's therefore important to **understand before executing** some code.
Typing out the code and seeing the results printed to the terminal will help foster that understanding.

#### Asides

I occasionally insert **asides** into the text.
These asides generally contain notes or extra comments about the main content.
Asides look like this:

> This is an aside.
> Asides will contain extra information, notes, or comments.

### Theme

At the top of the page is an icon of a paint brush.
The default theme is darker text on a light background, but you can change the theme per your preferences.

### Search

Next to the paintbrush is an icon of a magnifying glass.
Use this to search this work.

### Printing

I intend this book to be a live document, and therefore it'll be regularly updated.
But feel free to print it, if you want.
You can use the print function to save the entire book as a PDF file.
See the printer icon at the top right of the screen to get started.

## About This Book

This book works as a live document since I use it for my fall semester Linux Systems Administration course.
I will update the content as I teach it in order to address changes in the technology and to edit for clarity.

This book is not a comprehensive introduction to the Linux operating system nor to systems administration.
It is designed for an entry level course on these topics.
It is focused on a select and small range of those topics that have the specific pedagogical aims described above.

The content in this book is open access and licensed under the [GNU GPL v3.0][gplrepo].
Feel free to fork this work on [GitHub][linuxSysAdmin] and modify it for your own needs.

I use [mdBook][mdbook] to build [markdown][markdown] source files into this final output.

[gplrepo]:https://github.com/cseanburns/linux_sysadmin/blob/master/LICENSE
[lampWikipedia]:https://en.wikipedia.org/wiki/LAMP_(software_bundle)
[linuxSysAdmin]:https://github.com/cseanburns/linux_sysadmin
[markdown]:https://www.markdownguide.org/
[mdbook]:https://github.com/rust-lang/mdBook
