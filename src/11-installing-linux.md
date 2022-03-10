# Installing and Configuring Fedora 34 Linux Server

## Download and Install VirtualBox && download fedora

1. Download fedora Server Edition. We'll install the x86_64 netinstall ISO image because it's a smaller download, and then we can install other items once Fedora is running.
    - [https://getfedora.org/][getfedora]
    - [https://getfedora.org/en/server/download/][getfedoradownload]
1. Download VirtualBox. This will vary depending on whether you run macOS or Windows. If you have issues here, please seek tutorials elsewhere, like YouTube.
    - Download VirtualBox: [https://www.virtualbox.org/][virtualbox]
1. Install VirtualBox however you install software for your operating system. 
    - Instructions for [macOS Big Sur][vbbigsur]. **Note: instructions from this video are only valid until the 4:20 time. Do not use these instructions after that point of the video.**
    - Instructions for [Windows 10][vbwin10]. **Note: instructions from this video are only valid until the 2:30 second mark. Do not use these instructions after that point.**
1. Be aware of the [VirtualBox user manual][vbmanual]. I'm not asking you to read it, but if you have any issues, you should search this documentation.

## Host machine set up

1. Create a directory on your own Windows or macOS computer, and call it **iso**. It's fine to create this directory in your home directory, or in your documents directory, or wherever.
1. Move the fedora ISO file that you downloaded to your new **iso** directory.
1. In your **iso** directory, create a new directory called **virtualbox**.

## Set up fedora in VirtualBox

1. Click on the **New** button
1. In the **Name:** field, type in **Fedora-Base-34**. As you type this in, VirtualBox should automatically recognize the **Type:** and **Version**. Click **Next >**.
1. **Memory size**: Depending on your laptop's memory capabilities, you can set this higher, but it's not necessary. The default **1024 MB** should be fine.
1. **Hard disk**: The default is 8.00 GB. We will change this to 100 GB on an upcoming screen. For now, make sure you select the default **Create a virtual hard disk now**, and then click on **Create**.
1. **Hard disk file type**: Accept the default, which is **VDI**.
1. **Storage on physical hard disk**: Accept the default, which is **Dynamically allocated**
1. **File location and size**: Here you adjust to the disk size to 100 GB. Note that you will not use all of this space on your hard drive. It's the maximum amount that you can use. Click on **Create**.

The settings box should close. Now highlight the virtual machine in the left pane of the VirtualBox menu, and click on Start.

## Install fedora in VirtualBox

1. When you start, a window will pop up and ask you to select a virtual optical disk. This is the fedora 34 ISO that you downloaded and that you saved to your new **iso** folder. We have to select the file icon in the window and then find and select the ISO that we downloaded. Once you do that, click on **Start**.
1. A terminal will open up. Press **Enter** on the Installing Fedora 34 option. Some setup text will scroll by and soon a graphical installer will launch.
1. In the graphical installer, you'll get a message: "WELCOME TO FEDORA 34." US English should be the default options in both panes. Click on **Continue**.
1. We only have to configure a few things. Click on **Software Selection**. In
   the right pane, under **Additional software for Selected Environment**, select **Headless Management** and then click on **Done**.
1. Now we have to partition our hard drive. We could accept automatic partitioning, but we want to fine tune this. So click on **Installation Destination**.
1. At the bottom of the window it says **Storage Configuration**. Select **Custom** and then **Done**.
1. **Manual Partitioning**: In the next screen, the **LVM** option should already be selected. This stands for **Logical Volume Management**. Make sure that stays selected.
1. Now we create some partitions. Partitioning a drive is a way to slice up a drive into parts so that we better manage the use of the drive. As we create these partitions, note the two pieces of information at the bottom of the screen: the *Available Space* and the *Total Space*. The Available Space will change as we add partitions.
1. Click on the **+** icon. In the **Mount Point** box, we'll first create the  **root partition**, which is indicated with the forward slash: **/**. For **Desired Capacity**, we should input **20 GB**. In the next screen, change the **File System** to **ext4**.
1. Next we create our other partitions. These include **/boot**, **/home**, **/var**, **/tmp** partitions and the **swap** file (note the missing slash). Click on the plus sign and repeat the process for these partitions. We'll leave about 34 GB of free disk space available for later use. Altogether, our partition map should look like this, but **fedora** will adjust the sizes a bit:

    | Mount Point/Partition | Size  | File System |
    |-----------------------|-------|-------------|
    | /home                 | 30 GB | ext4        |
    | /                     | 20 GB | ext4        |
    | /tmp                  | 6 GB  | ext4        |
    | /var                  | 10 GB | ext4        |
    | /boot                 | 1 GB  | ext4        |
    | swap                  | 4 GB  | swap        |

    Note that the **/boot** partition is mapped to **sda1**. This is handy to remember.

    Note also that the Available Space listed at the bottom should be about 33.86 GiB.

    After you've inputted the above info, click on **Done**. Then click on **Accept Changes** in the next window.

1. Set up Root Password. Save this password!
1. Click on **Begin Installation**. This might take up to 15 minutes depending on the strength of your internet connection and what kind of hardware you have. 
1. Wait until installation is complete and you are able to Reboot System. HOWEVER, do not reboot yet. Instead, choose **Close** from the **File** menu, and then click **Power off the machine.** 
1. In VirtualBox settings, click on the settings for this machine.
1. In the window that pops up, click on the **System** tab (this may look different if you're on macOS, especially).
1. Deselect the Floppy and Optical options next to **Boot Order**, and then click **Okay**.
1. Click on **Start** to boot your system back.

## Boot fedora; update system; and create regular user

1. Once your system is running, you will get a login prompt. Login as the user ``root``.
1. Update your system right away with the following commands:

    ```
    dnf updateinfo
    dnf upgrade
    ```

    The first command will sync your local repository with the remove repositories that manage software updates. The second command will update the software on your system if updates are available.

1. We do not normally want to work in the ``root`` account. So next we need to a regular user. To create a new user, do the next command. Instead of **sean**, create a username that you like. Make sure it is one word and that it is all lowercase:

    ```
    useradd -m -U -s /usr/bin/bash -G wheel sean
    ```

    The above command will create a new user named *sean* and put that user in group of the same name, create a home directory for that user, make ``bash`` the default shell for that user, and assign that user to the **wheel** group, which will make that user an administrator of the system. Read ``man useradd`` for more details.

1. Next create a password for your new user:

    ```
    passwd sean
    ```

    Once you have completed these steps, you can power off the machine:

    ```
    poweroff
    ```

## Clone the machine

In the VirtualBox Manager, right click on our installation, and then select **Clone**. Accept the default name or rename it as you prefer. Be sure to choose **Full clone**.

That's good for now. Congratulations! You have just completed your first installation of a Linux server.

[getfedora]:https://getfedora.org/
[getfedoradownload]:https://getfedora.org/en/server/download/
[virtualbox]:https://www.virtualbox.org/
[vbmanual]:https://www.virtualbox.org/manual/
[vbbigsur]:https://www.youtube.com/watch?v=1ASMgibukWI
[vbwin10]:https://www.youtube.com/watch?v=8mns5yqMfZk
