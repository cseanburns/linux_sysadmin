# Web Console and NAT

We set NAT to allow SSH traffic between the Host computer (our computers) and the Guest computer (the virtual machines).

[ Insert video demo ]

In VirtualBox, go to Settings, Network, Advanced, Port Forwarding, and add the info in the table below. Be sure to replace the **[ YOUR IP ]** address with the IP address of your laptop or desktop.

| Name     | Protocol | Host IP      | Host Port | Guest IP  | Guest Port |
|:--------:|:--------:|:------------:|:---------:|:---------:|-----------:|
| Console  | TCP      | [ YOUR IP ]  | 9091      | 10.0.2.15 | 9090       |


Now you can access the console from your regular web browser by visiting the following URL:

```
https://YOURIP:9091
```
