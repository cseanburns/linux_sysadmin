# Managing Software

By the end of this section, you should understand:

1. **Package Management**: Modern Linux distributions use package managers like `apt` for software management,
similar to app stores on mobile devices.
2. **APT Basics**: Essential commands include `apt update` to refresh the package list,
`apt upgrade` to install available updates, and `apt install` to add new packages.
3. **Installing Software**: Besides `apt`, software can also be installed from source,
as `.deb` packages with `dpkg`, or as `snap`, `flatpak`, or `appimage` packages for broader compatibility.
4. **Maintaining Your System**: Use `apt autoremove` to clean up unused dependencies, and `apt clean` or
`apt autoclean` to clear out cached packages to free up disk space.
5. **Package Information**: Use `apt show` for package details, `apt policy` for version information, and
`apt search` to find packages by name or keyword.
6. **Removal Options**: `apt remove` uninstalls packages, while `apt purge` also removes configuration files. 
7. **Script Automation**: Common update and cleanup tasks can be automated with a bash script and
run with `sudo` for ease of use.
8. **APT Logs**: Review `apt` activity by checking `/var/log/apt/history.log`.
9. **Manual Reading**: For deeper understanding, consult the `man apt` manual page.

## Getting Started

Many modern Linux distributions offer some kind of package manager to install, manage, and remove software.
These package management systems interact with curated and audited central repositories of software
that are collected into **packages**.
They also provide a set of tools to learn about the software that exists in these repositories.

> If **package management** seems like an odd concept to you, it's just a way to manage software installation.
> It's very similar to the way that Apple and Google distribute software via the App Store and Google Play.

### APT

On Debian based systems, which includes Ubuntu, we use `apt`, `apt-get`, and `apt-cache` to manage most software installations.
For most cases, you will simply want to use the `apt` command.
It is meant to combine the functionality commonly used with `apt-get` and `apt-cache`.

### DPKG

We can also install software from source code or from pre-built binaries.
On Debian and Ubuntu, we can install (if we trust it) pre-built binaries distributed on the internet as **.deb** files.
These are comparable to `.dmg` files for macOS and to **.exe** files for Windows.
When installing `.deb` files, we generally use the `dpkg` command,
although it's possible to use `apt` to install these files, too.

### Source Code

Installing software from source code often involves compiling the software.
It's usually not difficult to install software this way.
However, it can become complicated to manage software that's installed from source code
simply because it means managing dependencies.
This means we would need to manually track new patches or versions of the software.

### Snap, Flatpak, and AppImage

Another way to install software is to use `snap` or `flatpak` systems or `appimage` files.
These are newer ways of packaging programs that involves packaging a program and all of its dependencies
as self-contained packages.
The main audience seems to be aimed at IoT, embedded devices, and desktop/laptop systems.
If you see **loop** devices in the output of the `lsblk` command, this is the result of the `snap` system.
See the [Snap][snap_store], [Flatpak][flatpak], and [AppImage][appimage] sites for example applications.

### Language Package Managers

In addition to the above, some programming languages provide their own mechanisms to install packages.
In many cases, these packages may be installed with the `apt` command,
but the packages that `apt` will install tend to be older (but more stable)
than the packages that a programming language will install.
For example, Python has the `pip` or `pip3` command to install and remove Python libraries.
The R programming language has the `install.packages()`, `remove.packages()`, and
the `update.packages()` commands to install R libraries.

Despite all these ways to install, manage, remove, and update software,
we will focus on using the `apt` command, which is pretty straightforward.

## Using APT

Let's look at the basic `apt` commands.

### `apt update`

Before installing any software, we need to update the index of packages that are available for the system.
We do so with:

```
sudo apt update
```

### `apt upgrade`

When we update the package index, we will be informed if we need to upgrade any packages.
If any upgrades are available, we run the following command:

```
sudo apt upgrade
```

### `apt search`

We may know a package's name when we're ready to install it, but we also may not.
To search for a package, we use the following syntax, replacing `[package name]` with search terms:

```
apt search [package-name]
```

> Package names will never have spaces between words.
> Rather, if a package name has more than one word, each word will be separated by a hyphen.

In practice, say I'm curious if there are any console based games:

```
apt search ncurses game
```

> I added **ncurses** to my search query because the [ncurses][ncurses] library
> is often used to create console-based applications.

### `apt show`

The above command returns a list that includes a game called **ninvaders**, which is a console-based Space Invaders like game.
To get additional information about this package, we use the `apt show [package-name]` command:

```
apt show ninvaders
```

If we want to see what a package needs or depends on, then we can use the following command:

```
apt-cache depends ninvaders
```

### `apt policy`

To get a list of various versions that are available to download, we can use the `apt policy` command:

```
apt policy ninvaders
```

### `apt install`

It's quite simple to install the package called **ninvaders**:

```
sudo apt install ninvaders
```

### `apt remove` or `apt purge`

To remove an installed package, we can use either the `apt remove` or the `apt purge` commands.
Sometimes when a program is installed, configuration files get installed with it in the `/etc` directory.
The `apt purge` command removes those configuration files but the `apt remove` command does not.
Both commands are offered because sometimes it is useful to keep those configuration files.

```
sudo apt remove ninvaders
```

Or:

```
sudo apt purge ninvaders
```

> Other fun terminal based games include: `tint` (a tetris clone), `ttysolitaire`, and `bsdgames`,
> the latter installs multiple console based games such as `backgammon, `go-fish`, `hangman`, and more.
> All of these will be installed in `/usr/games`.

### `apt autoremove`

All big software requires other software to run.
This other software are called [dependencies][dependencies].
The `apt show [package-name]` command will list a program's dependencies, as well as the `apt-cache depends` command.
However, when we remove software when using the `apt remove` or `apt purge` commands,
the dependencies, even if no longer needed, are not necessarily removed.
To remove them and restore disk space, we do:

```
sudo apt autoremove
```
 
### `apt clean` or `apt autoclean`

When we install software using the `apt` command, the installed packages are stored locally.
We don't necessarily need those once the binaries have been installed.
Or we may want to remove them especially if we're removing the binaries.
The `apt clean` and `apt autoclean` commands clear up that local cache of packages.
We use either of these commands to free up disk space.

Between the two, the `apt clean` command **removes all package files** that are stored in `/var/cache/apt/archives`.
But the `apt autoclean` **only removes package files that can no longer be downloaded**.
I generally use the `apt clean` command to free up more disk space.
I will only use `apt autoclean` if I want to keep an package to older software, but this is rare.

To use:

```
sudo apt clean
```

Or:

```
sudo apt autoclean
```

### apt history

Unfortunately, the `apt` command does not provide a way to get a history of how it's been used on a system.
This will change in the future when `apt` gets a `apt history-list` command and an `apt history-info` command
(Source: [Phoronix][apt_history]).
In the meantime, the `apt` system keeps a log of its activity, and we can review that log file with the following command:

```
less /var/log/apt/history.log
```

## Daily Usage

This all may seem complicated, but it's really not.
For example, to keep my systems updated, I run the following four commands on a daily or near daily basis:

```
sudo apt update
sudo apt upgrade
sudo apt autoremove
sudo apt clean
```

You can add these commands to a script that we could call `update.sh` and put it in `/usr/local/bin`:

```
#!/usr/bin/env bash

apt update && apt upgrade && apt autoremove && apt clean
```

And then we make the file executable:

```
sudo chmod 700 /usr/local/bin/update.sh`:
```

And execute/run it with the following command:

```
sudo update.sh
```

## Conclusion

There are a variety of ways to install software on a Linux or Ubuntu system.
The common way to do it on Ubuntu is to use the `apt` command, which was covered in this section.

We'll come back to this command often because we'll soon install and setup a complete LAMP
(Linux, Apache, MariaDB, and PHP) server.
Until then, I encourage you to read through the manual page for `apt`:

```
man apt
```

[appimage]:https://appimage.org/
[dependencies]:https://queue.acm.org/detail.cfm?id=3344149
[flatpak]:https://flatpak.org/
[ncurses]:https://en.wikipedia.org/wiki/Ncurses
[snap_store]:https://snapcraft.io/
[apt_history]:https://www.phoronix.com/news/Debian-APT-History-Command
