# systemd

## Introduction

When computers boot up,
obviously some software manages that process.
On Linux and other Unix or Unix-like systems,
this is usually handled via an **init** system.
For example, macOS uses [launchd][launchd] and
many Linux distributions,
including Ubuntu,
use [systemd][systemd].

**systemd** does more than handle the startup process,
it also manages various services and connects
the Linux kernel to various applications.
In this section,
we'll cover how to use **systemd** to manage services, and
to review log files.

## Manage Services

When we install complicated software,
like a web server (e.g., Apache2, Nginx),
a SSH server (e.g., OpenSSH), or
a database server (e.g., mariaDB or MySQL),
then it's helpful to have commands that manage that service
(the web service, the SSH service, the database service, etc).

For example, the ``ssh`` service is installed
by default on our gcloud servers, and
we can check its status with the following 
``systemctl`` command:

```
systemctl status ssh
```

The output tells us a few things.
The line beginning with **Loaded** tells us that
the SSH service is configured.
At the end of that line,
it also tells us that it is **enabled**,
which means that the service will automatically start
when the system gets rebooted or starts up.

The line beginning with **Active** tells us
that the service is **active (running)** and for how long.
It has to say this since I'm connecting to the machine
using ``ssh``.
If the service was not active (running), then
I wouldn't be able to login remotely.
We also can see the process ID (PID) for the service
as well as how much memory it's using.

At the bottom of the output,
we can see the recent log files.
We can view more of those log files
using the ``journalctl`` command.
By default, running ``journalctl`` by itself
will return all log files, but
we can specify that we're interested in
log files only for the ssh service.
We can specify using the PID number.
Replace *NNN* with the PID number attached
to your ssh service:

```
journalctl _PID=NNN
```

Or we can specify by service, or
more specifically, its **unit** name:

```
journalctl -u ssh
```

### Use Cases

Later we'll install the [Apache web server][apache2], and
we will use ``systemctl`` to manage some aspects of this service.

In particular, we will use the following commands to: 

1. check the state of the Apache service,
2. configure the Apache service to auto start on reboot,
3. start the service,
4. reload the service after editing its configuration files, and
5. stop the service.

In order, these work out to:
 
```
systemctl status apache2
sudo systemctl enable apache2
sudo systemctl start apache2
sudo systemctl reload apache2
sudo systemctl stop apache2
```

``systemctl`` is a big piece of software, and
there are other arguments the command will take.
See ``man systemct`` for details.

## Examine Logs

As mentioned, the ``journalctl`` command is
part of the **systemd** software suite, and
it is used to monitor system logs.

It's really important to monitor system logs.
They help identify any problems in the system or
with various services.
For example, by monitoring the log entries for **ssh**,
I can see all the attempts to break into the server.
Or if the Apache2 web server malfunctions for some reason,
which might be because of a configuration error,
the logs will indicated how to identify the problem.

If we type ``journalctl`` at the command prompt,
we are be presented with the logs for the entire system.
These logs can be paged through by pressing the space bar,
the page up/page down keys, or
the up/down arrow keys, and
they can also be searched by pressing the forward slash **/** and
then entering a search keyword.
To exit out of the pager,
press **q** to quit.

```
journalctl
```

It's much more useful to specify the field and
to declare an option when using ``journalctl``.
See the following man pages for details:

```
man systemd.journal-fields
man journalctl
```

There are many fields and options we can use, but
as an example,
we see that there is an option to view the more 
recent entries first (which is not the default):

```
journalctl -r
```

Or we view log entries in reverse order,
for users on the system, and
since the last boot with the following options:

```
journalctl -r --user -b 0
```

Or for the system:

```
journalctl -r --system -b 0
```

I can more specifically look at the
logs files for a service by using the ``-u``
option with ``journalctl``:

```
journalctl -u apache2
```

I can follow the logs in real-time
(press **ctrl-c** to quit the real-time view):

```
journalctl -f
```

## Useful Systemd Commands

You can see more of what ``systemctl`` or ``journalctl``
can do by reading through their documentation:

```
man systemctl
man journalctl
```

You can check if a service if enabled:

```
systemctl is-enabled apache2
```

You can reboot, poweroff, or suspend a system
(suspending a system mostly makes sense for laptops
and not servers):

```
systemctl reboot
systemctl poweroff
systemctl suspend
```

To show configuration file changes to the system:

```
systemd-delta
```

To list real-time control group process, resource usage, and memory usage:

```
systemd-cgtop
```

* to search failed processes/services:

```
systemctl --state failed
```

* to list services

```
systemctl list-unit-files -t service
```

* to examine boot time:

```
systemd-analyze
```

## Conclusion

This is a basic introduction to **systemd**,
which is composed of a suite of software to help
manage booting a system, managing services, and
monitoring logs.

We'll put what we've learned into practice
when we set up our LAMP servers.

[launchd]:https://en.wikipedia.org/wiki/Launchd
[systemd]:https://en.wikipedia.org/wiki/Systemd
[apache2]:https://httpd.apache.org/
