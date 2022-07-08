# Ubuntu Server on Google Cloud 

## Google Cloud Setup

### Google Account

I imagine most of you already have a Google account.
If not, then go ahead and create one at [https://www.google.com][google].

## Google Billing

If you already have a Google account,
or after you've created one,
the first thing to do is to set up a billing account for Google Cloud,
where we will create, administer, and manage our virtual Linux servers.
That bad news is that we have to spend some money, but
the good news is that our bills by the end of the semester should
only amount to a couple of dollars, at most.

**[Create, modify, or close your self-serve Cloud Billing account][googleBilling]**

## gcloud Installation

After you have set up billing,
then the next step is to install gcloud on your local machines. 

**[Install the gcloud CLI][gcloudInstall]**

There are installation instructions for macOS and Windows.
Follow these instructions closely.
Note that for macOS,
you have to choose among three different platforms.
If you have an older macOS machine (before November 2020 or so),
it's likely that you'll select **macOS 64-bit (x86_64)**.
If you have a newer macOS machine,
then it's likely you'll have to select **macOS 64-bit (arm64, Apple M1
silicon).**
It's unlikely that any of you are using a 32-bit macOS operating system.
If you're not sure which macOS system you have,
then let me know and I can help you determine the appropriate platform.
Alternatively, follow these instructions to find your processor information:

- click on the Apple menu
- choose **About This Mac**
- locate the **Processor** or **Chip** information

## gcloud Project

Once you've installed gcloud,
log into [Google Cloud Console][gcloudConsole],
which should take you to the Dashboard page.

Our first goal is to create a **virtual machine (VM)** *instance*.
A VM is basically a virtualized operating system.
That means instead of installing an operating system
(like Linux, macOS, Windows, etc) on a physical machine,
software is used to mimic the process. 

gcloud offers a number of Linux-based operating systems
to create VMs with.
We're going to use the Ubuntu operating system in this class
and specifically the Ubuntu 20.04 LTS version.

> Ubuntu is a Linux distribution.
> A new version of Ubuntu is released every six months.
> The 20.04 signifies that this is the April 2020 version.
> LTS signifies **Long Term Support**.
> LTS versions are released every two years,
> and Canonical LTD,
> the owners of Ubuntu,
> provide standard support for LTS versions for five years.
> Non-LTS versions of Ubuntu only receive nine months of standard support.

To create your VMThen follow these steps:

- Click the **Select from** drop-down list.
- In the window, create a **New Project**.
- In the next window, name the project.
    - You can name the project anything.
    - E.g., I am using the name **sysadmin-418**.
    - Click on the **Create** button.
    - Leave the organization field set to **No Organization**.
- Next, click on **Create a VM**.
- Provide a name for your **instance**.
    - E.g., I chose **fall-2022** (no spaces) 
- Under the **Series** dropdown box, make sure **E2** is selected.
- Under the **Machine type** dropdown box, select **e2-micro (2 vCPU, 1 GB memory)**
    - This is the lowest cost virtual machine and perfect for our needs.
- Under **Boot disk**, click on the **Change** button.
- In the window, select **Ubuntu** from the **Operating system** dropdown box.
- Select **Ubuntu 20.04 LTS**
- Leave **Boot disk type** should be set to **Balanced persistant disk**
- Disk size should be set to **10 GB**.
- Click on the **Select** button.
- Check the **Allow HTTP Traffic** button
- Finally, click on the **Create** button to create your VM instance.


- Click on the navigation menu: ``☰``
- Click on **Compute Engine**
- Click on **VM instances**


[google]:https://www.google.com
[gcloudInstall]:https://cloud.google.com/sdk/docs/install
[googleBilling]:https://cloud.google.com/billing/docs/how-to/manage-billing-account
[gcloudConsole]:https://console.cloud.google.com/


```
apt update
apt upgrade
apt autoremove
```


The first command will sync your local repository with the remove repositories
that manage software updates. The second command will update the software on
your system if updates are available.

1. We do not normally want to work in the ``root`` account. So next we need to
   a regular user. To create a new user, do the next command. Instead of
   **sean**, create a username that you like. Make sure it is one word and that
   it is all lowercase:

    ```
    useradd -m -U -s /usr/bin/bash -G wheel sean
    ```

The above command will create a new user named *sean* and put that user in
group of the same name, create a home directory for that user, make ``bash``
the default shell for that user, and assign that user to the **wheel** group,
which will make that user an administrator of the system. Read ``man useradd``
for more details.

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
