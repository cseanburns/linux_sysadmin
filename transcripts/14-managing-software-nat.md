# NAT (Network Address Translation) and Managing Software 

## Set up NAT

If we want to SSH into our machines without having to use the VirtualBox GUI,
we can do so by setting up NAT in VirtualBox. If we were on a wired connection
(not wireless), we could set up a bridged connection, but that's not simple
when we're connected to a router via wireless. To set up NAT: 

Go to Settings, Network, Advanced, Port Forwarding, and enter the following in 
the table:

| Name | Protocol | Host IP      | Host Port | Guest IP  | Guest Port |
|:-----|:--------:|:------------:|:---------:|:---------:|-----------:|
| SSH  | TCP      | 10.163.0.2   | 2222      | 10.0.2.15 | 22         |

The Host IP should be the IP address for your physical machine. You can find
this in your system settings on your Windows or Mac computers, or by opening up
a terminal session and typing ``ifconfig`` or the equivalent for your operating
system. Once you have that IP, start your Fedora clone in headless mode, and
SSH into your virtual machine using the terminal of your choice (e.g., the one
you used to connect to SISED). From a command line (or via PuTTY settings), we
are going to SSH through port 2222 via our Host IP address:

```
$ ssh -p 2222 user@10.163.0.2
```

Read about NAT and VirtualBox here: [https://www.virtualbox.org/manual/ch06.html][1]

[1]:https://www.virtualbox.org/manual/ch06.html

Two ``VBoxManage`` commands that you can run from your **Host** machine:

```
VBoxManage list vms
VBoxManage startvm "Name of VMS" --type headless
```

# Managing Software

Many modern Linux distros offer some kind of package management for
installing, managing, and removing software. On RedHat based systems, package
management is based on RPM (the RedHat Package Manager). On Debian based
systems, package management is based on **dpkg**. 

There are some advanced things you can do with these base package management
systems, but most of the time it will be easier to use their front ends. For
RedHat systems, the current front end is called **dnf**, and for Debian systems,
it's **apt** or **apt-get**. Let's look at a few of the basic **dnf** commands:

To see a history of how *dnf* has been used on the system:

``$ sudo dnf history``

To get info on the history of a specific package:

``$ sudo dnf history mosh``

To get information on a specific package:

``$ sudo dnf info bash``

To search by tag, which you can see listed in the info search:

``$ sudo dnf repoquery --queryformat "%{arch}" bash``

``$ sudo dnf repoquery --queryformat "%{reponame}" mosh``

# Let's install something:

```bash
$ dnf search tmux
$ dnf info tmux
$ sudo dnf install tmux
$ echo "set-option -g prefix C-a" > .tmux.conf
$ tmux
```

## dnf basics

Here are the basic ``dnf`` commands. See ``man dnf`` for details:

- dnf search [name]
- dnf install [name]
- dnf remove [name]
- dnf repolist
- dnf list installed
- dnf list available
- dnf provides /bin/bash
- dnf info [name]
- dnf update [name]
- dnf check-update
- dnf update OR dnf upgrade
- dnf autoremove
- dnf clean all
- dnf help clean
- dnf help
- dnf history
- dnf grouplist | less
- dnf groupinstall 'Python Science'
- dnf groupupdate 'Python Science'
- dnf groupremove 'Python Science'
