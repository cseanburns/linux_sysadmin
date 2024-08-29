# Using gcloud for Virtual Machines 

After this section, you will be able to achieve the following outcomes:

- **Understand the concept of Virtual Machines (VMs):** Learn what a VM is and how it operates on a host operating system.
- **Set up a Google Cloud project using `gcloud`:** Create a Google Cloud project and enable billing for it.
- **Create a Virtual Machine instance:** Configure and deploy a VM on Google Cloud using the Ubuntu 20.04 LTS operating system.
- **Install and initialize the `gcloud` CLI:** Set up the `gcloud` command interface on your local machine for managing cloud resources.
- **Connect to the VM using SSH:** Establish a secure connection to your VM via the command line from your local machine.
- **Update and manage the VM:** Perform essential updates on the VM and create snapshots for backup and recovery.

## Virtual Machines

Our goal in this section  is to create a **virtual machine (VM)** *instance* running a distribution of the Linux operating system.
A VM is basically a virtualized operating system that runs on a host operating system.
That host operating system may also be Linux, but it could be Windows or macOS.
In short, when we use virtual machines,
it means instead of installing an operating system ,like Linux, macOS, Windows, etc, on a physical machine,
we use virtual machine software to mimic the process.
The virtual machine thus runs on top of our main OS.
It's like an app, where the app is a fully functioning operating system.

In this book, we're going to use `gcloud` (via Google) to create and run our virtual machines.
There are other options available that you can explore on your own.

## Google Cloud / gcloud

### Google Account

To create our virtual machines using `gcloud`, we need a Google account.
I imagine you already have a Google account, but if not, then create one at [https://www.google.com][google].

### Google Cloud (gcloud) Project

In the following, we will use `gcloud` to create a Google Cloud project.
Once you've created that project, we can enable billing for that project, and then install the gcloud software on personal machines.

To begin, you will need to visit the `gcloud` documentation that I've inserted throughout this page.
Closely follow those instructions.
I help explain the steps throughout this page.
However, it is imperative that you **read through the instructions** closely.

First, follow **Step 1** at the top of the  **[Install the gcloud CLI][gcloud_install]** page to create a new project.
Also, review the page on [creating and managing projects][gcloud_projects].

When you create your project, you can name it anything, but try to name it something to do with this project.
E.g., I might use the name **sysadmin-418**.
*Avoid using spaces when naming your project.*

Click on the **Create** button, and leave the organization field set to **No Organization**.

### Google Billing

Second, set up a billing account for your gcloud project.
This means there is a cost associated with this product, but the machines we'll build require few resources and the cost should be minimal.
In the past, I usually pay about $1 per month.
**[Follow Step 2][gcloud_install]** to enable billing for the new project.
See also the page on how to **[create, modify, or close your self-serve Cloud Billing account][google_billing]**

### gcloud VM Instance

Next, log into [Google Cloud Console][gcloud_console].
This should take you to the Dashboard page.

Our first goal is to create a **virtual machine (VM)** *instance*.
As a reminder, a VM is a virtualized operating system.
We will use software to mimic the process of installing an operating system on Google's servers. 

Google Cloud offers a number of Linux-based operating systems to create VMs.
We're going to use the Ubuntu operating system and specifically the Ubuntu 20.04 LTS version.

> What is Ubuntu?
> Ubuntu is a Linux distribution.
> A new version of Ubuntu is released every six months.
> The 20.04 signifies that this is the April 2020 version.
> LTS signifies **Long Term Support**.
> LTS versions are released every two years,
> and Canonical LTD,
> the owners of Ubuntu,
> provide standard support for LTS versions for five years.
> Thus, Ubuntu 20.04 is supported till April 2025.
>
> LTS versions of Ubuntu are more stable.
> Non-LTS versions of Ubuntu only receive nine months of standard support,
> and generally use cutting edge technology,
> which is not always desirable for server operating systems.
> Each version of Ubuntu has a code name.
> 20.04 has the code name **Focal Fossa**.
> You can see a list of versions, code names, release dates,
> and more on Ubuntu's [Releases][ubuntu_releases] page.

We will create our VM using the Google Cloud dashboard.
To do so, follow these steps:

- Click the three horizontal bars at the top left of the screen.
- Hover over the **Compute Engine** link, and then select **VM Instances**.
- In the window, select the project that you created earlier.
    - E.g., for me, I used the project name **sysadmin-418**.
- Next, click on **Create Instance**.
- Change the name for your **instance**.
    - E.g., I chose **fall-2024** (no spaces) 
- Under the **Machine Configuration** section, make sure **E2 (Low cost, day-to-day computing)** is selected.
- Under the **Machine type** drop down box, select **e2-micro (0.25-2 vCPU (1 shared core), 1 GB memory)**
    - This is the lowest cost virtual machine and perfect for our needs.
- Under **Boot disk**, click on the **Change** button.
- In the window, select **Ubuntu** from the **Operating system** drop down box.
- Select **Ubuntu 20.04 LTS x86/64**
- Leave **Boot disk type** be set to **Balanced persistent disk**
- Disk size should be set to **10 GB**.
- Click on the **Select** button.
- Check the **Allow HTTP Traffic** button
- Finally, click on the **Create** button to create your VM instance.

### Install the latest gcloud CLI version 

The instructions above will be the same for anyone, but the following instructions will differ depending on the operating system for your local machine.

The next step is to install gcloud on your local machines.
This will allow us to connect to remote server using our own terminal applications.
The **[Install the gcloud CLI][gcloud_install]** page provides instructions for different operating systems.

There are installation instructions for macOS, Windows, Chromebooks, and various Linux distributions.
Follow these instructions closely for the operating system that you're using.

> Note that for macOS, you have to choose among three different CPU/chip architectures.
> If you have an older macOS machine (before November 2020 or so), it's likely that you'll select **macOS 64-bit (x86_64)**.
> If you have a newer macOS machine, then it's likely you'll have to select **macOS 64-bit (arm64, Apple M1 silicon).**
> It's unlikely that any of you are using a 32-bit macOS operating system.
> If you're not sure which macOS system you have, then let me know and I can help you determine the appropriate platform.
> Alternatively, follow these instructions to find your processor information:
>
> - click on the Apple menu
> - choose **About This Mac**
> - locate the **Processor** or **Chip** information

After you have downloaded the gcloud CLI for your particular OS and CPU architecture,
you will need to open a command prompt/terminal on your machines to complete the instructions that describe how to install the gcloud CLI.
macOS uses the Terminal app, which can be located using Spotlight.
Windows users can use Powershell.

### Windows Users

Windows users will download a regular **.exe** file, and launch the installer in the regular Windows way.
Please follow the rest of the instructions for Windows.

### macOS Users

**macOS** users may need to complete some setup work before installing Google Cloud.
First, open your Terminal.app and run the following code:

```
xcode-select --install
```

Once the Xcode developer tools are installed, you need to install the macOS Homebrew package manager.
To do so, follow the instructions here:

[Homebrew][homebrew]

After Homebrew is installed use the `brew` command to install [pyenv][pyenv].

```
brew install pyenv
```

And then use `pyenv` to install the latest version of Python.
For example, to install the [latest release of Python][python3] (as of August 2024):

```
penv install 3.12.5
```

Finally, you can install the Google Cloud application using the steps outlined above.
Or you can use the steps outlined in the [Google Cloud Interactive installation][gcloud_interactive].

See also:

[Setting up a Python development environment][python_dev]

#### macOS gcloud Install

macOS users will download a **.tar.gz** file and extract the **.tar.gz** using the ``tar`` command.
The **.tar.gz** file may have been downloaded to your **Downloads** folder.
First, in your Terminal.app, move that file to your home directory and extract it there.
Once extracted, change to home directory with the ``cd`` command.
For example, if you are running macOS and downloaded the X86_64 version of the gcloud CLI, then open your Terminal.app and run the following commands:

```
mv ~/Downloads/google-cloud-cli-darwin-x86_64.tar.gz $HOME
cd $HOME
tar -xzf google-cloud-cli-444.0.0-darwin-x86_64.tar.gz 
cd google-cloud-sdk
```

Modify the file names in the commands above, as appropriate, if you're using the M1 version of the gcloud CLI.

### Initializing the gcloud CLI

Regardless if you're using macOS or Windows, you will now initialize your Google Cloud installation the same way.
First, scroll down the install page to the section titled [**Initializing the gcloud CLI**][g_init].
In your terminal, run the initialization command.
Per the instructions at the above page, it should be something like so:

```
gcloud init
```

And continue to follow the instructions in the documentation.

## Connect to our VM

After the new VM machine has been created, you connect to it via the command line.
macOS users will connect to it via their Terminal.app.
Windows users can connect to it via their command prompt or use [PuTTY][putty].

If you have used ``ssh`` before, note that we use a slightly different ``ssh`` command to connect to our VMs.
The syntax follows this pattern:

```
gcloud compute ssh --zone "zone-info" "name-info" --project "project-id"
```

You need to replace the values in the double quotes in the above command
with the values located in your Google Cloud console and
in your VM instances section.

You can select the **SSH** drop down box to copy the exact ``gcloud`` command to connect to your server.

## Update our Ubuntu VM

The above command will connect you to the remote Linux virtual machine server.
The VM will include a recently updated version of Ubuntu 20.04, but it may not be completely updated.
Thus the first thing we need to do is update our machines.
Since this is an Ubuntu machine, use the following two commands to update your machines:

```
sudo apt update
sudo apt -y upgrade
```

Then reboot the server with the following command:

```
sudo reboot
```

> You do not always have to reboot when updating your server.
> It is only necessary when there has been a kernel update.
> I'm assuming that when we update these machines for the first time after installation,
> that there will have been a kernel update.

If you reboot your server, you will automatically be disconnected from it.
If you do not need to reboot your server, then type ``exit`` to logout and quit the connection to the remote server.

```
exit
```

Typing ``exit`` at the prompt will always close our connection to our remote servers.

## Snapshots

You have installed a pristine version of Ubuntu, but mistakes will happen while learning how to use your machines.
It's therefore important to backup this pristine version of the operating system.
Therefore, you want to create a snapshot of the newly installed Ubuntu server.
This will allow you to restore the server if something goes wrong later.

To get started:

1. In the left hand navigation panel, click on **Snapshots**.
2. At the top of the page, click on **Create Snapshot**.
3. Provide a name for your snapshot: e.g., **ubuntu-1**.
4. Provide a description of your snapshot: e.g., **This is a new install of Ubuntu 20.04.**
5. Choose your **Source disk**.
6. Choose a **Location** to store your snapshot.
    - To avoid extra charges, choose **Regional**.
    - From the drop down box, select the same location (zone-info) your VM has
7. Click on **Create**

**<p style="color:red">Please monitor your billing for this to avoid costs
that you do not want to incur.</p>**

## Conclusion

Congrats!
You have successfully completed your first Linux server installation using `gcloud`.
In this section, you learned about virtual machines (VMs) and created one using Google Cloud.
Specifically, you created a Ubuntu 20.04 LTS Linux virtual machine.
While this may seem like a lot of information, by the end of this book you will be able to effortlessly deploy and manage VMs for various tasks.
Such tasks may include setting up websites and more.

[gcloud_console]:https://console.cloud.google.com/
[gcloud_install]:https://cloud.google.com/sdk/docs/install-sdk
[gcloud_interactive]:https://cloud.google.com/sdk/docs/downloads-interactive#linux-mac
[gcloud_projects]:https://cloud.google.com/resource-manager/docs/creating-managing-projects#gcloud
[g_init]:https://cloud.google.com/sdk/docs/install-sdk#initializing_the
[google_billing]:https://cloud.google.com/billing/docs/how-to/manage-billing-account
[google]:https://www.google.com
[homebrew]:https://brew.sh/
[putty]:https://cloud.google.com/compute/docs/connect/standard-ssh#putty-app
[pyenv]:https://github.com/pyenv/pyenv
[python3]:https://www.python.org/
[python_dev]:https://cloud.google.com/python/docs/setup
[ubuntu_releases]:https://wiki.ubuntu.com/Releases
