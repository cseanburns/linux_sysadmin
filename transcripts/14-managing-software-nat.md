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
