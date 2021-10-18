## systemd

* **systemd** is an init system that aims to provide better boot time and a better way to manage services and processes.
* **systemd** is a replacement of the **System V like init** system that most Linux distributions used.
* **systemd** includes additional utilities to help manage services on a Linux system; essentially, it's much more than an init system

There are only two basic aspects of **systemd** that I want to cover in this lesson, but know that **systemd** is a big, complicated suite of software that provides a lot of functions. In this lesson, though, we will cover using **systemd** to:

1. manage services
1. examine logs

### Manage Services

When we install a complicated piece of software like a web server (e.g., Apache2), a SSH server (e.g., openssh-server), or a database server (e.g., MySQL), then it's helpful if we have some commands that will help us manage that service (the web service/server, the SSH service/server, etc).

For example, after installing a SSH server, we might like to know if it's running, or we might want to stop it if it's running, or start it if it's not. Let's see what that looks like. In the following commands, I will use the ``dnf`` utility to install the ``openssh-server``. Then I will check the status of the server using the ``systemctl status`` command. I will enable it so that it starts automatically when the operating system is rebooted using the ``systemctl enable`` command. Finally, I will make sure the firewall allows outside access to the operating system via ``ssh``. I use the ``sudo`` command to run the relevant commands as administrator:

```
dnf search openssh
sudo dnf install openssh-server
systemctl status sshd.service
sudo systemctl enable sshd.service
sudo firewall-cmd --add-service=ssh --permanent
```

There are similar commands to stop a service or to reload a service if a service configuration file has changed. As an example of the latter, let's say that I wanted to present a message to anyone who logs into my system remotely using ``ssh``. In order to do that, I need to edit the main ``ssh`` configuration file, which is located in **/etc/ssh/sshd_config**:

```
cd /etc/ssh
sudo nano sshd_config
```

Then I will remove the beginning pound sign and thus un-comment the following line:

```
#Banner none
```

And replace it with a path a file that will contain my message:

```
Banner /etc/ssh/ssh-banner
```

After saving and closing **/etc/ssh/sshd_config**, I will create and open the banner file using ``nano``:

```
sudo nano /etc/ssh/ssh-banner
```

And add the following:

```
Unauthorized access to this system is not permitted and will be reported to the authorities.
```

Since we have changed a configuration for the ``sshd.service``, we need to reload the service so that ``sshd.service`` becomes aware of the new configuration. To do that, I use ``systemctl`` like so:

```
sudo systemctl reload sshd.service
```

Now, when you log into your Fedora system, you will see that new banner displayed.

### Examine Logs

The ``journalctl`` command is also part of the **systemd** software suite and is used to monitor logs on the system.

If we just type ``journalctl`` at the command prompt, we will be presented with the logs for the entire system. These logs can be paged through by pressing the space bar, the page up/page down keys, or the up/down arrow keys, and they can also be searched by pressing the forward slash ``/``.

```
journalctl
```

However, it's much better to use various options. If you ``tab tab`` after typing ``journalctl``, command line completion will provide additional fields (see man page: ``man 7 systemd.journal-fields`` and see ``man man`` for numbering options) to examine logs for. There are many, but as an example, we see that there is an option called \_UID=, which allows us to examine the logs for a user with a specific user id. For example, on our independent Fedora systems, our user ID numbers are 1000. So that means I can see the logs for my account by:

```
journalctl _UID=1000
```

The above shows journal entries related to user ID of 1000, which is my user id. We can see other user IDs by concatenating (``cat``) the **passwd** file. Not only do real humans who have accounts on the system have user IDs, but many services do to. Here I look at journal entries for ``chronyd``, with a user ID of 992. This is a service that manages the system's time:

```bash
cat /etc/passwd
journalctl _UID=984
```

I can more specifically look at the logs files for a service by using the ``-u`` option with ``journalctl``:

```
journalctl -u sshd.service
```

I can examine logs since last boot:

```
journalctl -b
```

Or I can follow the logs in real-time (press **ctrl-c** to quit the real-time view):

```
journalctl -f
```

### Useful Systemd Commands

You can see more of what ``systemctl`` or ``journalctl`` can do by reading through their documentation:

```
man systemctl
man journalctl
```

You can get the status, start, stop, reload, restart a servicer; e.g., sshd:

```
systemctl status sshd.service
systemctl start sshd.service
systemctl stop sshd.service
systemctl reload sshd.service
systemctl restart sshd.service
systemctl reload-or-restart sshd.service
```

To enable, disable sshd (or some service):

```
systemctl enable sshd.service
systemctl disable sshd.service
```

You can check if a service if enabled:

```
systemctl is-enabled sshd.service
```

You can reboot, poweroff, or suspend a system:

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
