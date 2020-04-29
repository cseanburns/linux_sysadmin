# Local Security: ``chroot`` example

## ``chroot`` a current user

**Step 1**: Let's create a user first. We're imagining that we have a
preexisting user and that we need to ``chroot`` that user going forward.

```
$ sudo su
# useradd -m -U -s /bin/bash omicron
# passwd omicron
```

**Step 2**: We'll ``chroot`` *omicron* in a new directory ``/var/chroot``.

```
# mkdir /var/chroot
```

**Step 3**: Set up available binaries for the user. We'll only allow ``bash``
for now.  To do that, we'll create a ``bin/`` directory, and copy bash to that
directory.

```
# mkdir /var/chroot/bin
# which bash
/usr/bin/bash
# cp /usr/bin/bash /var/chroot/bin/
```

**Step 4**: Copy the libraries for the bash binary.

```
# ldd /usr/bin/bash
## comment: because we see that these are all lib64
# mkdir /var/chroot/lib64       
# cp /lib64/libtinfo.so.6 lib64/
# cp /lib64/libdl.so.2 lib64/
# cp /lib64/libc.so.6 lib64/
# cp /lib64/ld-linux-x86-64.so.2 lib64/
```

**Step 5**: Create and test the ``chroot``

```
# chroot /var/chroot/
bash-4.4# ls
bash: ls: command not found
bash-4.4# help
bash-4.4# dirs
bash-4.4# cd bin/
bash-4.4# dirs
bash-4.4# cd ../lib64/
bash-4.4# dirs
bash-4.4# cd ..
bash-4.4# exit
```

**Step 6**: Create a new group called *chrootjail*. We can add users to this
group that we want to jail. Instructions are based on [linuxconfig.org][1].

```
# groupadd chrootjail
# usermod -a -G chrootjail omicron
# groups omicron
```

**Step 7**: Edit ``/etc/ssh/sshd_config`` to direct users in ``chrootjail``
group to ``chroot`` directory. Add the following line at the end of the file.
Then restart ssh server.

```
# nano /etc/ssh/sshd_config
Match group chrootjail
            ChrootDirectory /var/chroot/
```

Exit ``nano``.


**Step 8**: Test ``ssh``.

Before restarting ssh, let's log out of the server and ``ssh``
back in as the user *omicron*:

```
# exit
$ exit
$ ssh omicron@relevant_ip_address
$ exit
```

**Step 9**: Restart ssh and test ``chroot``.

That works as expected. Now ssh back in as your main user. Become root ,
restart ``ssh``, exit, and then ``ssh`` back in as *omicron*. The user should
be in the ``chroot`` directory.

```
$ exit
$ sudo su
# systemctl reload sshd
# exit
$ exit
```

## Exercise

Copy the libraries for the ``ls`` command so that the user *omicron* and use
``ls`` after logging into their account.

[1]:https://linuxconfig.org/how-to-automatically-chroot-jail-selected-ssh-user-logins
