# Expanding Storage 

By the end of this section, you will be able to:

1. **Understand Virtual Machine Storage Expansion**: Gain practical knowledge
   on how to add additional storage to a virtual machine (VM) by creating and
   attaching a persistent disk.
1. **Disk Formatting and Mounting**: Learn the process of formatting a non-boot
   disk with the **ext4** filesystem and mounting it to a VM for expanded
   storage capacity.
1. **Filesystem Configuration**: Develop skills in configuring a VM's
   filesystem for automatic mounting using the `/etc/fstab` file to ensure
   persistence across reboots.
1. **Efficient Resource Management**: Understand how to delete unnecessary
   disks and manage cloud storage costs, ensuring efficient use of resources.
1. **Command Line Proficiency**: Improve proficiency with essential command
   line tools such as `mkfs.ext4`, `mount`, `umount`, `chmod`, and editing
   configuration files with `nano`.
1. **Storage Pricing Awareness**: Gain insight into the cost considerations of
   adding additional storage in cloud environments, with practical examples of
   pricing.

## Getting Started

I'm sure all or most of you have needed extra disk storage at some point (USB drives, optical disks, floppies???).
Such needs are no different for systems administrators, who often are responsible for managing, monitoring, or storing large amounts of data.

The disk that we created for our VM is small (10 GB), and that's fine for our needs, albeit quite small in many real world scenarios.
To address this, we can add a persistent disk that is much larger.
In this section, we will add a disk to our VM, mount it onto the VM's filesystem, and format it.
Extra storage does incur extra cost.
So at the end of this section, I will show you how to delete the extra disk to avoid that if you want.

We will essentially follow the Google Cloud tutorial to add a non-boot disk to our VM, but with some modification:

[Add a persistent disk to your VM][pdisk]

> Note: the main disk used by our VM is the **boot disk**.
> The boot disk contains the 
> software required to boot the system.
> All of our computers
> (desktops, laptops, tablets, phones, etc.),
> regardless of which operating system they run,
> have some kind of boot system.

## Creating a Disk

In the Google Cloud console, first make sure you are working in your course project.
Then navigate to **Compute Engine**, and visit the **Disks** page in the **Storage** section.

Once there, follow these steps:

1. Click on **CREATE DISK**.
1. Under **Name**, add a preferred name.
    - For example, you can name it **backup1**.
1. Under **Description**, add text to describe your disk.
    - For example, you can write **Backup**.
1. Under **Location**, leave or choose **Single zone**.
    - We are not concerned about data safety. If we were, then we would select other options here.
1. Select the same **Region** and **Zone** as your VM instance.
1. Under **Source**, select **Blank disk**.
1. Under **Disk settings**, select **Balanced persistent disk**.
1. Under **Size**, change this to 10GB.
    - You can actually choose larger sizes, but be aware that [disk
        pricing][diskPricing] is $0.10 per GB.
    - At that cost, 100 GB = $10 / month.
1. Click on **Enable snapshot schedule**.
1. Under **Encryption**, make sure **Google-managed encryption key** is
   selected.
1. Click **Create** to create your disk.

## Adding the Disk to our VM

Now that we have created our disk, we need to **mount** it onto our filesystem so that it's available to our VM.
Conceptually, this process is like inserting a new USB drive into our computer.

To add the new disk to our VM, follow these steps:

1. Visit the **VM instances** page.
1. Click on the check box next to your virtual machine.
    - That will convert the **Name** of your VM into a hyperlink if it's not already hyperlinked.
1. Click on the **Name** of your VM.
    - That will take you to the **VM instance details** page.
1. Click on the **Edit** button at the top of the details page.
1. Under the **Additional disks** section, click on **+ ATTACH EXISTING DISK**. 
1. A panel will open on the right side of your browser.
1. Click on the drop down box and select the disk, by name, you created.
1. Leave the defaults as-is.
1. Click on the **SAVE** button.
1. Then click on the **SAVE** button on the details page.

If you return to the **Disks** page in the **Storage** section, you will now see that the new disk is in use by our VM.

## Formatting and Mounting a Non-Boot Disk

### Formatting Our Disk

In order for our VM to make use of the extra storage, the new drive must be formatted and mounted.
Different operating systems use different filesystem formats.
You may already know that macOS uses the [Apple File System (APFS)][apfs] by default and that Windows uses the [New Technology File System (NTFS)][ntfs].
Linux is no different, but uses different file systems than macOS and Windows.
There are many formatting technologies that we can use in Linux, but we'll use the [ext4 (fourth extended filesystem)][ext4] format.
This is recommended for Google Cloud, and it is also a stable and common one for Linux.

In this section, we will closely follow the steps outlined under the [**Formatting and mounting a non-boot disk on a Linux VM**][pdisk] section.
I replicate those instructions below, but I highly encourage you to read through the instructions on Google Cloud and here:

1. Use the ``gcloud compute ssh`` command that you have previously used to connect to your VM.
1. When you have connected to your VM, run the ``lsblk``
   command.
    - Ignore the **loop** devices. (Or `grep` invert them: `lsblk | grep -v "^loop"`).
    - Instead, you should see **sda** and **sdb** under the **NAME** column
        outputted by the ``lsblk`` command.
    - **sda** represents your main disk.
        - **sda1, sda14, sda15** represent the partitions of the **sda** disk (the **sdaN** may be different for you).
        - Notice the **MOUNTPOINT** for **sda1** is ``/``. This means that **sda1** is mounted at the root level of the filesystem.
        - Since it's mounted, this means it's in use.
    - **sdb** represents the attached disk we just added.
        - After we format this drive, there will be an **sdb1**, which signifies the drive has been partitioned.
        - After formatting, we will mount this partition on a different mountpoint.

To format our disk for the **ext4** filesystem, we will use the ``mkfs.ext4`` (see ``man mkfs.ext4`` for details).
The instructions tell us to run the following command (please read the Google Cloud instructions closely;
**it's important to understand these commands as much as possible and not just copy and paste them**):

```
sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/DEVICE_NAME
```

But replace **DEVICE_NAME** with the name of our device.
My device's name is **sdb**, which we saw with the output of the ``lsblk`` command; therefore, the specific command I run is:

```
sudo mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb
```

### Mounting Our Disk

Now that our disk has been formatted in **ext4**, I can mount it.

> Note: to **mount** a disk simply means to make the disk's filesystem
> available so that we can use it for accessing, storing, etc files on the
> disk. Whenever we insert a USB drive, a DVD drive, etc into our computers,
> the OS you use should mount that disk automatically so that you can access
> and use that disk. Conversely, when we remove those drives, the OS
> **unmounts** them. In Linux, the commands for these are ``mount`` and
> ``umount``. Note that the ``umount`` command is not **unmount**.

You will recall that we have [discussed filesystems earlier](03-filesystem-file-management.html) and
that the term is a bit confusing since it refers to both the directory hierarchy and also the formatting type (e.g., ext4).
I discussed how Windows assigns drives letters (`A:`, `B:`, etc.) when attaching new drives, like a USB drive.
Unlike Windows, I mentioned that in Linux and Unix (e.g., macOS), when we add an additional disk, its filesystem gets added onto our existing system.
That is, it becomes part of the directory hierarchy and under the ``/`` top level part of the hierarchy.
In practice, this means that we have to create the **mountpoint** for our new disk, and we do that first with the ``mkdir`` command.
The Google Console documentation instructs us to use the following command:

```
sudo mkdir -p /mnt/disks/MOUNT_DIR
```

And to replace **MOUNT_DIR** with the directory we want to create.
Since my added disk is named **disk-1**, I'll call it that:

```
sudo mkdir -p /mnt/disks/disk-1
```

Now we can ``mount`` the disk to that directory. Per the instructions on Google Console, and given that my added drive has the device name **sdb**,
I use the following command:

```
sudo mount -o discard,defaults /dev/sdb /mnt/disks/disk-1
```

We also need to change the modifications, and grant access for additional users:

```
sudo chmod 777 /mnt/disks/disk-1
```

We can test that it exists and is accessible with the ``lsblk`` and the ``cd`` commands.
The ``lsblk`` command should show that **sdb** is mounted at ``/mnt/disks/disk-1``, and we can ``cd`` (change directory) to it:

```
cd /mnt/disks/disk-1
```

### Automounting Our Disk

Our disk is mounted, but if the computer (VM) gets rebooted, we would have to re-``mount`` the additional drive manually.
In order to avoid this and automount the drive upon reboot, we need to edit the file ``/etc/fstab``.

> Note that the file is named **fstab** and that it's located in the **/etc** directory.
> Therefore the full path is ``/etc/fstab``

The **fstab** file is basically a configuration file that provides information to the OS about the filesystems the system can mount.
The standard information **fstab** contains includes the name (or label) of the device being mounted,
the mountpoint (e.g., ``/mnt/disks/disk-1``), the filesystem type (e.g., **ext4**), and various other mount options.
See ``man fstab`` for more details.
For devices to mount automatically upon boot, they have to be listed in this file.
That means we need to edit this file.

Again, here we're following the Google Cloud instructions:

Before we edit system configuration files, however, always create a backup.
We'll use the ``cp`` command to create a backup of the **fstab** file.

```
sudo cp /etc/fstab /etc/fstab.backup
```

Next we use the ``blkid`` command to get the UUID (universally unique identifier) number for our new device.
Since my device is ``/dev/sdb``, I'll use that:

```
sudo blkid /dev/sdb
```

The output should look something like this **BUT NOTE that your UUID value will be DIFFERENT**:

```
/dev/sdb: UUID="3bc141e2-9e1d-428c-b923-0f9vi99a1123" TYPE="ext4"
```

We need to add that value to ``/etc/fstab`` plus the standard information that file requires.
The Google Cloud documentation explicitly guides us here.
We can add that directly to our `fstab` file by redirecting the output of the `blkid` command to that file.
**NOTE: you have to use two angle brackets in the following command, or else you will erase the contents of that file!!!**

```
sudo su
blkid /dev/sdb >> /etc/fstab
exit
```

> Alternatively, we can use ``nano`` to make the edit by copying and pasting the UUID to the end:

And then edit the file with additional mount information at the bottom:

```
sudo nano /etc/fstab
```

And then add the information:

```
UUID=3bc141e2-9e1d-428c-b923-0f9vi99a1123 /mnt/disks/disk-1 ext4 discard,defaults,nofail 0 2
```

Save and exit `nano`.
And that's it!
If you reboot your VM, or if your VM rebooted for some reason, the extra drive we added should automatically mount upon reboot.
If it doesn't, then it may mean that the drive failed, or that there was an error (i.e., typo) in the configuration.

Let's check if it's automounted upon reboot:

```
sudo reboot now
```

Wait a minute, and log back in to check.
Then run the `lsblk` command to see if the new drive is recognized and mounted at `/mnt/disks/disk-1`:

```
lsblk
```

### Delete the Disk

You are welcome to keep the disk attached to the VM.
But if you do not want to incur any charges for it, which would be about $1 / month at 10 GB, then we can delete it.

To delete the disk, first delete the line that we added in ``/etc/fstab``, unmount it, and then delete the disk in the gcloud console.

To unmount the disk, we use the ``umount`` command:

```
sudo umount /mnt/disks/disk-1
```

Check if it's unmounted:

```
lsblk
```

Then we need to delete the disk in gcloud.

1. Go to the **VM instances** page.
1. Click on the check box next to the VM.
1. Click on the name, which should be a hyperlinked.
1. This goes to the **VM instances detail** page.
1. Click on the **Edit** button at the top of the page.
1. Scroll down to the **Additional disks** section.
1. Click the edit (looks like a pencil) button.
1. In the right-hand pane that opens up, select **Delete disk** under the
   **Deletion rule** section.
1. Scroll back to the **Additional disks** section.
1. Click on the ``X`` to detach the disk.
1. Click on **Save**.
1. Go the **Disk** section in the left-hand navigation pane.
1. Check the disk to delete, and then Delete it.
    - Make sure you delete the backup disk and not the main OS disk! 
1. Click on the **Snapshots** section in the left-hand navigation pane (**Compute Engine**, **Storage**, and then **Snapshots**).
1. If a snapshot has been taken, check the disk snapshot to delete, and then Delete it.

## Conclusion

In this section we learned how to expand the storage of our VM by creating a new virtual drive and adding it to our VM.
We also learned how to format the drive in the **ext4** filesystem format, and mount the drive at ``/mnt/disks/disk-1``.
Finally, we learned how to then edit ``/etc/fstab`` to make automount the drive.

In addition to using the gcloud console, the commands we used in this section include:

1. ``ssh``  : to connect to the remote VM
1. ``sudo`` : to run commands as the administrator
1. ``mkfs.ext`` : to create an **ext4** filesystem on our new drive
1. ``mkdir -p`` : to create multiple directories under ``/mnt``
1. ``mount`` : to mount manually the new drive
1. ``umount`` : to unmount manually the new drive
1. ``chmod`` : to change the mountpoint's file permission attributes
1. ``cd`` : to change directories
1. ``cp`` : to copy a file
1. ``nano`` : to use the text editor ``nano`` to edit ``/etc/fstab``

[apfs]:https://support.apple.com/guide/disk-utility/file-system-formats-dsku19ed921c/mac
[createDisk]:https://console.cloud.google.com/compute/disksAdd
[diskPricing]:https://cloud.google.com/compute/all-pricing#disk
[ext4]:https://ext4.wiki.kernel.org/index.php/Main_Page
[ntfs]:https://docs.microsoft.com/en-us/windows-server/storage/file-server/ntfs-overview
[pdisk]:https://cloud.google.com/compute/docs/disks/add-persistent-disk
