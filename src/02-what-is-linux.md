# What is Linux?

## The Linux Kernel

Technically, [Linux is a kernel][linuxKernel], and
a kernel is a part of an operating system that
oversees CPU activity like multitasking, as well as networking,
memory management, device management, file systems, and more.
The kernel alone does not make an operating system.
It needs user land applications and programs,
the kind we use on a daily basis, to form a whole,
as well as ways for these user land utilities to
interact with the kernel.

## Linux and GNU

The earliest versions of the Linux kernel were combined
with tools, utilities, and programs from the [GNU project][gnu]
to form a complete operating system,
without necessarily a graphical user interface.
This association continues to this day.
Additional non-GNU, but
free and open source programs under different licenses,
have been added to form a more functional and user friendly system.
However, since the Linux kernel needs user land applications
to form an operating system, and
since user land applications from GNU cannot work without a kernel,
some argue that the operating system
should be called [GNU/Linux][gnulinux]
and not just Linux.
This has not gained wide acceptance, though.
Regardless, credit is due to both camps for their contribution,
as well as many others who have made substantial contributions
to the operating system.

## Linux Uses

We are using Linux as a server in this course, which
means we will use Linux to provide various services.
Our first focus is to learn to use Linux itself, but
by the end of the course,
we will also learn how to provide web and database services.
Linux can be used to provide [other services][servers] that
we won't cover in this course, such as:

- file servers
- mail servers
- print servers
- game servers
- computing servers

Although it's a small overall percentage,
many people use Linux as their main
desktop/laptop operating system.
I belong in this camp.
Linux has been my main OS since the early 2000s.
While our work on the Linux server means that we will
almost entirely work on the command line,
this does not mean that my Linux
desktop environment is all command line.
In fact, there are many graphical user environments,
often called [desktop environments][desktopenvironment],
available to Linux users.
Since I'm currently using the Ubuntu Desktop distribution,
my default desktop environment is called [Gnome][gnome].
[KDE][kde] is another popular desktop environment, but
there are many other attractive and useful ones.
And it's easy to install and switch between
multiple ones on the same OS.

Linux has become quite a pervasive operating system.
Linux powers the hundreds of the
fastest supercomputers in the world.
It, or other Unix-like operating systems,
are the foundation of most web servers.
The Linux kernel also forms the basis of the Android
operating system and of Chrome OS.
The only place where Linux does not dominate is
in the desktop/laptop space.

[linuxKernel]:https://kernel.org/
[gnu]:https://www.gnu.org/software/software.html
[gnulinux]:https://en.wikipedia.org/wiki/GNU/Linux_naming_controversy
[servers]:https://en.wikipedia.org/wiki/Server_(computing)
[desktopenvironment]:https://en.wikipedia.org/wiki/Desktop_environment
[gnome]:https://www.gnome.org/
[kde]:https://kde.org/
