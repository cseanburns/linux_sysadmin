## Local Security: ``chroot`` example

``chroot`` is a technology that can be used to change the *apparent* root ``/``
directory for a user or a process. A user or process that is confined to the
``chroot`` cannot see or access the rest of the file system and will have
limited access to the binaries (executables/apps/utilities) on the system. From
its ``man`` page:

```
chroot (8) - run command or interactive shell with special root directory
```

This has some useful use cases for security, although it is not entirely safe
from tampering. I've read that some people have used ``chroot`` for DNS
servers, for example.

``chroot`` is also the conceptual basis for some kinds of virtualization
technologies that are common today. In this sense, it's been used to control
and provide a stable developmental environment, and companies like [Docker][docker] have built some of their services on technologies like ``chroot``.

[docker]:https://en.wikipedia.org/wiki/Docker_(software)

### chroot a current user

In this tutorial, we are going to create a ``chroot`` for a human user account.

**Step 1**: Let's create a user first. After we create the new user, we need to ``chroot`` that user going forward.

```
sudo su
useradd -m -U -s /usr/bin/bash omicron
passwd omicron
```

**Step 2**: We'll ``chroot`` *omicron* in a new directory  at ``/var/chroot``. Note that the root directory for our regular users is ``/``. User *omicron*'s root directory will be different ``/var/chroot``, even if they can't tell.

```
mkdir /var/chroot
```

**Step 3**: Set up available binaries for the user. We'll only allow ``bash``
for now.  To do that, we'll create a ``bin/`` directory, and copy bash to that
directory.

```
mkdir /var/chroot/bin
which bash
/usr/bin/bash
cp /usr/bin/bash /var/chroot/bin/
```

**Step 4**: Copy the libraries for the bash binary.

```
# Identify libraries needed by Bash
ldd /usr/bin/bash
# comment: name the library directory after lib64 since these are all lib64 libraries
mkdir /var/chroot/lib64
cp /lib64/libtinfo.so.6 /var/chroot/lib64/
cp /lib64/libdl.so.2 /var/chroot/lib64/
cp /lib64/libc.so.6 /var/chroot/lib64/
cp /lib64/ld-linux-x86-64.so.2 /var/chroot/lib64/
```

**Step 5**: Create and test the ``chroot``

```
chroot /var/chroot/
bash-5.0# ls
bash: ls: command not found
bash-5.0# help
bash-5.0# dirs
bash-5.0# cd bin/
bash-5.0# dirs
bash-5.0# cd ../lib64/
bash-5.0# dirs
bash-5.0# cd ..
bash-5.0# exit
```

**Step 6**: Create a new group called *chrootjail*. We can add users to this
group that we want to jail. Instructions are based on
[linuxconfig.org][chrootjail].

```
groupadd chrootjail
usermod -a -G chrootjail omicron
groups omicron
```

**Step 7**: Edit ``/etc/ssh/sshd_config`` to direct users in the ``chrootjail``
group to the ``chroot`` directory. Add the following line at the end of the file. Then restart ssh server.

```
# nano /etc/ssh/sshd_config
Match group chrootjail
            ChrootDirectory /var/chroot/
```

Exit ``nano``, and restart ``ssh``:

```
systemctl restart sshd
```

The logout of the server altogether:

```
exit
```

**Step 8**: Test ``ssh``.

Connect to the Fedora server via ``ssh`` as the user *omicron*:

```
ssh omicron@relevant_ip_address
-bash-5.0$ ls
-bash: ls: command not found
exit
```

That works as expected. The user *omicron* is now restricted to a special
directory and has limited access to the system or to any utilities on that
system.

### Exercise

By using the ``ldd`` command, you can add additional binaries for this user. As
an exercise, use the ``ldd`` command to locate the libraries for the ``nano``
editor, and make ``nano`` available to the user *omicron* in the chrooted
directory.

#### Nano in chroot

After making Bash available in ``chroot``:

(Side note: I'm using the **#** sign below to indicate the root prompt.)

```
# which nano
/usr/bin/nano
# cp /usr/bin/nano /var/chroot/bin/
# ldd /usr/bin/nano
linux-vdso.so.1 (0x00007fff5bdd5000)
  libmagic.so.1 => /lib64/libmagic.so.1 (0x00007f0ce11a7000)
  libncursesw.so.6 => /lib64/libncursesw.so.6 (0x00007f0ce1167000)
  libtinfo.so.6 => /lib64/libtinfo.so.6 (0x00007f0ce1138000)
  libc.so.6 => /lib64/libc.so.6 (0x00007f0ce0f6e000)
  libz.so.1 => /lib64/libz.so.1 (0x00007f0ce0f54000)
  libdl.so.2 => /lib64/libdl.so.2 (0x00007f0ce0f4d000)
  /lib64/ld-linux-x86-64.so.2 (0x00007f0ce1232000)
# cp /lib64/libmagic.so.1 /var/chroot/lib64/
# cp /lib64/libncursesw.so.6 /var/chroot/lib64/
# cp /lib64/libtinfo.so.6 /var/chroot/lib64/
# cp /lib64/libc.so.6 /var/chroot/lib64/
# cp /lib64/libz.so.1 /var/chroot/lib64/
# cp /lib64/libdl.so.2 /var/chroot/lib64/
# cp /lib64/ld-linux-x86-64.so.2 /var/chroot/lib64/
# chroot /var/chroot/
bash-5.0# nano
Error opening terminal: xterm-256color.
bash-5.0# exit
```

To fix this, install ``ncurses-term`` and copy over additional files:

```
# dnf install -y ncurses-term
# locate xterm-256color
/usr/share/terminfo/s/screen.xterm-256color
/usr/share/terminfo/x/xterm-256color
# mkdir -p /var/chroot/etc/terminfo/x/
# cp /usr/share/terminfo/x/* /var/chroot/etc/terminfo/x/
# chroot /var/chroot
# nano
```

[firewall_cmd]:https://docs.fedoraproject.org/en-US/Fedora/19/html/Security_Guide/sect-Security_Guide-Using_Firewalls.html
[iptables-examples]:http://www.tecmint.com/linux-iptables-firewall-rules-examples-commands/
[iptables-beginners]:https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/
