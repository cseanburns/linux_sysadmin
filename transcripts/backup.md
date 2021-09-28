## Backups with ``rsync``

### Create a secondary hard drive in VirtualBox

In VirtualBox, we'll create a second hard drive (we're mimicking a scenario where we would physically add a new hard drive to the system).

In VirtualBox:

1. Before starting your virtual machine, go to **Settings** in VirtualBox for your chosen OS.
1. Click on Storage, and then select: **Controller: SATA**.
1. Click on the **Blue Floppy Disk +** icon to add a new storage attachment.
1. Choose **Add Hard Disk** and then **Create New Disk**.
1. Select default option for **Hard Disk File Type**: **VDI (VirtualBox Disk Image)**.
1. Choose **Dynamically allocated**.
1. Name your disk something of your choice. I'll name mine **Backup**. This name won't be recognized by the virtual OS. We'll have to create a name for it when we work with it in the virtual machine/OS.
1. If you wanted to create a full backup, you might make the disk 100 GB in size to match the 100 GB OS disk, but we're only going to backup our home directory, so the default 8 GB is fine.
1. Then choose **Create**.
1. Close Settings and start your OS as normal.

### Partition the new hard drive

Now that we've added a new hard drive, we need to partition it and create a filesystem. We'll do that in the command line. We're not going to use LVM, like we did earlier in the semester, but we will revisit the ``parted`` and the ``mkfs`` utilities:

```
$ sudo su
lsblk # to identify the new disk
parted /dev/sdb
(parted) print
(parted) mklabel gpt
(parted) mkpart
Partition name? []? backup
File system type? [ext2] ext4
Start? 1
End? 100%
(parted) print
quit
lsblk
mkfs.ext4 /dev/sdb1
mount /dev/sdb1 /mnt
lsblk
cd /mnt
```

### Backup with ``rsync``

Now we'll use ``rsync`` to backup the home directories to the new hard drive. See ``man rsync`` for documentation. The basic syntax is:

```
rsync option source-directory destination-directory
```

Now I'll backup the home directories that I've created to the new hard drive:

```
cd /home  # just to check out what I'm backing up
rsync -ahv --delete /home /mnt/
```

``rsync`` will behave differently whether I include or leave out the trailing slash after the **home** source-directory. Thus, the above command and the following will do slightly different things:

```
rsync -ahv --delete /home/ /mnt/
```

The first ``rsync`` command will back up the home directory and all subdirectories in the ``/mnt`` directory:

```
ls /mnt
home
```

The second ``rsync`` command will back up the home directory in the ``/mnt/`` directory.

```
ls /mnt
sean
```

The ``--delete`` option is important. Without it, ``rsync`` will add new files to the destination directory when it backs up the source directory. With it, ``rsync`` truly syncs. Thus, if a file that was previously backed up to the destination directory and later deleted in the source directory (e.g., because it was no longer needed), then it will be deleted from the destination directory when the ``--delete`` option is used.

See other options and functionality for ``rsync`` here: [https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/][rsync]. One of the most important options is the ability to backup up to remote machines over a network.

## Managing Software

Many modern Linux distros offer some kind of package management for installing, managing, and removing software. On RedHat based systems, package management is based on RPM (the RedHat Package Manager). On Debian based systems, package management is based on **dpkg**.

There are some advanced things you can do with these base package management systems, but most of the time it will be easier to use their front ends. For RedHat systems, the current front end is called **dnf**, and for Debian systems, it's **apt** or **apt-get**. Let's look at a few of the basic **dnf** commands:

To see a history of how *dnf* has been used on the system:

``$ sudo dnf history``

To get info on the history of a specific package:

``$ sudo dnf history mosh``

To get information on a specific package:

``$ sudo dnf info bash``

To search by tag, which you can see listed in the info search:

``$ sudo dnf repoquery --queryformat "%{arch}" bash``

``$ sudo dnf repoquery --queryformat "%{reponame}" mosh``

### Let's install something

```
dnf search tmux
dnf info tmux
sudo dnf install tmux
echo "set-option -g prefix C-a" > .tmux.conf
tmux
```

### dnf basics

Here are the basic ``dnf`` commands. See ``man dnf`` for details:

- ``dnf search [name]``
- ``dnf install [name]``
- ``dnf remove [name]``
- ``dnf repolist``
- ``dnf list installed``
- ``dnf list available``
- ``dnf provides /bin/bash``
- ``dnf info [name]``
- ``dnf update [name]``
- ``dnf check-update``
- ``dnf update OR dnf upgrade``
- ``dnf autoremove``
- ``dnf clean all``
- ``dnf help clean``
- ``dnf help``
- ``dnf history``
- ``dnf grouplist | less``
- ``dnf groupinstall 'Python Science'``
- ``dnf groupupdate 'Python Science'``
- ``dnf groupremove 'Python Science'``

## NAT (Network Address Translation)

### Set up NAT

If we want to SSH into our machines without having to use the VirtualBox GUI, we can do so by setting up NAT in VirtualBox. If we were on a wired connection (not wireless), we could set up a bridged connection, but that's not simple when we're connected to a router via wireless. To set up NAT:

Go to Settings, Network, Advanced, Port Forwarding, and enter the following in the table:

| Name | Protocol | Host IP      | Host Port | Guest IP  | Guest Port |
|:-----|:--------:|:------------:|:---------:|:---------:|-----------:|
| SSH  | TCP      | 10.163.0.2   | 2222      | 10.0.2.15 | 22         |

The Host IP should be the IP address for your physical machine. You can find this in your system settings on your Windows or Mac computers, or by opening up a terminal session and typing ``ifconfig`` or the equivalent for your operating system. Once you have that IP, start your Fedora clone in headless mode, and SSH into your virtual machine using the terminal of your choice (e.g., the one you used to connect to SISED). From a command line (or via PuTTY settings), we are going to SSH through port 2222 via our Host IP address:

```
ssh -p 2222 user@10.163.0.2
```

Read about NAT and VirtualBox here: [https://www.virtualbox.org/manual/ch06.html][vb_manual]

Two ``VBoxManage`` commands that you can run from your **Host** machine:

```
VBoxManage list vms
VBoxManage startvm "Name of VMS" --type headless
```

[rsync]:https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/


