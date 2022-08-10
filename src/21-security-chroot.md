# Local Security

## Introduction

Most security issues come from the network, but
we also need to secure a system from insider attacks, too.
We can do that by setting appropriate file permissions and
by making sure users on a system do not have certain kinds
of access (e.g., ``sudo`` access)
to some utilities.
For example, the ``/usr/bin/gcc`` program is the
GNU C and C++ compiler.
If users have unrestricted access to that compiler,
then it's possible for them to compile programs
that compromise the system.

In the next section,
we'll cover how to set up a firewall, but
in this section,
we'll learn how to set up a **chroot jail**.

As we all know,
the Linux file system has a root directory **/**,
and under this directory are other directories like
**/home**, **/bin**, and so forth.
A chroot (**change root**) jail
is a way to create a pseudo root directory
at some specific location in the directory tree, and
then build an environment in that pseudo root directory
that offers some applications.
One that environment is setup,
we can then confine a user account(s) to that
pseudo directory, and
when they login to the server,
they will only be able to see
(e.g., with the ``cd`` command)
what's in that pseudo root directory and
only be able to use the applications that
we've made available in that chroot.

Thus, a **chroot jail** is a technology used
to change the
"apparent root **/** directory for a user or a process" and
confine that user to that location on the system.
A user or process that is confined to the
**chroot jail** cannot easily see or access
the rest of the file system and 
will have limited access to the binaries
(executables/apps/utilities) on the system.
From its ``man`` page:

```
chroot (8) - run command or interactive shell with special root directory
```

Although it is not security proof,
it does have some useful security use cases.
Some use ``chroot`` to contain DNS servers, for example.

``chroot`` is also the conceptual basis for some kinds of
virtualization technologies that are common today,
like [Docker][docker].

## Chroot a Current User

In this tutorial,
we are going to create a ``chroot`` for a human user account.

1. Let's create a new user. After we create the new user, we will ``chroot``
   that user going forward.

    ```
    sudo adduser vader
    ```

2. Next, we ``chroot`` *vader* into a new directory. That directory will be
   located at ``/opt/chroot``. Note that the root directory for our regular
   users is ``/``, but user *vader*'s root directory will be different
   ``/opt/chroot``, even if they can't tell. We also want to check the
   permissions of the new directory and make sure it's owned by root. If not,
   use ``chown root:root /opt/chroot`` to set it.

    ```
    sudo mkdir /opt/chroot
    ls -ld /opt/chroot
    ```

3. Now we set up available binaries for the user. We'll only allow ``bash`` for
   now.  To do that, we'll create a ``/usr/bin`` directory in /opt/chroot, and
   copy ``bash`` to that directory.

    ```
    which bash
    sudo mkdir -p /opt/chroot/usr/bin
    cp /usr/bin/bash /opt/chroot/usr/bin/
    ```

4. Large software applications have dependencies (aka, libraries). We need to
   copy those libraries to our chroot for the applications, like Bash, to
   function. To identify libraries needed by bash, we use the ``ldd`` command:

    ```
    ldd /usr/bin/bash
    ```

    Use the ``locate`` command to identify the locations of the libraries. The
    ones we need should be located in the **/usr/lib/x86_64-linux-gnu/**
    directory. The ``locate`` command might need to be installed and updated
    first. Here I show how to use it to locate one of the dependencies, but
    there are more than one for you to locate:

    ```
    sudo apt install mlocate
    sudo updatedb
    locate libtinfo.so.6
    ...
    ...
    ...
    ```

    Create a **/opt/chroot/lib/x86_64-linux-gnu/** directory for the libraries.
    We'll name the library directory after the originals to stay consistent
    with the main environment.

    ```
    sudo mkdir -p /opt/chroot/lib/x86_64-linux-gnu
    sudo cp /usr/lib/x86_64-linux-gnu/libtinfo.so.6 \
      /opt/chroot/lib/x86_64-linux-gnu/
    ```

5. Create and test the ``chroot``

    ```
    sudo chroot /opt/chroot/
    bash-5.1# ls
    bash: ls: command not found
    bash-5.1# help
    bash-5.1# dirs
    bash-5.1# cd bin/
    bash-5.1# dirs
    bash-5.1# cd ../lib64/
    bash-5.1# dirs
    bash-5.1# cd ..
    bash-5.1# exit
    ```

6. Create a new group called *chrootjail*. We can add users to this group that
   we want to jail. Instructions are based on [linuxconfig.org][chrootjail].

    ```
    groupadd chrootjail
    usermod -a -G chrootjail vader
    groups vader
    ```

7. Edit ``/etc/ssh/sshd_config`` to direct users in the ``chrootjail`` group to
   the ``chroot`` directory. Add the following line at the end of the file.
   Then restart ssh server.

    ```
    sudo nano /etc/ssh/sshd_config
    Match group chrootjail
                ChrootDirectory /var/chroot/
    ```

    Exit ``nano``, and restart ``ssh``:

    ```
    systemctl restart sshd
    ```

8. Test the ``ssh`` connection for the *vader* user.

    ```
    ssh vader@localhost
    -bash-5.1$ ls
    -bash: ls: command not found
    exit
    ```

    That works as expected. The user *vader* is now restricted to a special
    directory and has limited access to the system or to any utilities on that
    system.

## Exercise

By using the ``ldd`` command,
you can add additional binaries for this user.
As an exercise,
use the ``ldd`` command to locate
the libraries for the ``nano`` editor, and
make ``nano`` available to the user *vader*
in the chrooted directory.

## Conclusion

Systems need to be secure from the inside and out.
In order to secure from the inside,
system users should be given access and permissions
as needed.

In this section, we covered how to create a **chroot jail**
for a new user on our system.
The jail confines the user to this pseudo location
and provides the user limited access to that file system and
to the software on the system.

We can jail non-human users, too.
Any user listed in ``/etc/passwd`` can be jailed, and
most users listed in that file are services.

Jailing a human user may not be necessary.
On a multi-user system,
proper education and training about the policies
and uses of the system may be all that's needed.
But in case a stricter environment is needed,
now you know how to create a **chroot jail**.

[chrootjail]:https://linuxconfig.org/how-to-automatically-chroot-jail-selected-ssh-user-logins
[docker]:https://en.wikipedia.org/wiki/Docker_(software)
