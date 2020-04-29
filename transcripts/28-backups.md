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
