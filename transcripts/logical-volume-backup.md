## Logical Volume Management

### Background Reading and Documentation

These notes follow the steps outlined in book ([Soyinka][soyinka]), chapter 7, pp.
200-211. Also, some helpful additional reading, with alternate examples, are
at:

- [An Introduction to LVM Concepts, Terminology, and Operations][lvm_1]
- [A Linux User's Guide to Logical Volume Management][lvm_2]

Additionally, you should review some helpful ``man`` or ``info`` pages:

- ``man filesytems``
- ``man ext4``
- ``man btrfs``
- ``man vgdisplay``
- ``man pvdisplay``
- ``man lvdisplay``
- ``man pvcreate``
- ``man lvcreate``
- ``man vgextend``
- ``man fdisk``
- ``man lsblk``
- ``man fstab``
- ``man parted``
- ``man mount``
- ``man restorecon``

The second link above demonstrates some other logical volume commands that we
are not using here. Give the ``man`` or ``info`` pages for those a read, too.

### Our motivation

When we installed Fedora in VirtualBox, we told VirtualBox that our hard drive
would be a 100 GB in size. However, when we partitioned our hard drive, we only
partitioned around 75 GB of that space. In this lesson, we are going to create
a new logical volume and assign that to **/var**.

Briefly:

- Physical volume (the *pv* commands) are literally about the physical devices.
- Volume group (the *vg* commands) organize the physical and logical volumes.
- Logical volumes (the *lv* commands) are about partitions.

### Procedure

#### Administrative commands

We either need to use the ``sudo`` command to run many of the commands below or
to login as root. Either way, be careful about running commands with ``sudo``
or as root. Mistyping a command may harm your system beyond repair. If you do
harm your system beyond repair, delete this clone in VirtualBox and reclone the
original install.

If you would like to login as root, you can type the ``login`` command and then
enter root followed by the root password, or you can use the ``sudo`` command
if you are in the wheel group:

```
login root
```

Or:

```
sudo su
```

#### Gather information

Take a look at what you have before you start. Pay some attention to the
details:

```bash
lsblk
fdisk -l
```

#### Create a Partition

Note: *parted* is a program that manipulates disk partitions. Go ahead and read
the man page on parted before you start.

```bash
# parted /dev/sda
(parted) print
(parted) mkpart
(parted) Partion type? primary/extended? primary
(parted) File system type? [ext2]? ext4
(parted) Start? 81.1GB
(parted) End? 100%
(parted) set 3 lvm on
(parted) print
(parted) quit
```

#### Creating a Physical Volume

Note: It's important to read the man pages for *pvdisplay* and *pvcreate*
before you start so that you get a better idea of what you're doing, above and
beyond what I'm detailing here or the links above describe.

```bash
pvdisplay
pvcreate /dev/sda3
pvdisplay
```

#### Add a Physical Volume to a Volume Group

Usage note: ``vgextend VG PV``. (See man page, of course :)

Therefore, below, volume group name is **fedora** and physical volume name is,
per the last set of commands, **/dev/sda3**.

```bash
vgdisplay
vgextend fedora /dev/sda3
vgdisplay
```

#### Creating a Logical Volume

Note: man pages!!!

```bash
lvdisplay
lvcreate -l 6285 --name var fedora
lvdisplay /dev/fedora/var
```

#### Creating a File System for the LV

**Formatting the disk**: read the man pages, including ``man fstab``. The
*restorecon* command pertains to SELinux. We'll read about that later in the
semester.

```bash
mkfs.btrfs /dev/fedora/var
mkdir /new_var
mount /dev/fedora/var /new_var/
cp -vrp /var/* /new_var/
mv /var/ /old_var
mkdir /var
mount --bind /new_var/ /var/
restorecon -R /var
nano /etc/fstab
```

In ``nano``, enter this:

```
/dev/mapper/fedora-var    /var   btrfs   defaults  1   2
```

Now reboot the machine:

```
# reboot
```

## Backups with ``rsync``

### Create a secondary hard drive in VirtualBox

In VirtualBox, we'll create a second hard drive (we're mimicking a scenario
where we would physically add a new hard drive to the system).

In VirtualBox:

1. Before starting your virtual machine, go to **Settings** in VirtualBox for
   your chosen OS.
1. Click on Storage, and then select: **Controller: SATA**.
1. Click on the **Blue Floppy Disk +** icon to add a new storage attachment.
1. Choose **Add Hard Disk** and then **Create New Disk**.
1. Select default option for **Hard Disk File Type**: **VDI (VirtualBox Disk
   Image)**.
1. Choose **Dynamically allocated**.
1. Name your disk something of your choice. I'll name mine **Backup**. This
   name won't be recognized by the virtual OS. We'll have to create a name for
   it when we work with it in the virtual machine/OS.
1. If you wanted to create a full backup, you might make the disk 100 GB in
   size to match the 100 GB OS disk, but we're only going to backup our home
   directory, so the default 8 GB is fine.
1. Then choose **Create**.
1. Close Settings and start your OS as normal.

### Partition the new hard drive

Now that we've added a new hard drive, we need to partition it and create
a filesystem. We'll do that in the command line. We're not going to use LVM,
like we did earlier in the semester, but we will revisit the ``parted`` and the
``mkfs`` utilities:

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

Now we'll use ``rsync`` to backup the home directories to the new hard drive.
See ``man rsync`` for documentation. The basic syntax is:

```
rsync option source-directory destination-directory
```

Now I'll backup the home directories that I've created to the new hard drive:

```
cd /home  # just to check out what I'm backing up
rsync -ahv --delete /home /mnt/
```

``rsync`` will behave differently whether I include or leave out the trailing
slash after the **home** source-directory. Thus, the above command and the
following will do slightly different things:

```
rsync -ahv --delete /home/ /mnt/
```

The first ``rsync`` command will back up the home directory and all
subdirectories in the ``/mnt`` directory:

```
ls /mnt
home
```

The second ``rsync`` command will back up the home directory in the
``/mnt/`` directory.

```
ls /mnt
sean
```

The ``--delete`` option is important. Without it, ``rsync`` will add new files
to the destination directory when it backs up the source directory. With it,
``rsync`` truly syncs. Thus, if a file that was previously backed up to the
destination directory and later deleted in the source directory (e.g., because
it was no longer needed), then it will be deleted from the destination
directory when the ``--delete`` option is used.

See other options and functionality for ``rsync`` here:
[https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/][rsync].
One of the most important options is the ability to backup up to remote
machines over a network.

## Managing Software

Many modern Linux distros offer some kind of package management for
installing, managing, and removing software. On RedHat based systems, package
management is based on RPM (the RedHat Package Manager). On Debian based
systems, package management is based on **dpkg**.

There are some advanced things you can do with these base package management
systems, but most of the time it will be easier to use their front ends. For
RedHat systems, the current front end is called **dnf**, and for Debian systems,
it's **apt** or **apt-get**. Let's look at a few of the basic **dnf** commands:

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

If we want to SSH into our machines without having to use the VirtualBox GUI,
we can do so by setting up NAT in VirtualBox. If we were on a wired connection
(not wireless), we could set up a bridged connection, but that's not simple
when we're connected to a router via wireless. To set up NAT:

Go to Settings, Network, Advanced, Port Forwarding, and enter the following in
the table:

| Name | Protocol | Host IP      | Host Port | Guest IP  | Guest Port |
|:-----|:--------:|:------------:|:---------:|:---------:|-----------:|
| SSH  | TCP      | 10.163.0.2   | 2222      | 10.0.2.15 | 22         |

The Host IP should be the IP address for your physical machine. You can find
this in your system settings on your Windows or Mac computers, or by opening up
a terminal session and typing ``ifconfig`` or the equivalent for your operating
system. Once you have that IP, start your Fedora clone in headless mode, and
SSH into your virtual machine using the terminal of your choice (e.g., the one
you used to connect to SISED). From a command line (or via PuTTY settings), we
are going to SSH through port 2222 via our Host IP address:

```
ssh -p 2222 user@10.163.0.2
```

Read about NAT and VirtualBox here: [https://www.virtualbox.org/manual/ch06.html][vb_manual]

Two ``VBoxManage`` commands that you can run from your **Host** machine:

```
VBoxManage list vms
VBoxManage startvm "Name of VMS" --type headless
```

[soyinka]:https://www.amazon.com/Linux-Administration-Beginners-Guide-Seventh/dp/0071845364
[lvm_1]:https://www.digitalocean.com/community/tutorials/an-introduction-to-lvm-concepts-terminology-and-operations
[lvm_2]:https://opensource.com/business/16/9/linux-users-guide-lvm
[rsync]:https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/

