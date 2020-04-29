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
