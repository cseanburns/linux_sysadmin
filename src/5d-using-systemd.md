# Using systemd

By the end of the section, you will know how to:

1. Use `systemctl` to manage services on a Linux system, including starting, stopping, enabling, and checking the status of services.
2. Understand the purpose of `systemd` as an init system and its role in booting, service management, and log handling.
3. Check the status and logs of specific services with `journalctl` and use filters to narrow down log results by service, PID, or specific conditions.
4. Set up and manage `systemd` timers to automate tasks, such as scheduling scripts to run at specific times.
5. Explore and utilize additional `systemd` commands, such as checking enabled services, suspending or rebooting the system, and examining boot times with `systemd-analyze`.
6. View and interpret system logs, search through them efficiently, and follow logs in real-time.
7. Create and configure custom `systemd` service and timer files for more tailored system automation.
8. Use `systemd` commands to troubleshoot system issues, including identifying failed services and examining resource usage with `systemd-cgtop`.

## Getting Started

When computers boot up, obviously some software manages that process.
On Linux and other Unix or Unix-like systems, this is usually handled via an **init** system.
For example, macOS uses [launchd][launchd] and many Linux distributions, including Ubuntu, use [systemd][systemd].

**systemd** does more than handle the startup process, it also manages various services and connects the Linux kernel to various applications.
In this section, we'll cover how to use **systemd** to manage services, and to review log files.

## Manage Services

When we install complicated software, like a web server (e.g., Apache2, Nginx), a SSH server (e.g., OpenSSH),
or a database server (e.g., mariaDB or MySQL), then it's helpful to have commands that manage that service:
the web service, the SSH service, the database service, etc.

For example, the ``ssh`` service is installed by default on our gcloud servers, and we can check its status with the following ``systemctl`` command:

```
systemctl status ssh
```

The output tells us a few things.
The line beginning with **Loaded** tells us that the SSH service is configured.
At the end of that line, it also tells us that it is **enabled**.
**Enabled** means that the service automatically starts when the system gets rebooted or starts up.

The line beginning with **Active** tells us that the service is **active (running)** and for how long.
We also can see the process ID (PID) for the service as well as how much memory it's using.

At the bottom of the output, we can see the recent log files.
We can view more of those log files using the ``journalctl`` command.
By default, running ``journalctl`` by itself will return all log files.
We can specify that we're interested in log files only for the ssh service.
We can specify using the PID number.
Replace *N* with the PID number attached to your ssh service:

```
journalctl _PID=N
```

Or we can specify by service, or more specifically, its **unit** name:

```
journalctl -u ssh
```

### Use Cases

Later we'll install the [Apache web server][apache2], and we will use ``systemctl`` to manage some aspects of this service.

In particular, we will use the following commands to: 

1. check the state of the Apache service,
2. enable the Apache service to auto start on reboot,
3. start the service,
4. reload the service after editing its configuration files, and
5. stop the service.

In practice, these work out to:
 
```
systemctl status apache2
sudo systemctl enable apache2
sudo systemctl start apache2
sudo systemctl reload apache2
sudo systemctl stop apache2
```

``systemctl`` is a big piece of software, and there are other arguments the command will take.
See ``man systemctl`` for details.

**NOTE:** Not all services support `systemctl reload [SERVICE]`.
You can check if a service is reloadable by checking its service file.
As an example:

```
grep "ExecReload" /lib/systemd/system/ssh.service
```

You can peruse other services in `/lib/systemd/system`.

## Examine Logs

As mentioned, the ``journalctl`` command is part of the **systemd** software suite, and it is used to monitor system logs.

It's important to monitor system logs.
Log files help identify problems in the system or with various services.
For example, by monitoring the log entries for **ssh**, I can see all the attempts to break into the server.
Or if the Apache2 web server malfunctions for some reason, which might be because of a configuration error,
the logs will indicated how to identify the problem.

If we type ``journalctl`` at the command prompt, we are be presented with the logs for the entire system.
These logs can be paged through by pressing the space bar, the page up/page down keys, or the up/down arrow keys.
They can also be searched by pressing the forward slash **/** and then entering a search keyword.
To exit out of the pager, press **q** to quit.

```
journalctl
```

It's much more useful to specify the field and to declare an option when using ``journalctl``, like above with `ssh`
See the following man pages for details:

```
man systemd.journal-fields
man journalctl
```

There are many fields and options we can use, but as an example, we see that there is an option to view the more recent entries first:

```
journalctl -r
```

Or we view log entries in reverse order, for users on the system, and since the last boot with the following options:

```
journalctl -r --user -b 0
```

Or for the system:

```
journalctl -r --system -b 0
```

I can more specifically look at the logs files for a service by using the ``-u`` option with ``journalctl``:

```
journalctl -u apache2
```

I can follow the logs in real-time (press **ctrl-c** to quit the real-time view):

```
journalctl -f
```

## Timers (Automation)

Linux and Unix operating systems have long provided a way to automate processes.
In the past, and still available on most systems, is the `cron` service, which I do not cover here.
`systemd` also provides a way to automate jobs using timers.

In our `bash` exercises, we created a script to examine the **auth.log** file for invalid IP addresses.
Whenever we want to check to see what IP addresses are trying to login into our system, we have to run that command.

What if we could have that script run at specific times?
For example, what if we wanted to run that script every morning at 8AM and then log the output to a file for us to read?
We can do that with systemd timers.

First, let's modify our `auth.sh` script.
In the example below, I've adjusted the location of the auth.log file, created two additional variables to record
the start and end dates of the auth.log file, and then modified the end `echo` statement to add some additional information and
save the output in a file called **brute.log** in our **/srv/developers** directory.
The `${end_date}` and `${start_date}` variables were created after closely studying the **/var/log/auth.log** file.


```
#!/usr/bin/env bash

#!/usr/bin/env bash

LOG_FILE="/var/log/auth.log"

END_DATE=$(grep -Eo "^[[:alpha:]]{3}[[:space:]]{1,2}[[:digit:]]{1,2}" "${LOG_FILE}" | tail -n1)
START_DATE=$(grep -Eo "^[[:alpha:]]{3}[[:space:]]{1,2}[[:digit:]]{1,2}" "${LOG_FILE}" | head -n1)

TOTAL_INVALID="$(grep -c "Invalid user" ${LOG_FILE})"
INVALID_IPS="$(grep "Invalid user" "${LOG_FILE}" | grep -Eo "[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+" | sort | uniq | wc -l)"

echo "
Log entry created on $(date +%c).
From ${START_DATE} to ${END_DATE}, there were ${TOTAL_INVALID} attempts to login to the system.
These came from ${INVALID_IPS} unique IPs.
" >> "$HOME/brute.log"
```

Next, we need to create two additional files.
First we create a **service** file.
This file defines the **service** that we want to execute.
Navigate to the service directory:

```
cd /etc/systemd/system
```

And use `sudo nano` to create a file called **brute.service**:

```
sudo nano brute.service
```

In the above file, we add the following information under two sections, a Unit section and a Service section.
The Unit section includes a description of the service and a list of the service's requirements.
The Service section declares the type of service, the location of the script to run, and the user to run the script under.
Feel free to use this but be sure to change your User information:

```
[Unit]
Description="Summarize brute login attempts."
Requires=brute.timer

[Service]
Type=simple
ExecStart=/usr/local/bin/auth.sh
User=seanburns
```

See `man 5 systemd.service` for more details.

Next we need to create the **timer** file.
Using `sudo nano`, run the following command in the same directory as above:

```
sudo nano brute.timer
```

In this file, add the following:

```
[Unit]
Description="Timer for the brute login service."

[Timer]
OnCalendar=*-*-* 08:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

See `man 5 systemd.timer` for more details.

Next we need to enable and start the timer.
To do that, we run two separate `systemctl` commands:

```
sudo systemctl daemon-reload
```

And then enable the timer:

```
sudo systemctl enable brute.timer
```

Start the timer:

```
sudo systemctl start brute.timer
```

And finally, check the status of all timers:

```
systemctl list-timers
```

Or check the status of our specific timer:

```
systemctl status brute.timer
```

You can now check that your script ran after the next time your system's clock reaches 8AM.

## Useful Systemd Commands

You can see more of what ``systemctl`` or ``journalctl`` can do by reading through their documentation:

```
man systemctl
man journalctl
```

You can check if a service if enabled:

```
systemctl is-enabled apache2
```

You can reboot, poweroff, or suspend a system (suspending a system mostly makes sense for laptops and not servers):

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

This is a basic introduction to **systemd**, which is composed of a suite of software to help manage booting a system,
managing services, and monitoring logs.

We'll put what we've learned into practice when we set up our LAMP servers.

[launchd]:https://en.wikipedia.org/wiki/Launchd
[systemd]:https://en.wikipedia.org/wiki/Systemd
[apache2]:https://httpd.apache.org/
