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
