# Using systemd

By the end of this section, you will be able to:

1. Explain the role of **systemd** as the init and service-management system on many Linux distributions.
2. Explain what a **systemd unit** is and identify several common unit types.
3. Use `systemctl` to inspect, start, stop, restart, reload, enable, and disable services.
4. Distinguish between a service being **active** and being **enabled**.
5. Use `journalctl` to examine and filter system logs.
6. Use `systemctl` and `journalctl` together to troubleshoot services.
7. Understand how **targets** and dependencies help systemd organize the boot process.
8. Create a simple custom service and timer.
9. Explain how systemd manages timers, mounts, and other system resources in addition to traditional services.
10. Understand how `/etc/fstab` and native systemd mount units relate to one another.

## Getting Started

When a Linux system boots, something has to start the operating system's userspace and then start the programs necessary for the computer to operate.
Traditionally, Unix and Linux systems have used an **init system** for this purpose (mostly a collection of shell scripts).
Many contemporary Linux distributions, including Ubuntu, Debian, Fedora, Red Hat Enterprise Linux, Arch Linux, and others, use [systemd][systemd].
Other operating systems use different approaches.
For example, macOS uses [launchd][launchd_wiki].

On a system using systemd, the first userspace process normally has process ID **1**, indicating its importance in the process hierarchy.

We can check:

```
ps -p 1 -o pid,comm,args
```

You should see something similar to:

```
PID COMMAND         COMMAND
  1 systemd         /sbin/init
```

We can also simply run:

```
ps -p 1 -o comm=
```

On our Droplets, the result should be:

```
systemd
```

This is important because systemd is not simply another program running on the server.
It is responsible for coordinating much of what happens after the Linux kernel starts.

## systemd Does More Than Start Services

It is tempting to describe systemd as a program for starting and stopping services.
It does that, but its responsibilities are broader.
Among other things, systemd can manage:

- services,
- system startup and shutdown,
- dependencies among system resources,
- logging,
- scheduled tasks,
- mounted filesystems,
- automounts,
- sockets,
- devices,
- resource control,
- and groups of services representing particular system states.

This is why the name **systemd** appears in so many Linux commands and files.

For example:

```
systemctl
journalctl
systemd-analyze
systemd-cgtop
systemd.service
systemd.timer
systemd.mount
systemd.target
```

Instead of thinking of systemd simply as a service manager, it is more useful to begin with the concept of a **unit**.

## Units

A **unit** is a resource that systemd knows how to manage.
Different kinds of resources use different kinds of units.
Unit files normally have names ending in a suffix indicating their type.

Some common examples include:

| Unit type    | Purpose                                                 |
| ---          | ---                                                     |
| `.service`   | Runs and manages a service or process                   |
| `.timer`     | Activates another unit according to a schedule          |
| `.mount`     | Represents a mounted filesystem                         |
| `.automount` | Mounts a filesystem when it is accessed                 |
| `.socket`    | Represents a socket that can activate a service         |
| `.path`      | Watches a filesystem path and can activate another unit |
| `.target`    | Groups other units together                             |
| `.device`    | Represents a device known to the kernel                 |

For example, the SSH server may be represented by:

```
ssh.service
```

A scheduled task might use:

```
report.timer
```

and:

```
report.service
```

A filesystem mounted at:

```
/mnt/data
```

could appear to systemd as:

```
mnt-data.mount
```

This provides a more useful way to think about systemd:

```
                   systemd
                      |
        +-------------+-------------+
        |             |             |
     services       timers        mounts
        |             |             |
    ssh.service   report.timer  mnt-data.mount
        |
      ...
```

In short, systemd manages many kinds of system resources based on a common framework.

### Exploring Units

We interact with systemd using the following command:

```
systemctl
```

To list currently loaded units:

```
systemctl list-units
```

That produces a lot of information.
We can restrict the output to services:

```
systemctl list-units --type=service
```

Or mount units:

```
systemctl list-units --type=mount
```

Or timers:

```
systemctl list-units --type=timer
```

You can also use:

```
systemctl list-timers
```

for a timer-specific view.

There is an important distinction between:

```
systemctl list-units
```

and:

```
systemctl list-unit-files
```

The first primarily tells us about units systemd currently has loaded.
The second tells us about unit files installed on the system.

For example:

```
systemctl list-unit-files --type=service
```

normally produces a considerably different list than:

```
systemctl list-units --type=service
```

### Managing Services

One of the most common uses of systemd is managing server software.

Examples include SSH, web servers, and database servers:

- OpenSSH
- Apache
- Nginx
- MariaDB
- PostgreSQL

Our Droplet already runs an SSH server.

We can examine it with:

```
systemctl status ssh
```

On Ubuntu, the service is normally named:

```
ssh.service
```

Systemd allows us to omit `.service` in many commands, so the following two generally mean the same thing:

```
systemctl status ssh
```

```
systemctl status ssh.service
```

The output contains several useful pieces of information.
For example, look for:

```
Loaded:
Active:
Main PID:
```

The `Active` line tells us whether the service is currently running.

For example:

```
Active: active (running)
```

The status output may also include:

- when the service started,
- the main process ID,
- tasks associated with the service,
- memory use,
- CPU use,
- and recent journal (log) entries.

### Starting and Stopping Services

We can stop a service:

```
sudo systemctl stop ssh
```

**But do not do this while connected remotely unless you understand the consequences.**

If we stop the SSH server, we may lose our connection to the Droplet.

A safer service for practice later in the semester will be Apache.

For Apache, we might use:

```
sudo systemctl stop apache2
```

and:

```
sudo systemctl start apache2
```

We can restart it:

```
sudo systemctl restart apache2
```

Or, if the service supports it, reload its configuration:

```
sudo systemctl reload apache2
```

These operations are not identical.

- A **restart** stops and starts the service.
- A **reload** asks a running service to reread its configuration without completely stopping.

Note that not every service supports reloading.

We can check the unit definition itself rather than searching for a file manually:

```
systemctl cat apache2.service
```

Later, when Apache is installed, look for an `ExecReload=` directive.

I find `systemctl cat ...` as particularly useful because unit configuration do not necessarily live in one predictable file.

### Active Is Not the Same as Enabled

This distinction causes a lot of confusion.
A service can be **active** without being **enabled** and vice versa.
**Active** describes what is happening **right now**.
**Enabled** describes whether the unit has been configured to be activated automatically through systemd's dependency structure, commonly during boot.

We can ask whether a service is currently active:

```
systemctl is-active ssh
```

And whether it is enabled:

```
systemctl is-enabled ssh
```

Think of these as two separate questions:

```
Is it running now?             → active
Should it normally start?      → enabled
```

For example:

```
sudo systemctl start apache2
```

starts Apache now but does not necessarily enable it for future boots.

Likewise:

```
sudo systemctl enable apache2
```

configures it to start through the appropriate dependency relationships but does not necessarily start it immediately.

A convenient command combines the two:

```
sudo systemctl enable --now apache2
```

Likewise, we can stop and disable it with:

```
sudo systemctl disable --now apache2
```

This `--now` option is useful because it makes explicit that:

```
enable ≠ start
```

and:

```
disable ≠ stop
```

### What Does Enabling Actually Do?

The word **enable** can make systemd sound more mysterious than it is.
In many cases, enabling a service creates symbolic links representing dependencies among units.
We can inspect what would happen without actually changing anything:

```
systemctl enable --dry-run apache2
```

We can also examine the service:

```
systemctl cat apache2
```

Near the end of many service files we will find an `[Install]` section such as:

```
[Install]
WantedBy=multi-user.target
```

This tells systemd where the unit should be linked when it is enabled.
Thus enabling is largely about establishing relationships among units.

## Unit Files

System unit files can come from several locations.
Common locations include:

```
/usr/lib/systemd/system/
/etc/systemd/system/
/run/systemd/system/
```

Depending on the distribution, `/lib/systemd/system/` may also appear or may be related to `/usr/lib/systemd/system/`.
As a general rule:

```
/usr/lib/systemd/system/
```

contains unit files supplied by installed software packages, while:

```
/etc/systemd/system/
```

is the important location for administrator-created configuration and overrides.

Rather than guessing where a unit file lives, use:

```
systemctl cat ssh.service
```

or:

```
systemctl show ssh.service
```

To see the path systemd loaded:

```
systemctl show -p FragmentPath ssh.service
```

For example:

```
systemctl show -p FragmentPath ssh
```

might return something like:

```
FragmentPath=/usr/lib/systemd/system/ssh.service
```

### Don't Usually Edit Vendor Unit Files Directly

Suppose we want to modify the configuration of an installed service.
It is generally better not to edit its package-supplied unit file directly.
A package upgrade could replace our changes.
Instead, systemd supports **drop-in configuration**.

For example:

```
sudo systemctl edit ssh.service
```

This creates an administrator override beneath:

```
/etc/systemd/system/ssh.service.d/
```

We can then see the complete effective configuration using:

```
systemctl cat ssh.service
```

This pattern reflects a common Linux configuration principle:

```
vendor defaults
       +
local administrator overrides
       =
effective configuration
```

### Reloading systemd Configuration

Suppose we create or modify a unit file.
Systemd does not necessarily reread every configuration file immediately.
After adding or modifying unit files, we commonly run:

```
sudo systemctl daemon-reload
```

This tells the system manager to reload unit configuration.
Notice that:

```
daemon-reload
```

does **not** mean "restart all daemons."

It means:

> Reload systemd's own unit configuration.

If we edit Apache's application configuration, for example, that is a different matter from editing:

```
apache2.service
```

The distinction is important.

## Targets

Older Unix and Linux init systems commonly used **runlevels** to represent different operating states.
Systemd instead uses **targets**.
A target primarily groups other units together and establishes dependencies.
We can see the default target with:

```
systemctl get-default
```

On a server, we may see:

```
multi-user.target
```

On a graphical workstation, we may instead see:

```
graphical.target
```

Targets themselves can depend on other targets and services.

For example:

```
graphical.target
        |
        +-- multi-user.target
                |
                +-- networking
                +-- SSH
                +-- various system services
```

This is an oversimplification, but it illustrates the idea.

One issue with the prior runlevel method was that the boot process was sequential and thus slow:

```
A → B → C → D → E
```

Instead, systemd describes dependencies among many units and can start independent units in parallel.
This makes for quicker boot times.
We can examine dependencies:

```
systemctl list-dependencies multi-user.target
```

Try:

```
systemctl list-dependencies ssh.service
```

We can also look in the opposite direction:

```
systemctl list-dependencies --reverse ssh.service
```

## The Journal

Systemd also includes a logging system called the **journal**.
The service responsible for collecting journal data is:

```
systemd-journald
```

We examine journal data using:

```
journalctl
```

This command displays journal entries available to the current user.
Depending on permissions, an ordinary user may not be able to read every system log entry.
Thus, using the following provides access to the system journal.

```
sudo journalctl
```

The output is normally presented using a pager.
Useful pager controls include:

```
Space        next page
↑ / ↓        move
/            search
n            next search result
q            quit
```

### Filtering Journal Entries

Dumping every available log entry is usually not very useful.
The power of `journalctl` comes from filtering.

#### Current Boot

To display messages from the current boot:

```
journalctl -b
```

To show the previous boot:

```
journalctl -b -1
```

List recorded boots:

```
journalctl --list-boots
```

This can be extremely useful when diagnosing a problem that occurred during a previous startup.

#### A Specific Unit

For SSH:

```
journalctl -u ssh
```

For Apache:

```
journalctl -u apache2
```

Current boot only:

```
journalctl -b -u ssh
```

#### Recent Entries

Show the most recent messages first:

```
journalctl -r
```

Or just the last 20 entries:

```
journalctl -n 20
```

For a particular unit:

```
journalctl -u ssh -n 20
```

#### Follow Logs in Real Time

Use:

```
journalctl -f
```

This behaves somewhat like:

```
tail -f
```

New entries appear as they are written.

Press **Ctrl-C** to stop following them.

For one service:

```
journalctl -f -u ssh
```

#### Filter by Time

We can ask for entries since a particular time:

```
journalctl --since today
```

Or:

```
journalctl --since "1 hour ago"
```

Or between two times:

```
journalctl --since "2026-10-06 14:00" --until "2026-10-06 15:00"
```

This becomes particularly useful when someone tells you:

> The server stopped working around 2:30 PM.

Rather than reading thousands of lines, examine that time period.

#### Filter by Priority

Journal messages have priorities.

For example:

```
journalctl -p warning
```

shows messages at warning priority or more severe.

For the current boot:

```
journalctl -b -p warning
```

This can be a useful first troubleshooting step.

#### Service Status and Logs Work Together

Suppose Apache is not working.
A useful troubleshooting workflow might begin with:

```
systemctl status apache2
```

Then:

```
journalctl -u apache2 -b
```

Perhaps:

```
journalctl -u apache2 -b -n 50
```

This illustrates a general workflow:

```
Something is broken
        ↓
systemctl status
        ↓
inspect journal
        ↓
inspect configuration
        ↓
correct problem
        ↓
restart/reload
        ↓
check status again
```

Knowing commands is useful.
Knowing **which question to ask next** is more important.

#### Failed Units

Systemd can show us units that have failed:

```
systemctl --failed
```

or:

```
systemctl --state=failed
```

If we correct the underlying problem, restart the unit:

```
sudo systemctl restart SERVICE
```

Sometimes we may also want to clear systemd's recorded failed state:

```
sudo systemctl reset-failed SERVICE
```

Again, `reset-failed` does not fix the problem.
It merely clears the recorded failure after we have addressed the actual cause.

## Timers

Unix systems have traditionally used **cron** to schedule recurring tasks.
Cron remains widely used and is not made obsolete merely because systemd provides another scheduling mechanism.
But systemd provides **timer units** as an alternative.

A timer normally activates another unit, usually a `.service` unit, at a particular time or interval.

Conceptually:

```
report.timer
      |
      | activates
      v
report.service
      |
      | executes
      v
/usr/local/bin/report
```

This illustrates the systemd unit model nicely:

> A timer does not need to contain the work itself.
> It defines **when** another unit should be activated.

### Creating a Simple Timer

Let's make a small example that will also prepare us for the next section on storage.
Suppose we want the server to record filesystem usage once per day.

Create a script:

```
sudo nano /usr/local/bin/disk-report
```

Add:

```
#!/usr/bin/env bash

{
    echo "Disk report: $(date)"
    df -hT
    echo
} >> /var/log/disk-report.log
```

Save it and make it executable:

```
sudo chmod 755 /usr/local/bin/disk-report
```

Test it manually:

```
sudo /usr/local/bin/disk-report
```

Then examine:

```
cat /var/log/disk-report.log
```

Before automating something, it is generally wise to make sure the underlying command works manually.

### Creating the Service Unit

Create:

```
sudo nano /etc/systemd/system/disk-report.service
```

Add:

```
[Unit]
Description=Record filesystem usage

[Service]
Type=oneshot
ExecStart=/usr/local/bin/disk-report
```

This is a **oneshot** service.
Unlike a web server or SSH server, the script does not remain running.

It:

```
starts
  ↓
performs one job
  ↓
exits
```

That is exactly what `Type=oneshot` represents.

Now tell systemd about the new unit:

```
sudo systemctl daemon-reload
```

We can test the service without waiting for a timer:

```
sudo systemctl start disk-report.service
```

Then:

```
systemctl status disk-report.service
```

Do not be surprised if the service is not shown as:

```
active (running)
```

It already completed its job and exited.

Check its journal:

```
journalctl -u disk-report.service
```

And check the output:

```
cat /var/log/disk-report.log
```

### Creating the Timer Unit

Now create:

```
sudo nano /etc/systemd/system/disk-report.timer
```

Add:

```
[Unit]
Description=Run disk report each morning

[Timer]
OnCalendar=*-*-* 08:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

The important line is:

```
OnCalendar=*-*-* 08:00:00
```

This means every day at 8:00 AM.
We can ask systemd to interpret calendar expressions for us:

```
systemd-analyze calendar '*-*-* 08:00:00'
```

This is extremely useful when constructing a timer because it shows what systemd thinks the expression means and when it will next occur.

We could also use convenient expressions such as:

```
systemd-analyze calendar daily
```

or:

```
systemd-analyze calendar weekly
```

### Persistent Timers

Our timer also contains:

```
Persistent=true
```

Suppose the server is powered off at 8:00 AM.
Without persistence, that occurrence would simply be missed.
With `Persistent=true`, systemd records the timer's previous activation and can trigger an overdue calendar event after the system becomes available again.
This is useful for tasks where:

> sometime after 8:00 AM is better than not at all.

### Enable and Start the Timer

After creating the timer:

```
sudo systemctl daemon-reload
```

Then we can enable and start it in one command:

```
sudo systemctl enable --now disk-report.timer
```

Check it:

```
systemctl status disk-report.timer
```

And list timers:

```
systemctl list-timers
```

The output includes useful information such as:

- when the timer will next activate,
- when it last activated,
- and which service it triggers.

Notice that we enable the **timer**, not the `disk-report.service`.

The timer is what needs to remain scheduled.

### Relative Timers

Not every timer needs to use a calendar date.

Systemd timers can also describe intervals relative to events.

For example:

```
[Timer]
OnBootSec=10min
OnUnitActiveSec=1h
```

This could mean:

- first activate 10 minutes after boot,
- then activate again one hour after the unit's previous activation.

This is conceptually different from:

```
OnCalendar=hourly
```

One describes an interval relative to activity.
The other describes a position on the calendar.

### Timer Accuracy and Randomization

Systemd timers are not necessarily designed to run at an exact microsecond.
For many administrative tasks, exact timing does not matter.
If thousands of servers are all configured to perform the same task at precisely midnight, having every one of them start simultaneously may be undesirable.
Systemd therefore provides controls such as:

```
AccuracySec=
```

and:

```
RandomizedDelaySec=
```

These serve different purposes.

- `AccuracySec=` provides an allowed accuracy window in which systemd can coalesce timer wakeups.
- `RandomizedDelaySec=` intentionally adds a randomized delay.

For example:

```
[Timer]
OnCalendar=daily
RandomizedDelaySec=30min
```

can distribute a task over a period rather than causing many systems to perform it simultaneously.

For our small class servers, we normally do not need this, but it illustrates that timers were designed for managing real systems at scale.

## Other Unit Types

Services and timers are only two kinds of units.
Let's look briefly at several others.

### Socket Units

A `.socket` unit can listen for incoming communication and activate a corresponding service when needed.

Conceptually:

```
request arrives
      ↓
example.socket
      ↓
activates
      ↓
example.service
```

This is called **socket activation**.
A service therefore does not necessarily need to be running continuously merely because something might eventually connect to it.

List socket units:

```
systemctl list-units --type=socket
```

### Path Units

A `.path` unit can watch for filesystem events and activate another unit.
For example, a task could run when:

- a file appears,
- a directory changes,
- or a path is modified.

List them:

```
systemctl list-units --type=path
```

### Device Units

Systemd also represents kernel devices as units.

Try:

```
systemctl list-units --type=device
```

These may look less familiar than services, but the principle is the same:

> systemd represents resources as units so that dependencies can be expressed between them.

## Boot Performance

Systemd records timing information about the boot process.
We can see the overall boot time with:

```
systemd-analyze
```

A more detailed report is:

```
systemd-analyze blame
```

This lists units according to how long their startup took.
However, be careful interpreting this output.
A unit taking ten seconds to initialize does not necessarily mean it delayed the entire boot by ten seconds because many units can start concurrently.
For dependency-aware analysis, try:

```
systemd-analyze critical-chain
```

This attempts to show the time-critical chain of units involved in reaching the system's boot target.
The distinction illustrates why simply sorting service startup times does not completely explain boot performance.

## Resource Management

Systemd also organizes processes using Linux **control groups**, or cgroups.
We can see resource use grouped according to systemd's hierarchy using:

```
systemd-cgtop
```

This provides a changing display somewhat analogous to the `top` command but organized by control groups.

Services started by systemd are therefore not merely processes that systemd happened to launch.
Systemd can also track and manage them as groups of related processes.

## Useful systemd Commands

Here are some commands worth remembering.

Inspect a unit:

```
systemctl status UNIT
```

Display its unit configuration:

```
systemctl cat UNIT
```

Display systemd properties:

```
systemctl show UNIT
```

Check whether it is running:

```
systemctl is-active UNIT
```

Check whether it is enabled:

```
systemctl is-enabled UNIT
```

Start it:

```
sudo systemctl start UNIT
```

Stop it:

```
sudo systemctl stop UNIT
```

Restart it:

```
sudo systemctl restart UNIT
```

Reload its application configuration if supported:

```
sudo systemctl reload UNIT
```

Enable it:

```
sudo systemctl enable UNIT
```

Enable and start it:

```
sudo systemctl enable --now UNIT
```

Disable and stop it:

```
sudo systemctl disable --now UNIT
```

Reload systemd's unit configuration:

```
sudo systemctl daemon-reload
```

List failed units:

```
systemctl --failed
```

Clear a recorded failure:

```
sudo systemctl reset-failed UNIT
```

List services:

```
systemctl list-units --type=service
```

List mount units:

```
systemctl list-units --type=mount
```

List timers:

```
systemctl list-timers
```

Examine unit dependencies:

```
systemctl list-dependencies UNIT
```

Examine logs for a unit:

```
journalctl -u UNIT
```

Examine its logs from the current boot:

```
journalctl -b -u UNIT
```

Follow its logs:

```
journalctl -f -u UNIT
```

Check boot time:

```
systemd-analyze
```

Examine the boot's critical path:

```
systemd-analyze critical-chain
```

## Reading the Documentation

Systemd is a large software suite.
Nobody should attempt to memorize all of its commands and configuration directives.
Use the manual.
Some particularly useful manual pages include:

```
man systemctl
man journalctl
man systemd.unit
man systemd.service
man systemd.timer
man systemd.mount
man systemd.target
```

Notice the manual section numbers when you encounter references such as:

```
systemd.service(5)
```

or:

```
systemctl(1)
```

These identify both the manual page and its section.

## Conclusion

Systemd began as an **init system**, but describing it only as an init system understates its role on contemporary Linux systems.
Its central abstraction is the **unit**.
Units allow systemd to represent and establish relationships among resources such as:

```
services
timers
mounts
automounts
sockets
paths
devices
targets
```

To examine and manage units and, we used:

```
systemctl
```

To examine logs associated with the system and its services, we used.

```
journalctl
```

We also saw an important distinction:

```
active  = what is happening now
enabled = activation configured through systemd dependencies
```

And we learned that:

```
start ≠ enable
stop  ≠ disable
```

We created a timer that activated a oneshot service:

```
disk-report.timer
        |
        v
disk-report.service
        |
        v
/usr/local/bin/disk-report
```

In the next section, we will add additional storage to our virtual machine.
When we ask DigitalOcean to automatically format and mount that storage, we will discover that DigitalOcean creates systemd configuration on our behalf.
That will give us an opportunity to investigate a practical example of the concepts introduced here rather than treating the cloud interface as a black box.

[systemd]:https://systemd.io/
[launchd_wiki]:https://en.wikipedia.org/wiki/Launchd
