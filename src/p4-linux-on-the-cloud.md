# Linux on the Cloud

Up to this point, we have used the command line on a shared server.
This meant that you had no control over the server itself.
You could work with files, run commands, and explore the system, but most administrative tasks were restricted to the `root` user.

Your path to independence begins now!

In the following sections, you will create your own Linux virtual machine (VM) using a hosting service.
In the lessons that follow, we will use DigitalOcean's hosting service.
DigitalOcean calls its VMs **Droplets**.
Unlike our shared server, your Droplets (or VMs) will belong to you, and you will have full administrative access to it and full responsibility for it.
You will learn how to create users, install and configure software, manage services, change system settings, and eventually install and operate your own web server.

Creating a VM introduces an important part of Linux systems administration, which is working with a computer that is somewhere else (i.e., on the cloud).
Like our shared server, the VM will not have a monitor, keyboard, or graphical user interface (i.e., a desktop) for you to use.
Just like with our shared server, you will connect to it remotely from your own computer using **SSH** (Secure Shell) and administer the VM through the command line.

In this section, our goal is to get the machine running and connected to it.
Then we will begin to administer and configure it as we move through the rest of this book.
