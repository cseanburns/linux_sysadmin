# NAT (Network Address Translation)

## Set up NAT

We will want to SSH into our machines without having to use the VirtualBox GUI, and later connect to these virtual machines using other protocols. We can do so by setting up NAT in VirtualBox.

To set up NAT:

In VirtualBox, go to Settings, Network, Advanced, Port Forwarding, and enter the info in the table below. Be sure to replace the **Host IP** address with the IP address of your laptop or desktop. You can find your **Host IP** in your system settings on your Windows or Mac computers, or by opening up a terminal session and typing ``ifconfig`` or the equivalent for your operating system.

| Name | Protocol | Host IP      | Host Port | Guest IP  | Guest Port |
|:-----|:--------:|:------------:|:---------:|:---------:|-----------:|
| SSH  | TCP      | 10.163.36.88 | 2222      | 10.0.2.15 | 22         |


Once you have that IP, and have made the above changes, start your Fedora clone in headless mode.

Now you can SSH into your virtual machine using the terminal of your choice (e.g., the one you used to connect to the remote server).

From a command line, we are going to SSH through port 2222 via our Host IP address. For me, that looks like this:

```
ssh -p 2222 user@10.163.36.88
```
