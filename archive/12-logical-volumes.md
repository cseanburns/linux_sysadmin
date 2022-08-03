## Logical Volume Management

### Background Reading and Documentation

Please read the following two articles before proceeding:

- [An Introduction to LVM Concepts, Terminology, and Operations][lvm1]
- [A Linux User's Guide to Logical Volume Management][lvm2]

Additionally, you should review / skim some helpful ``man`` or ``info`` pages before proceeding:

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
- ``man cfdisk``

The second link above demonstrates some other logical volume commands that we are not using here. Give the ``man`` or ``info`` pages for those a read, too.

### Our motivation

When we installed Fedora in VirtualBox, we told VirtualBox that our hard drive would be a 100 GB in size. However, when we partitioned our hard drive, we only partitioned around 67 GB of that space. In this lesson, we are going to create a new partition of the **sda** partition, and then expand our logical volume to include this partition. We'll allocate 15 GB of the remaining space to **sda3**.

Briefly:

- Physical volumes (the *pv* commands) are related to the physical devices.
- Volume groups (the *vg* commands) organize the physical and logical volumes.
- Logical volumes (the *lv* commands) are about partitions.

### Procedure

#### Administrative commands

We need to use the ``sudo`` command to run many of the commands below or login as **root** user. Either way, be careful about running commands with ``sudo`` or as root. Mistyping a command may harm your system beyond repair. If you do harm your system beyond repair, delete your clone in VirtualBox and reclone the original install. In the demonstration that follows, I will login as the **root** user.

If you would like to login as root, you can login as root at the intitial prompt after you system boots up; or, if you are already logged in as a regular user, you can type the ``su root`` command and then enter the root password that you set when you installed Fedora, or you can use the ``sudo su`` command if you are in the wheel group:

```
su root
```

Or:

```
sudo su
```

#### Gather information

First we need take a look at what we have before we start. Pay some attention to the details:

```
lsblk
fdisk -l | less
```

#### Create a Partition

We can use a program called ``parted`` or a slightly more user friendly program called ``cfdisk``. We'll use ``cfdisk``:

```
cfdisk
```

In ``cfdisk``, complete the following steps:

- Arrow down to the **Free space** section, and press Enter on **New**.
- Next to Partition size, backspace over value and then type **15GB**
- Set to **primary**
- Use right arrow key to select **Type**
- Arrow down to the **8e Linux LVM** selection and press enter
- User right arrow key to select **Write**, and then type **yes** at the prompt to write the partition to the virtual disk

#### Creating a Physical Volume

Next let's create a new physical volume to refer to our new partition. It's important to read the man pages for *pvdisplay* and *pvcreate* before you start so that you get a better idea of what you're doing, above and beyond what I'm detailing here or the links above describe. Here we'll use ``pvdisplay`` before and after we use ``pvcreate`` to note the differenc after we use the latter command:

```
pvdisplay
pvcreate /dev/sda3
pvdisplay
```

#### Add a Physical Volume to a Volume Group

Now we add our new physical volume to an existing volume group, which was created when we installed Fedora. Usage note: ``vgextend VG PV``. (See man page, of course :)

Below, the volume group name is **fedora_fedora** and the physical volume name is, per the last set of commands, **/dev/sda3**. By extending the volume group, we'll have extended its size to encompass the new partition:

```
vgdisplay
vgextend fedora_fedora /dev/sda3
vgdisplay
```

#### Creating a Logical Volume

We create a logical volume to allow us to mount the partition and make it accessible to the other parts of the file system. Note: man pages!!!

```
lvdisplay | less
lsblk
vgdisplay # note Free PE / Size space
lvcreate -L +15GiB --name projects fedora_fedora
lvdisplay
```

#### Creating a File System for the LV

Now we need to **format the logical volume**: read the man pages for the commands below, including ``man fstab``.

```
mkfs.ext4 /dev/fedora_fedora/projects
mkdir /projects
mount /dev/fedora_fedora/projects /projects
```

In ``nano``, enter this in the **/etc/fstab** file:

```
/dev/mapper/fedora_fedora-projects  /projects ext4   defaults    1 2
```

Per the instructions in that file, run the following command:

```
systemctl daemon-reload
```

Now reboot the machine. When you reboot, your new partition should be recognized and mounted automatically.

```
reboot now
```

[lvm1]:https://www.digitalocean.com/community/tutorials/an-introduction-to-lvm-concepts-terminology-and-operations
[lvm2]:https://opensource.com/business/16/9/linux-users-guide-lvm

