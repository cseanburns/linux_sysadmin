# Expanding Storage and Backing Up Systems

By the end of this section, you will be able to:

1. **Explain how Linux incorporates additional storage** into its filesystem hierarchy.
2. **Identify block devices, filesystems, and mount points** using commands such as `lsblk`, `df`, `findmnt`, and `blkid`.
3. **Explain what DigitalOcean does when it automatically formats and mounts a volume**.
4. **Understand how storage can be mounted automatically**, including the use of `systemd` mount units and the traditional `/etc/fstab` file.
5. **Manually mount and unmount storage** when needed.
6. **Distinguish between DigitalOcean volumes, snapshots, and backups**.
7. **Understand some basic principles of backup and recovery**.

## Getting Started

At some point, nearly everyone has needed additional storage.
You may have added an external USB drive to a desktop or laptop, inserted an SD card into another device, or perhaps even used optical disks or floppy disks(???).

Servers may also need extra storage, too.
Some of the reasons may include:

- users create more files,
- databases grow,
- logs accumulate,
- applications require additional space,
- backups need somewhere to go,
- or administrators may want to keep some data separate from the operating system.

Our DigitalOcean Droplets already have 10GB of storage.
We can see it with:

```
lsblk
```

On my Droplet, the primary storage device appears as something like:

```
vda
└─vda1
```

The device `/dev/vda` represents the virtual disk provided with the Droplet.
This device has partitions, and one of its partitions, `/dev/vda1`, contains the filesystem mounted at:

```
/
```

Recall that `/` is the top of the Linux filesystem hierarchy and is referred to as the root directory.

Thus, although we interact with directories such as:

```
/etc
/home
/usr
/var
```

those directories ultimately exist on some kind of storage device.
This is an important distinction:

> A Linux **filesystem hierarchy** is not the same thing as a physical or virtual storage device.

The directory tree is an abstraction that allows many storage devices to appear as parts of one unified hierarchy.
We can add another storage device and attach it somewhere within that hierarchy.

## DigitalOcean Volumes

DigitalOcean calls its additional block storage devices **Volumes**.
A Volume is storage that exists separately from the Droplet's primary disk.
If it helps, think of it as a second storage disk.

DigitalOcean describes Volumes as network-attached block storage.
A Volume can be attached to a Droplet, moved between Droplets in the same datacenter, resized, and independently snapshotted.
This king of separation can be useful.

For example, imagine that a server's operating system is stored on one disk while a large collection of data is stored on another:

```
Droplet
│
├── Primary disk
│      └── operating system
│
└── Volume
       └── application data
```

If necessary, the Volume can later be detached from one Droplet and attached to another.
This can keep all the data files we use separate from the OS files needed to run the system.

### Cost

Volumes are not free.
As of this writing, DigitalOcean charges **$0.10 per GiB per month** for Volume storage, and charges continue for as long as the Volume exists, even if it is not attached to a Droplet.

For our exercise, therefore, we will use a small Volume.

## Creating a Volume

Log into the DigitalOcean Control Panel.
From your Droplet, locate the option to add or create a **Volume**.
Create a small Volume.

A few GB is sufficient for this exercise.

Give the Volume a meaningful name.

For example, I named mine:

```
enterprise_d_1
```

DigitalOcean provides two important choices when creating a Volume:

1. **Automatically Format & Mount**
2. **Manually Format & Mount**

For this exercise, select:

**Automatically Format & Mount**

Choose the **Ext4** filesystem.

Ext4 is a mature, widely used general-purpose Linux filesystem and is DigitalOcean's default recommendation for most workloads.
DigitalOcean also supports XFS, which may be preferable for some large-file or write-heavy workloads.

> Different distributions default to different filesystems.
> Debian and Ubuntu default to ext4 while Red Hat defaults to XFS.
> See [Overview of available file systems][file_systems_redhat].

Attach the Volume to your Droplet.
Once DigitalOcean finishes creating it, return to your SSH session.
You will find that something interesting has happened.
We clicked a few buttons in a web interface, but those buttons caused several changes to our Linux system.

Let's investigate them.

## Investigating the New Storage

To examine your new storage device, run:

```
lsblk
```

You should now see an additional block device.
On my system, for example, the original disk is:

```
vda
```

and the new Volume appears as:

```
sda
```

Your exact output may differ.

### What Are `vda` and `sda`?

Linux represents devices using special files located under
(generally, everything is a file on Unix-like operating systems, including devices):

```
/dev
```

Thus our devices may be represented in the filesystem as:

```
/dev/vda
/dev/sda
```

The name does not come from the name we gave the Volume in DigitalOcean.
The Droplet's primary virtual disk is presented to Linux using a VirtIO block interface and therefore commonly receives a `vd` device name such as:

```
/dev/vda
```

DigitalOcean Volumes are presented differently and commonly appear with [SCSI-style][scsi_wiki] device names such as:

```
/dev/sda
```

The exact letters should not be treated as permanent identifiers.
A device that appears as `/dev/sda` today could potentially receive another device name under different circumstances.

DigitalOcean therefore supplies a more stable identifier under:

```
/dev/disk/by-uuid/
```

Run:

```
ls -l /dev/disk/by-uuid/
```

Look for an entry containing your Volume's name.

Mine should resemble:

```
scsi-0DO_Volume_enterprise_d_1
```

DigitalOcean recommends these `/dev/disk/by-uuid/` identifiers when a persistent reference to a Volume is required because names such as `/dev/sda` are not guaranteed to remain the same.

This is a useful general systems administration principle:

> Human-readable names such as `/dev/sda` may describe how the kernel currently sees a device, but we should not necessarily assume that name is permanent.

### Where Did the Volume Go?

Run again and examine the **MOUNTPOINTS** column.

```
lsblk
```

You should see that DigitalOcean mounted the Volume somewhere under:

```
/mnt
```

For my `enterprise_d_1` Volume, this is:

```
/mnt/enterprise_d_1
```

Now try:

```
ls /mnt
```

and:

```
cd /mnt/enterprise_d_1
```

The new storage device has become part of the existing Linux directory hierarchy.

Conceptually:

```
/
├── etc
├── home
├── usr
├── var
└── mnt
     └── enterprise_d_1
              │
              └── separate storage device
```

This is quite different from the traditional Windows use of separate drive letters such as:

```
C:
D:
E:
```

Linux instead **mounts** the filesystem provided by another device onto a directory in the **existing** hierarchy.
The directory where this occurs is called the **mount point**.

## Examining the Filesystem

Run:

```
df -hT
```

The `df` command reports information about mounted filesystems.
The options here mean:

```
-h    human-readable sizes
-T    display filesystem type
```

Locate your new Volume.
You should see that its filesystem type is:

```
ext4
```

and that it is mounted somewhere under:

```
/mnt
```

You can get even more targeted information using:

```
findmnt /mnt/enterprise_d_1
```

`findmnt` is designed specifically for examining mounted filesystems.
Also try:

```
sudo blkid
```

The `blkid` command reports identifying information about block devices, including filesystem types and UUIDs.

At this point we can distinguish several concepts:

```
DigitalOcean Volume
        ↓
Linux block device
        ↓
ext4 filesystem
        ↓
mount
        ↓
/mnt/enterprise_d_1
        ↓
files and directories
```

These are related concepts, but they are not the same thing.

## What Did DigitalOcean Do for Us?

When we selected **Automatically Format & Mount**, DigitalOcean performed several operations that a system administrator could otherwise perform manually.

At a high level, it:

1. attached a new block device,
2. created an Ext4 filesystem on it,
3. created a mount point under `/mnt`,
4. mounted the filesystem,
5. configured the system so that it mounts again after a reboot.

DigitalOcean currently mounts automatically configured Volumes using options including
(see `man mount` for details):

```
defaults,nofail,discard,noatime
```

In other words, the easy button in the Control Panel did not eliminate Linux storage administration.
Rather, it **automated** Linux storage administration.

This distinction is important.
Much of modern systems administration involves working with interfaces that perform lower-level operations for us.
A useful question when using such an interface is:

> What did this interface just do to the underlying system?

## Persistent Mounting

Historically, one of the most common ways to specify filesystems that should be mounted when a Unix or Linux system starts is:

```
/etc/fstab
```

Let's examine ours:

```
cat /etc/fstab
```

Interestingly, you may discover that your automatically mounted DigitalOcean Volume is **not listed there**.
Yet if you reboot the system and reconnect, the Volume still appears:

```
sudo reboot
```

And after the system starts:

```
lsblk
```

And the Volume is still mounted.
How?

### systemd Mount Units

On supported Linux distributions, DigitalOcean's automatic mounting process currently uses a **systemd mount unit** rather than adding the Volume directly to `/etc/fstab`.
For example, my mount point:

```
/mnt/enterprise_d_1
```

corresponds to a unit named approximately:

```
mnt-enterprise_d_1.mount
```

We can investigate it with:

```
systemctl status mnt-enterprise_d_1.mount
```

and:

```
systemctl cat mnt-enterprise_d_1.mount
```

DigitalOcean places automatically generated mount units under:

```
/etc/systemd/system/
```

You can inspect them:

```
ls /etc/systemd/system/*.mount
```

DigitalOcean also uses a udev rule associated with automatic Volume configuration
(see `man udev`):

```
/etc/udev/rules.d/99-digitalocean-automount.rules
```

Thus:

```
Volume
   ↓
systemd mount unit
   ↓
mount filesystem during startup
   ↓
/mnt/enterprise_d_1
```

This is one reason simply inspecting `/etc/fstab` no longer necessarily tells us everything that will be mounted when a modern Linux system starts.

### `/etc/fstab` Is Still Relevant

However, `/etc/fstab` has not disappeared.
It remains a standard mechanism for defining persistent mounts.
A traditional entry might resemble (see `man fstab`):

```
/dev/disk/by-id/scsi-0DO_Volume_example /mnt/example ext4 defaults,nofail,discard,noatime 0 2
```

Notice that DigitalOcean recommends the stable:

```
/dev/disk/by-id/
```

name rather than something like:

```
/dev/sda
```

When manually modifying `/etc/fstab`,
you can check the file afterward with the following command before depending on it during the next boot.

```
findmnt --verify --verbose
```

A malformed `/etc/fstab` can create serious boot problems.
(Trust me on this!)

## The Manual Workflow

We selected DigitalOcean's automatic option because it provides a useful opportunity to investigate what the cloud provider did for us.
It is nevertheless worth understanding what the equivalent manual workflow looks like.
If we created a Volume using **Manually Format & Mount**, we would first identify the new device:

```
lsblk
```

Then we would create a filesystem.
For example, to create an `ext4` filesystem on the device (replacing **DEVICE** with the relevant one, such as `sda` or `vda`):

```
sudo mkfs.ext4 /dev/DEVICE
```

**Do not run `mkfs` against an existing device unless you intend to erase its contents.**

The `mkfs` command creates a filesystem.
Running it against the wrong device can destroy data.

Next, we would create a mount point:

```
sudo mkdir -p /mnt/example
```

Then mount the filesystem:

```
sudo mount /dev/DEVICE /mnt/example
```

We could inspect the result with:

```
findmnt /mnt/example
```

or:

```
lsblk
```

At this point the filesystem would be available, but the mount would normally disappear after a reboot unless we also configured persistent mounting.
One option would be `/etc/fstab`.
Another possibility on a systemd-based system would be a native `.mount` unit.
Thus the manual workflow is approximately:

```
attach device
     ↓
identify device
     ↓
create filesystem
     ↓
create mount point
     ↓
mount filesystem
     ↓
configure persistent mounting
```

DigitalOcean's automatic workflow performed those steps for us.

## Unmounting Storage

Mounting makes a filesystem accessible through the directory hierarchy.
**Unmounting** disconnects it from that hierarchy.
The command is:

```
umount
```

Notice that the command is **not** spelled `unmount`.
(For years I would type `unmount` on accident. Every single time!)

Before unmounting a filesystem, make sure nothing is actively using it.
For example, if you are currently in a directory on the mounted system, you should leave that directory.
It is also worth checking with something such as:

```
sudo lsof +f -- /mnt/enterprise_d_1
```

Then:

```
sudo umount /mnt/enterprise_d_1
```

You can verify the result with:

```
lsblk
```

or:

```
findmnt
```

And you'll find that the mountpoint is empty.

Note that unmounting the filesystem does **not** delete the Volume.
Likewise:

```
mount ≠ attach
umount ≠ detach
delete ≠ either of those
```

These are separate operations.

## Storage Is Not a Backup

Adding another Volume to a server provides additional storage.
But it does **not**, by itself, provide a backup.

Suppose we stored valuable data on:

```
/mnt/enterprise_d_1
```

If we accidentally deleted those files, corrupted them, or deleted the Volume itself, simply having placed them on a separate device would not necessarily save us.
This introduces an important distinction:

```
additional storage ≠ backup
```

A backup exists so that we can recover data after something goes wrong.

DigitalOcean provides several related technologies.

### Snapshots

A **snapshot** is an on-demand image of a Droplet or Volume at a particular point in time.
Like other virtual machine / hosting providers, DigitalOcean supports:

- **Droplet snapshots**
- **Volume snapshots**

These are separate because the Droplet's primary disk and an attached Volume are separate storage resources.

#### Droplet Snapshots

A Droplet snapshot captures the contents of the Droplet's disk.
This can be useful before making a potentially disruptive change.
For example, before:

- performing a major operating system upgrade,
- significantly changing server configuration,
- experimenting with unfamiliar software,
- or making some other change that may be difficult to reverse,

an administrator might create a snapshot.

If something goes badly wrong, the snapshot can be used to create another Droplet or restore the existing system to that earlier state.

DigitalOcean recommends shutting down a Droplet before taking a snapshot when application consistency is important.

For example:

```
sudo shutdown -h now
```

A snapshot can be taken on the DigitalOcean website while the Droplet is running, but applications may have data in memory that has not yet been written to disk.
Databases are a particularly important example.

#### Volume Snapshots

Volumes can be snapshotted independently.

From the DigitalOcean Control Panel:

1. Locate the **Volumes** page.
2. Locate the Volume.
3. Open its **More** menu.
4. Select **Take Snapshot**.

A Volume snapshot captures the Volume's data and can later be used to create another Volume.

DigitalOcean describes Volume snapshots as **crash-consistent**: writes are frozen at a particular point and all data written to the storage layer at that time is captured.
However, that does not guarantee that every application has flushed all of its in-memory data or left its files in an application-consistent state.
For particularly important or actively changing data, we may therefore want to stop the application or otherwise quiesce it before taking a snapshot.

#### Snapshot Costs

Snapshots also incur storage charges.
At the time this lecture was written, DigitalOcean charges approximately:

```
$0.06 per GB per month
```

for Droplet snapshots and:

```
$0.06 per GiB per month
```

for Volume snapshots.

Snapshots are retained and incur costs until we delete them.

## Automated Droplet Backups

DigitalOcean also provides an automated **Backups** service.
Unlike a snapshot, which we create when we choose, backups can be created automatically on a schedule.
DigitalOcean currently offers schedules ranging from weekly and daily backups to more frequent usage-based backup intervals.

This gives us an important distinction:

```
snapshot
   └── administrator decides when to capture it

backup
   └── automatically captured according to a schedule
```

But there is a particularly important limitation:

> **DigitalOcean Droplet backups do not include attached Volumes.**

If important information exists on an attached Volume, that Volume must be protected separately, for example by creating Volume snapshots.

Suppose our server looks like this:

```
Droplet
│
├── /dev/vda
│      └── operating system
│
└── /dev/sda
       └── /mnt/enterprise_d_1
```

Enabling Droplet backups protects:

```
/dev/vda
```

but it does **not** automatically protect:

```
/dev/sda
```

That distinction is easy to miss.

## Backup Strategies

Professional backup strategies can become quite sophisticated.
For our case, however, there are several useful principles to remember.

### 1. Decide What Needs Protection

Not every file is equally important.

For example, operating-system packages may be easy to reinstall.
However, a unique database containing years of organizational data may be impossible to recreate.
The first question is therefore:

> What data could we not easily replace?

### 2. Decide How Quickly It Must Be Recovered

A snapshot of an entire server may be useful when we want to restore the entire system.
But suppose only one configuration file was accidentally deleted.
Restoring an entire server might be excessive.
Traditional tools can also be used to make file-level backups.
These include:

```
rsync
tar
scp
sftp
```

Tools such as `rsync` and SFTP can be used when only part of a Droplet needs to be backed up.
The main point is that different backup methods solve different problems.

### 3. Automation Matters

A backup strategy that depends entirely on someone remembering to manually create a backup every week is likely eventually to fail.
Thus, scheduled backups reduce this problem.

### 4. A Backup Should Be Recoverable

Creating a backup is only half the task.
A backup has little value if we cannot restore from it.
Administrators should therefore understand and periodically test their recovery process.
The important question is not simply:

> Do we have backups?

It is:

> Could we restore the system or data if we needed to?

## A Simple Example

Imagine that we run a server whose application is stored on the Droplet's primary disk but whose important data resides on a Volume.

```
Droplet
│
├── primary disk
│      ├── Ubuntu
│      ├── software
│      └── configuration
│
└── Volume
       └── organizational data
```

One possible protection strategy might be:

```
Primary disk
    │
    ├── scheduled Droplet backups
    │
    └── snapshot before major system changes

Volume
    │
    ├── periodic Volume snapshots
    │
    └── perhaps file-level backups elsewhere
```

There is no single backup method that is appropriate for every system.
The strategy depends on thinking through what is needed:
Some considerations include:

- what data exists,
- how frequently it changes,
- how valuable it is,
- how quickly it needs to be restored,
- how much data loss is acceptable,
- and what the organization can afford.

## Cleaning Up

Our practice Volume costs money as long as it exists.
When you no longer need it, you should remove it.
First, make sure you do not need any data stored on it.
Then unmount it if necessary:

```
sudo umount /mnt/enterprise_d_1
```

Verify that the Volume is not mounted:

```
lsblk
```

Then detach and delete the Volume through the DigitalOcean Control Panel.
Remember that detaching and deleting are different:

```
unmount
    ↓
Linux stops using filesystem

detach
    ↓
Volume is disconnected from Droplet

delete
    ↓
Volume itself is destroyed
```

Because DigitalOcean bills Volumes while they exist, an unattached Volume can still incur charges.
Likewise, snapshots remain stored—and billed—until you delete them.

## Conclusion

In this section, we expanded the storage available to a DigitalOcean Droplet by attaching a Volume.
DigitalOcean made this process deceptively simple.
We selected a few options in the Control Panel and received a ready-to-use directory under `/mnt`.
Underneath that interface, however, several traditional Linux concepts are still at work:

```
block device
      ↓
filesystem
      ↓
mount
      ↓
mount point
      ↓
files
```

We used commands including:

```
lsblk       examine block devices
df          examine filesystem capacity and usage
findmnt     examine mounted filesystems
blkid       examine block-device filesystem metadata
mount       mount a filesystem
umount      unmount a filesystem
lsof        identify processes using files or filesystems
systemctl   inspect systemd units
```

We also learned that DigitalOcean's automatic Volume configuration may use a **systemd mount unit** rather than a traditional `/etc/fstab` entry.
However, `/etc/fstab` remains an important Linux configuration mechanism and can still be used for manually configured persistent mounts.

Finally, we distinguished among several related concepts:

```
Volume
    additional block storage

Snapshot
    on-demand point-in-time disk image

Backup
    automatically scheduled recovery image
```

Most importantly:

```
storage ≠ backup
```

and:

```
Droplet backup ≠ Volume backup
```

An administrator needs to know not only where data is stored, but also how that data can be recovered when something goes wrong.

[file_systems_redhat]:https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/9/html/managing_file_systems/overview-of-available-file-systems_managing-file-systems
[scsi_wiki]:https://en.wikipedia.org/wiki/SCSI
