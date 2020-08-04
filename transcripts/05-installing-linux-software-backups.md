# Installing and Setting Up Our Own Server Installations

## Download and Install fedora and VirtualBox:

1. Download fedora Server Edition. We'll install the x86x64 netinstall
   ISO image because it's a smaller download, and then we can
   install other items once Fedora is running.
  - https://getfedora.org/
  - https://getfedora.org/en/server/download/
2. Download VirtualBox. This will vary depending on whether you run
macOS or Windows.
  - https://www.virtualbox.org/

## Set up in VirtualBox:

1. Click on the **New** button
2. In the **Name:** field, type in **Fedora-Base-30**. As you type this
   in, VirtualBox should automatically recognize the **Type:** and
   **Version**. Click **Next >**.
3. **Memory size**: Depending on your laptop's memory capabilities, you
   can set this higher, but it's really not necessary. The default
   **1024 MB** should be fine.
4. **Hard disk**: The default is 8.00 GB. We'll change this to 100 GB
   on an upcoming screen. For now, make sure you select the default
   **Create a virtual hard disk now**, and then click on **Create**.
5. **Hard disk file type**: Accept the default, which is **VDI**.
6. **Storage on physical hard disk**: Accept the default, which is
   **Dynamically allocated**
7. **File location and size**: Here you should adjust to 100 GB. Note
   that you will not use all of this space on your hard drive. It's
   the maximum amount that you can use, though. Click on **Create**.

The settings box should close. Now highlight the virtual machine in the
left pane of the VirtualBox menu, and click on Start.

## Install Fedora 30 Server Edition:

1. When you start, a window will pop up and ask you to select a virtual
   optical disk. This is the fedora 30 ISO that you downloaded. We
   have to select the file icon in the window and then find and
   select the ISO that we downloaded. Once you do that, click on
   **Start**.
2. A terminal will open up. Press **Enter** on the Installing Fedora 30
   option. Some setup text will scroll by and soon a graphical
   installer will launch.
3. In the graphical installer, you'll get a message: "WELCOME TO FEDORA
   30." English should be the default options in both panes. Click
   on **Continue**.
4. We only have to configure a few things. Click on **Software
   Selection**. In the right pane, under **Add-Ons for Selected
   Environment**, select **Headless Management** and **Editors**,
   and then click on **Done**.
5. Now we have to partition our hard drive. We could accept automatic
   partitioning, but we want to fine tune this. So click on
   **Installation Destination**.
6. In the next screen, under **Storage Configuration**, select
   **Custom** and then click **Done**.
7. **Manual Partitioning**: In the next screen, the **LVM** option
   should already be selected. This stands for **Logical Volume
   Management**. Make sure that stays selected. We'll work with LVM
   in a future class. Now we have to create some partitions. As we
   do, note the two pieces of information at the bottom of the
   screen: the Available Space and the Total Space. The Available
   Space will change as we add partitions.
8. Click on the "+" icon, and for **Mount Point**, we'll start off with
   the **root partition**, which is indicated with the forward
   slash: **/** and for **Desired Capacity**, we should input **20
   GB**. We'll proceed with a few other partitions: /boot, swap,
   /home. We'll leave ~24 GB of free disk space available for later
   use. Altogether, our partition map should look like this:

  | Mount Point/Partition | Size  |
  |-----------------------|-------|
  | /home                 | 50 GB |
  | /tmp                  | 6 GB |
  | /                     | 20 GB |
  | /boot                 | 1 GB  |
  | swap                  | 4 GB  |

  Note that the **/boot** partition is mapped to **sda1**. This is
  just kind of handy to remember. 

  Note also that the Available Space listed at the bottom should be
  about 24.55 GiB.

  After you've inputted the above info, click on **Done**. Then click
  on **Accept Changes** in the next window.

  Now click on **Begin Installation**.

9. Set up Root Password and User Creation in the next window. Write
   down whatever passwords you choose.
10. **Important!** When completing the **Create User** step, make sure
    you select: **Make this user administrator**. This will add this
    user to the **wheel** group and thus allow you to use the
    ``sudo`` command as this user to administer the server. FYI: on
    Ubuntu, there is no **wheel** group. Instead, the corresponding
    administrator group is **adm**.
11. Wait till installation is completed. When completed, **shutdown**
    the machine. Do not click on **Reboot**. Instead, click on
    Machine, and the Power off. Save state.

## VirtualBox settings

1. Click on **Settings**. Under the **System** option, deselect
   **Floppy** and **Optical**. Then click **Okay**. 
2. Now, **Start** your server again. When it starts, you should be able
   to login with the user account that you created.

## VirtualBox Login

The first thing we want to do is to update the software on the machine.
To do that, we use the ``dnf`` command. Login with your user account,
and run the following two commands. The upgrade process may take a bit
of time, depending on how much needs to be upgraded and your broadband
connection:

```
sudo dnf updateinfo
sudo dnf upgrade
```

Once the system has been upgraded, let's power it off. We're not going
to use this system, but clone it and work on the clone. That way if we
make a mistake with our cloned installation, we can re-clone from the
original. To turn the machine off, type:

```
sudo poweroff
```

In the VirtualBox Manager, right click on our installation, and then
select **Clone**. Accept the default name or rename it as you prefer.
Be sure to choose **Full clone**.

That's good for now. Congratulations! You have just completed your first installation of a Linux server.

# NAT (Network Address Translation) and Managing Software 

## Set up NAT

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
$ ssh -p 2222 user@10.163.0.2
```

Read about NAT and VirtualBox here: [https://www.virtualbox.org/manual/ch06.html][1]

[1]:https://www.virtualbox.org/manual/ch06.html

Two ``VBoxManage`` commands that you can run from your **Host** machine:

```
VBoxManage list vms
VBoxManage startvm "Name of VMS" --type headless
```

# Logical Volume Management

## Some background reading and documentation

These notes follow the steps outlined in book ([Soyinka][1]), chapter 7, pp.
200-211. Also, some helpful additional reading, with alternate examples, are at:

- [An Introduction to LVM Concepts, Terminology, and Operations][2]
- [A Linux User's Guide to Logical Volume Management][3]

Additionally, you should review some helpful ``man`` or ``info`` pages:

- ``man filesytems``
- ``man ext4``
- ``man btrfs``
- ``man {vg,pv,lv}display``
- ``man {pv,lv}create``
- ``man vgextend``
- ``man fdisk``
- ``man lsblk``
- ``man fstab``
- ``man parted``
- ``man mount``
- ``man restorecon``

The second link above demonstrates some other logical volume commands that we are not using here. Give the ``man`` or ``info`` pages for those a read, too.

## Our motivation

When we installed Fedora in VirtualBox, we told VirtualBox that our hard drive
would be a 100 GB in size. However, when we partitioned our hard drive, we only
partitioned around 75 GB of that space. In this lesson, we are going to create
a new logical volume and assign that to **/var**.

Briefly:

- Physical volume (the *pv* commands) are literally about the physical devices.
- Volume group (the *vg* commands) organize the PVs and the LVs.
- Logical volumes (the *lv* commands) -- here think about partitions

## Procedure:

### Administrative commands

We either need to use the ``sudo`` command to run many of the commands below or
to login as root. Either way, be careful about running commands with ``sudo``
or as root. Mistyping a command may harm your system beyond repair.

If you would like to login as root, you can type the ``login`` command and then enter root followed by the root password, or you can use the ``sudo`` command if you are in the wheel group:

```
$ login root
```

Or:

```
$ sudo su
```

### Gather information

Take a look at what you have before you start. Pay some attention to the
details:

```bash
# lsblk
# fdisk -l
```

### Create a Partition

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

### Creating a Physical Volume

Note: read the man pages for *pvdisplay* and *pvcreate* before you start--just
to bet a better idea, above and beyond what the book offers, of what the
following two programs do.

```bash
# pvdisplay
# pvcreate /dev/sda3
# pvdisplay
```

### Add a Physical Volume to a Volume Group

Usage note: ``vgextend VG PV``. (See man page, of course :)

Therefore, below, volume group name is **fedora** and physical volume name is,
per the last set of commands, **/dev/sda3**.

```bash
# vgdisplay
# vgextend fedora /dev/sda3
# vgdisplay
```

### Creating a Logical Volume

Note: man pages!!! 

```bash
# lvdisplay
# lvcreate -l 6285 --name var fedora
# lvdisplay /dev/fedora/var
```

### Creating a File System for the LV

**Formatting the disk**: read the man pages, including ``man fstab``. The
*restorecon* command pertains to SELinux. We'll read about that later in the
semester.

```bash
# mkfs.btrfs /dev/fedora/var
# mkdir /new_var
# mount /dev/fedora/var /new_var/
# cp -vrp /var/* /new_var/
# mv /var/ /old_var
# mkdir /var
# mount --bind /new_var/ /var/
# restorecon -R /var
# nano /etc/fstab
```

/dev/mapper/fedora-var    /var   btrfs   defaults  1   2

```bash
# reboot
```

[1]:https://www.amazon.com/Linux-Administration-Beginners-Guide-Seventh/dp/0071845364
[2]:https://www.digitalocean.com/community/tutorials/an-introduction-to-lvm-concepts-terminology-and-operations
[3]:https://opensource.com/business/16/9/linux-users-guide-lvm

# Managing Software

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

# Let's install something:

```bash
$ dnf search tmux
$ dnf info tmux
$ sudo dnf install tmux
$ echo "set-option -g prefix C-a" > .tmux.conf
$ tmux
```

## dnf basics

Here are the basic ``dnf`` commands. See ``man dnf`` for details:

- dnf search [name]
- dnf install [name]
- dnf remove [name]
- dnf repolist
- dnf list installed
- dnf list available
- dnf provides /bin/bash
- dnf info [name]
- dnf update [name]
- dnf check-update
- dnf update OR dnf upgrade
- dnf autoremove
- dnf clean all
- dnf help clean
- dnf help
- dnf history
- dnf grouplist | less
- dnf groupinstall 'Python Science'
- dnf groupupdate 'Python Science'
- dnf groupremove 'Python Science'

# Backups with ``rsync``

## Create a secondary hard drive in VirtualBox

In VirtualBox, we'll create a second hard drive (we're mimicking a scenario
where we add a new hard drive to the system).

IN VB:

1. Before starting your virtual machine, go to **Settings** in VirtualBox for
   your chosen OS.
2. Click on Storage, and then select: **Controller: SATA**.
3. Click on the **Blue Floppy Disk +** icon to add a new storage attachment.
4. Choose **Add Hard Disk** and then **Create New Disk**.
5. Select default option for **Hard Disk File Type**: **VDI (VirtualBox Disk
   Image)**.
6. Choose **Dynamically allocated**.
7. Name your disk something of your choice. I'll name mine **Backup**. This
   name won't be recognized by the virtual OS. We'll have to create a name for
   it when we work with it in the virtual machine/OS.
8. If you wanted to create a full backup, you might make the disk 100 GB in
   size to match the 100 GB OS disk, but we're only going to backup our home
   directory, so the default 8 GB is fine.
9. Then choose **Create**.
10. Close Settings and start your OS as normal.

## Partition the new hard drive

Now that we've added a new hard drive, we need to partition it and create
a filesystem. We'll do that in the command line. We're not going to use LVM,
like we did earlier in the semester, but we will revisit the ``parted`` and the
``mkfs`` utilities:

```
$ sudo su
# lsblk # to identify the new disk
# parted /dev/sdb
(parted) print
(parted) mklabel gpt
(parted) mkpart
Partition name? []? backup
File system type? [ext2] ext4
Start? 1
End? 100%
(parted) print
quit
# lsblk
# mkfs.ext4 /dev/sdb1
# mount /dev/sdb1 /mnt
# lsblk
# cd /mnt
```

## Backup with ``rsync``

Now we'll use ``rsync`` to backup the home directories to the new hard drive.
See ``man rsync`` for documentation. The basic syntax is:

```
rsync option source-directory destination-directory
```

Now I'll backup the home directories that I've created to the new hard drive:

```
# cd /home  # just to check out what I'm backing up
# rsync -ahv --delete /home /mnt/
```

``rsync`` will behave differently whether I include or leave out the trailing
slash after the **home** source-directory. Thus, the above command and the
following will do slightly different things:

```
# rsync -ahv --delete /home/ /mnt/
```

The first ``rsync`` command will back up the home directory and all
subdirectories in the ``/mnt`` directory:

```
# ls /mnt
home
```

The second ``rsync`` command will back up the three home directories in the
``/mnt/`` directory.

```
# ls /mnt
linux omicron sean
```

The ``--delete`` option is important. Without it, ``rsync`` will add new files
to the destination directory when it backs up the source directory. With it,
``rsync`` truly syncs. Thus, if a file that was previously backed up to the
destination directory and later deleted in the source directory (e.g., because
it was no longer needed), then it will be deleted from the destination
directory when the ``--delete`` option is used.

See other options and functionality for ``rsync`` here:
[https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/][1].
One of the most important options is the ability to backup up to remote
machines over a network.

[1]:https://www.linux.com/tutorials/how-backup-files-linux-rsync-command-line/
