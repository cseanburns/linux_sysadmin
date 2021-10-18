## Backing up and Managing Software

### Backup with ``rsync``

#### Using our /backups directory

To complete this assignment, you must have successfully completed **Assignment 5: Logical Volumes**.

In **Assignment 5: Logical Volumes**, we created an additional volume at **/backups**. In a real production scenario, we'd use separate drives and remote machines to store backups in order to full prepare for and recover from data loss. But for us, this **/backups** partition will work just fine.

#### Backup with ``rsync``

In the **Managing Users and Groups** forum, we created a new user for our system. This means that we have at least two user accounts to backup: ours and the new uers.

Now we'll use the ``rsync`` command to backup these users' home directories to the **/backups** volume/partition. See ``man rsync`` for documentation. The basic syntax is:

```
rsync option source-directory destination-directory
```

Syntax matters here. Specifically, there are two ways to backup the home directories using ``rsync`` depending on a small detail in our commands. Consider the next two examples:

In this first example, the ``rsync`` command will back up the home directory and all subdirectories to the ``/backups`` directory. Thus, ``rsync`` behaves differently whether I include or leave out the trailing slash after the **home** source-directory.

Thus, if I run ``rsync`` this way:

```
rsync -ahv --delete /home /backups/
```

The results will look like this:

```
ls /backups
home
ls /backups/home
linus sean
```

If I include the trailing slash after the **/home/** directory, like so:

```
rsync -ahv --delete /home/ /backups/
```

Then ``rsync`` will sync the contents of the **/home/** directory, and the results will include not **/home** but the specific directories contained in **/home**:

```
ls /backups
linus sean
```

#### Delete Option

The ``--delete`` option is important. Without it, ``rsync`` will add new files to the destination directory when it backs up the source directory. With it, ``rsync`` truly syncs. Thus, if a file that was previously backed up to the destination directory and later deleted in the source directory (e.g., because it was no longer needed), then it will be deleted from the destination directory when the ``--delete`` option is used. This is how services like Dropbox work.

See other options and functionality for ``rsync`` here: [https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/][rsync]. One of the most important options is the ability to backup up to remote machines over a network, and this can be done with the the ``rsync`` command.

[rsync]:https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/

### Managing Software

Many modern Linux distros offer some kind of package management for installing, managing, and removing software. On RedHat based systems, package management is based on ``rpm`` (the RedHat Package Manager). On Debian based systems, package management is based on ``dpkg``.

There are some advanced things you can do with these base package management systems (``rpm`` or ``dpkg``), but most of the time it will be easier to use their front ends. For RedHat systems, the current front end is called ``dnf``, and for Debian systems, it's ``apt`` or ``apt-get``. Since the Fedora distribution is part of the RedHat universe, we'll use the ``dnf`` command to manage software. As always, read the ``man dnf`` manual for more information. See also [the online documentation on dnf][dnfdocs].

Let's look at a few of the basic ``dnf`` commands.

[dnfdocs]:https://dnf.readthedocs.io/en/latest/command_ref.html

#### dnf info and search commands

To see a history of how ``dnf`` has been used on the system:

```
dnf history
```

We get info on the history of a specific package on our system. Since we haven't installed anything yet, there's nothing to look at yet, but the basic syntax looks like this.

```
dnf history package_name
```

To search for a package, we can use the following command to search for the ``bash`` package:

```
dnf search bash
```

If the output is more than one page, we can **pipe** it through ``less``.

To get technical information on a specific package, which we might want to do before we install it:

```
dnf info bash
```

We can use ``dnf`` to search by tag in order to get information about a package. To get a list of possible tags to search by, we can use the following command:

```
dnf reqoquery --querytags
```

Then to search by tag, we uset the following format that will show us tag-related information for the ``bash`` package:

```
dnf repoquery --queryformat "%{arch}" bash
dnf repoquery --queryformat "%{name}" bash
dnf repoquery --queryformat "%{release}" bash
dnf repoquery --queryformat "%{reponame}" bash
```

Software managed by ``dnf`` is organized into groups, which contain multiple software packages. We can see a list of groups with this command:

```
dnf group list
```

You should see a category called **Installed Gruops** and listed under that is **Headless Management**. You might recognize that from when we installed Fedora.

To see what packages would be installed with a group, such as the **System Tools** group, we can do:

```
dnf group info "System Tools"
```

If we want to install the default packages with a group, then:

```
sudo dnf group install "System Tools"
```

#### dnf install process and commands

It's pretty simple to install a software package. The hard part will involve configuring a package after it's installed, if it's a complicated piece of software. For now, let's install ``tmux``, which is a terminal multiplexer that we can use to open and manage multiple terminals in a single window.

```
dnf search tmux
dnf info tmux
sudo dnf install tmux
dnf history tmux
```

To use ``tmux``, I like to use the **ctrl-a** keybinding to control it. By default it's set to use **ctrl-b**. Let's configure the new keybinding like so. Here we redirect the configuration to the configureation file in our home directory. Since I'm using a single redirect **>**, this file gets created. Remember to use a double redirect **>>** if appending to the file.

```
echo "set-option -g prefix C-a" > $HOME/.tmux.conf
```

And then start ``tmux`` like so:

```
tmux
```

When done, just type ``exit``.

#### Updating the system

It's easy to update the entire system:

```
sudo dnf update
sudo dnf clean all
```

The ``dnf clean all`` command removes the downloaded files, thereby freeing up storage space, used to update the system. It does not reverse the update.

#### dnf basics

Here are the basic ``dnf`` commands. See ``man dnf`` for details:

- ``dnf search [name]``
- ``dnf install [name]``
- ``dnf remove [name]``
- ``dnf repolist``
- ``dnf list installed``
- ``dnf list available``
- ``dnf provides /usr/bin/bash``
- ``dnf info [name]``
- ``dnf update [name]``
- ``dnf check-update``
- ``dnf update OR dnf upgrade``
- ``dnf autoremove``
- ``dnf clean all``
- ``dnf help clean``
- ``dnf help``
- ``dnf history``
- ``dnf group list 'Python Science'``
- ``dnf group info 'Python Science'``
- ``dnf group install 'Python Science'``
- ``dnf group install --with -optional 'Python Science'``
- ``dnf group upgrade 'Python Science'``
- ``dnf group remove 'Python Science'``

