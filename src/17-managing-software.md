# Managing Software

## Introduction

Many modern Linux distributions offer some kind of
package manager to
install, manage, and remove software.
These package management systems interact with
curated and audited central repositories of software
that are collected into **packages**.
They also provide a set of tools to learn about 
the software that exists in these repositories.

> If **package management** seems like an odd concept to you,
> it's just a way to manage software installation, and
> it's very similar to the way that Apple and Google
> distribute software via the App Store and Google Play.

On Debian based systems,
which includes Ubuntu,
we use ``apt``, ``apt-get``, and ``apt-cache``
to manage most software installations.
For most cases,
you will simply want to use the ``apt`` command,
as it is meant to combine the functionality commonly
used with ``apt-get`` and ``apt-cache``.

We can also install software from source code or
from pre-built binaries.
On Debian and Ubuntu, for example,
we might want to install
(if we trust it)
pre-build binaries distributed on the
internet as **.deb** files.
These are comparable to **.dmg** files for macOS
and to **.exe** files for Windows.
When installing **.deb** files, though,
we need to use the ``dpkg`` command.

Installing software from source code often
involves compiling the software.
It's usually not difficult to install software
this way, but it can become complicated to manage
software that's installed from source code
simply because it means managing dependencies
and keeping a close eye on new versions
of the software.

Another way to install software
(I know, there's a lot)
is to use the ``snap`` command.
This is a newer way of packaging programs
that involves packaging all of a program
and all of its dependencies
into a single [container][container].
The main point of [snap][snap] seems to be aimed
at IoT and embedded devices, but
it's perfectly usable and preferable
(in some scenarios)
on the desktop because the general
aim is end users and not system administrators.
See the [snap store][snapStore] for examples.

> You might also want to know that some programming
> languages provide their own mechanisms to install
> packages.
> In many cases, these packages may be installed
> with the ``apt`` command, but
> the packages that ``apt`` will install tend to
> be older (but more stable)
> than the packages that a programming language will install.
> For example, Python has the ``pip`` or ``pip3``
> command to install and remove Python libraries.
> The R programming language has the
> ``install.packages()``, ``remove.packages()``, and the
> ``update.packages()`` commands to install R libraries.

Despite all these ways to install, manage, remove, and
update software,
we will focus on using the ``apt`` command, which
is pretty straightforward.

## APT

Let's look at the basic ``apt`` commands.

### apt update

Before installing any software,
we need to update the index of packages that are available
for the system.

```
sudo apt update
```

### apt upgrade

The above command will also state if there is software
on the system that is ready for an upgrade.
If any upgrades are available,
we run the following command:

```
sudo apt upgrade
```

### apt search

We may know a package's name when we're ready to install it, but
we also may not.
To search for a package,
we use the following syntax:

```
apt search [package-name]
```

> Package names will never have spaces between words.
> Rather, if a package name has more than one word,
> each word will be separated by a hyphen.

In practice, say I'm curious if there
are any console based games:

```
apt search ncurses game
```

> I added **ncurses** to my search query because
> the [ncurses][ncurses] library is often used to create console-based
> applications.

### apt show

The above command returned a lit that included
a game called **ninvaders**, which
seems to be a console-based Space Invaders like game.
To get additional information about this package,
we use the ``apt show [package-name]`` command:

```
apt show ninvaders
```

### apt install

It's quite simple to install the package called **ninvaders**:

```
sudo apt install ninvaders
```

### apt remove or apt purge

To remove an installed package,
we can use either the ``apt remove`` or
the ``apt purge`` commands.
Sometimes when a program is installed,
configuration files get installed with it
in the **/etc** directory.
The ``apt purge`` command will remove
those configuration files but the 
``apt remove`` command will not.
Both commands are offered because sometimes
it is useful to keep those configuration files.

```
apt remove ninvaders
```

Or:

```
apt purge ninvaders
```

### apt autoremove

All big software requires other software to run.
This other software are called [dependencies][dependencies].
The ``apt show [package-name]`` command
will list a program's dependencies.
However, when we remove software with the prior
two commands, the dependencies,
even if no longer needed,
are not necessarily removed.
To remove them,
(which restores more disk space)
we do:

```
sudo apt autoremove
```

### apt history

Unfortunately, the ``apt`` command does
not provide a way to get a history of how
it's been used on a system, but
a log of its activity is kept.
We can review that log with the following command:

```
less /var/log/apt/history.log
```

## Daily Usage

This all may seem complicated, but
it's really not.
For example, to keep my systems updated,
I run the following two commands on a daily
or near daily basis:

```
apt update
sudo apt upgrade
```

## Conclusion

There are a variety of ways to install
software on a Linux or Ubuntu system.
The common way to do it on Ubuntu is to
use the ``apt`` command, which
was covered in this section.

We'll come back to this command often because
we'll soon install and setup a complete LAMP 
(**L**inux, **A**apache, **M**ariaDB, and **P**HP) server.
Until then, I encourage you to read through the
manual page for ``apt``:

```
man apt
```

[snap]:https://ubuntu.com/core/services/guide/snaps-intro
[snapStore]:https://snapcraft.io/
[container]:https://www.ibm.com/cloud/learn/containers
[ncurses]:https://en.wikipedia.org/wiki/Ncurses
[dependencies]:https://queue.acm.org/detail.cfm?id=3344149
