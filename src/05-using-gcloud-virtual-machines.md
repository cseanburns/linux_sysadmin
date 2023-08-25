# Using gcloud for Virtual Machines 

## Virtual Machines

Our goal in this section 
is to create a **virtual machine (VM)** *instance* running
a distribution of the Linux operating system.
A VM is basically a virtualized operating system
that runs on a host operating system.
That host operating system may also be Linux,
but it could be Windows or macOS.
In short,
when we use virtual machines,
it means instead of installing an operating system
(like Linux, macOS, Windows, etc) on a physical machine,
we use virtual machine software to mimic the process.
The virtual machine, thus, runs on top of our main OS.
It's like an app, where the app is a fully functioning
operating system.

There are other ways to run virtual machines.
For example, we could use [VirtualBox][virtualbox] to create
virtual machines with Linux as the virtual operating system.
VirtualBox is freely available virtualization software,
and using it lets people
run Linux as a server
on our their desktops and laptops without changing
the underlying OS on those machines
(e.g., Windows, macOS).

However, even though we virtualize an operating
system when we run a VM,
the underlying operating system and CPU architecture
is still important.
When Apple, Inc launched their new M1 
(ARM-based) chip in 2020,
it created problems for running non ARM-based operating
systems as virtual machines (i.e., x86_64 chips).

Fortunately, we have other choices in third-party virtualization platforms.
In this book, we're going to use gcloud (via Google),
but there are other options available that you 
can explore on your own.

## Google Cloud / gcloud

### Google Account

We need to have a Google account to get started with gcloud.
I imagine most of you already have a Google account,
but if not, go ahead and create one at [https://www.google.com][google].

### Google Cloud (gcloud) Project

Next, we need to use gcloud
to create a Google Cloud project.
Once you've created that project,
we can enable billing for that project,
and then install the gcloud software 
on our local machines.

Follow **Step 1** at the top of the 
**[Install the gcloud CLI][gcloudInstall]** page
to create a new project.
Also, review the page on
[creating and managing projects][gcloudProjects].

When you create your project, you can name it anything,
but try to name it something to do with this project.
E.g., I might use the name **sysadmin-418**.
**Avoid using spaces when naming your project.**

Then click on the **Create** button,
and leave the organization field set to **No Organization**.

### Google Billing

The second thing to do is to set up
a billing account for our gcloud project.
This means there is a cost associated
with this product, but
the good news is that the cost for the machines we will build
will be minimal
(usually about one dollar a month for a minimal machine).
**[Follow Step 2][gcloudInstall]** to enable
billing for the new project.
See also the page on how to
**[create, modify, or close your self-serve Cloud Billing account][googleBilling]**

### Install the latest gcloud CLI version 

After we have set up billing,
the next step is to install gcloud on our local machines. 
The **[Install the gcloud CLI][gcloudInstall]** page
provides instructions for different operating systems.

There are installation instructions
for macOS, Windows, Chromebooks, and various Linux distributions.
Follow these instructions closely for the operating system
that you're using.
Note that for macOS,
you have to choose among three different CPU/chip
architectures.
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

After you have downloaded the gcloud CLI
for your particular OS and CPU architecture,
you will need to open a command prompt/terminal
on your machines to complete the instructions
the describe how to install the gcloud CLI.
macOS uses the Terminal app,
which can located using Spotlight.
Windows user can use Command.exe,
which can be located by search also.

Windows users will download a regular **.exe** file,
but macOS users will download a **.tar.gz** file.
Since macOS is Unix, you can use the ``mv`` command to 
move that file to your ``$HOME`` directory.
Then you extract it there using the ``tar`` command,
and once extracted
you can change to the directory that it
creates with the ``cd`` command.
For example, if you are running macOS and are
downloading the X86_64 version of the gcloud CLI,
then open your Terminal.ap and run the following commands:

```
cd ~/Downloads
mv google-cloud-cli-444.0.0-darwin-x86_64.tar.gz $HOME
tar -xzf google-cloud-cli-444.0.0-darwin-x86_64.tar.gz 
cd google-cloud-sdk
```

Modify the above commands, as appropriate,
if you're using the M1 version
of the gcloud CLI.

### Initializing the gcloud CLI

Once you have downloaded and installed
the gcloud CLI program,
you need to initialize it on your local machine.
Scroll down the install page
to the section titled
[**Initializing the gcloud CLI**][ginit].
In your terminal/command prompt,
run the initialization command,
per the instructions at the above page:

```
gcloud init
```

And continue to follow the above instructions.

## gcloud VM Instance

Once you've initialized gcloud,
log into [Google Cloud Console][gcloudConsole],
which should take you to the Dashboard page.

Our first goal is to create a **virtual machine (VM)** *instance*.
As a reminder,
a VM is basically a virtualized operating system.
That means instead of installing an operating system
(like Linux, macOS, Windows, etc) on a physical machine,
software is used to mimic the process. 

gcloud offers a number of Linux-based operating systems
to create VMs.
We're going to use the Ubuntu operating system
and specifically the Ubuntu 20.04 LTS version.

> Ubuntu is a Linux distribution.
> A new version of Ubuntu is released every six months.
> The 20.04 signifies that this is the April 2020 version.
> LTS signifies **Long Term Support**.
> LTS versions are released every two years,
> and Canonical LTD,
> the owners of Ubuntu,
> provide standard support for LTS versions for five years.
>
> LTS versions of Ubuntu are also more stable.
> Non-LTS versions of Ubuntu only receive nine months of standard support,
> and generally apply cutting edge technology,
> which is not always desirable for server operating systems.
> Each version of Ubuntu has a code name.
> 20.04 has the code name **Focal Fossa**.
> You can see a list of versions, code names, release dates,
> and more on Ubuntu's [Releases][ubuntuReleases] page.

We will create our VM using the gcloud console.
To do so, follow these steps:

- Click the **Select from** drop-down list.
- In the window, select the project that you created earlier.
- Next, click on **Create a VM**.
- Provide a name for your **instance**.
    - E.g., I chose **fall-2022** (no spaces) 
- Under the **Series** dropdown box, make sure **E2** is selected.
- Under the **Machine type** dropdown box, select **e2-micro (2 vCPU, 1 GB memory)**
    - This is the lowest cost virtual machine and perfect for our needs.
- Under **Boot disk**, click on the **Change** button.
- In the window, select **Ubuntu** from the **Operating system** dropdown box.
- Select **Ubuntu 20.04 LTS x86/64**
- Leave **Boot disk type** be set to **Balanced persistant disk**
- Disk size should be set to **10 GB**.
- Click on the **Select** button.
- Check the **Allow HTTP Traffic** button
- Finally, click on the **Create** button to create your VM instance.

## Connect to our VM

After the new VM machine has been created,
we need to connect to it via the command line.
macOS users will connect to it via their Terminal.app.
Windows users can connect to it via their command prompt or use [PuTTY][putty].

If you have used ``ssh`` before,
note that we use a slightly different ``ssh`` command
to connect to our VMs.
The syntax follows this pattern:

```
gcloud compute ssh --zone "zone-info" "name-info" --project "project-id"
```

You need to replace the values in the double quotes in the above command
with the values located in your Google Cloud console and
in your VM instances section.

## Update our Ubuntu VM

The above command will connect you to the remote Linux server, or the VM.
The VM will include a recently updated version of Ubuntu 20.04,
but it may not be completely updated.
Thus the first thing we need to do is update our machines.
On Ubuntu, use the following two commands to update your machines,
which you should run also:

```
sudo apt update
sudo apt -y upgrade
```

Then type ``exit`` to logout and quit the connection to the remote server.

```
exit
```

Typing ``exit`` at the prompt will always close our connection to our remote servers.

## Snapshots

We have installed a pristine version of Ubuntu,
but it's likely that we will mess something up 
as we work on our systems.
Or it could be that our systems may become compromised
at some point.
Therefore, we want to create a snapshot of our newly
installed Ubuntu server.
This will allow us to restore our server if something
goes wrong later.

To get started:

1. In the left hand navigation panel, click on **Snapshots**.
2. At the top of the page, click on **Create Snapshot**.
3. Provide a name for your snapshot: e.g., **ubuntu-1**.
4. Provide a description of your snapshot: e.g., **This is a new install of Ubuntu 20.04.**
5. Choose your **Source disk**.
6. Choose a **Location** to store your snapshot.
    - To avoid extra charges, choose **Regional**.
    - From the dropdown box, select the same location (zone-info) your VM has
7. Click on **Create**

**<p style="color:red">Please monitor your billing for this to avoid costs
that you do not want to incur.</p>**

## Conclusion

Congratulations!
You have just completed your first installation of a Linux server.

To summarize,
in this section,
you learned about and created a VM with gcloud.
This is a lot! 
After this course is completed,
you will be able to fire up a virtual machine
on short notice and deploy websites and more.

[virtualbox]:https://www.virtualbox.org/
[google]:https://www.google.com
[googleBilling]:https://cloud.google.com/billing/docs/how-to/manage-billing-account
[gcloudInstall]:https://cloud.google.com/sdk/docs/install-sdk
[gcloudConsole]:https://console.cloud.google.com/
[gcloudProjects]:https://cloud.google.com/resource-manager/docs/creating-managing-projects#gcloud
[ubuntuReleases]:https://wiki.ubuntu.com/Releases
[ginit]:https://cloud.google.com/sdk/docs/install-sdk#initializing_the
[putty]:https://cloud.google.com/compute/docs/connect/standard-ssh#putty-app
