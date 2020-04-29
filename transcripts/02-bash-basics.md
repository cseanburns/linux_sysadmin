# SSH

To get started, we need to connect to the SISED server. Open up a terminal application, and type:

``ssh username@sised.is.uky.edu``

And then enter your password at the prompt. The password will not be echoed back to you as you type.

If it helps to remember, just think that it's no accident that the above looks like an email address.

# Some Bash Basics

The link at the bottom was used as a reference for this page. Visit that link
for more info. The author, Ryan Chadwick, has some nice tutorials on Linux.

Text formatted like ``this`` indicates that this is a command line utility. Text following a command and within square brackets indicate parameters for that utility: ``command [parameter]``.

## Navigation
- ``pwd``
- ``ls``
- ``cd``
- relative paths
- absolute paths

## File names 
- everything is a file: ``file``
- case sensative
- spaces in names
    - quoting
    - backslash
- hidden files

## Manual pages
- ``man ls``
- ``man -k [search term]`` 
- ``info`` e.g., ``info sed``

## File manipulation
- ``mkdir``
- ``rmdir``
- ``touch``
- ``cp [source] [destination]``
- move and/or rename a file: ``mv [source] [destination]``
- ``rm`` remove a file
- ``rm -rf`` for removing a directory with content

## Reading Files
- ``less``
- ``more``
- ``cat``

## Writing info
- ``echo``

## Text editors
- ``ed``
- ``vim``
- ``nano``

Please visit: [https://ryanstutorials.net/linuxtutorial/][1] for additional
info:

[1]:https://ryanstutorials.net/linuxtutorial/
