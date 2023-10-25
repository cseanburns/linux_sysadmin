# Local Security

## Introduction

Security challenges predominantly
emanate from network interactions;
however, safeguarding a system from
potential internal threats
is equally critical.
This can be achieved by enforcing
stringent file permissions and
ensuring that users
lack certain types of access,
such as `sudo` privileges.
Take, for instance,
the program `/usr/bin/gcc`,
which serves as the GNU C and C++ compiler,
translating C or C++ source code
into executable programs
(like *exe* programs on Windows computers).
Unrestricted access to this compiler
could potentially allow users
to create programs capable
of compromising the system
(I know, based on personal experience).

In the following section,
we will shift focus to external threats
and learn about setting up a firewall.
In this section,
we focus on internal threats and
learn how to create a **chroot** environment.
This is a specialized environment
that restricts user operations or proccesses
to a defined directory,
thereby bolstering system security.
By delving into the setup of a chroot environment,
we will unveil an effective strategy
that can mitigate risks
stemming from within the system.

## chroot

As we all know,
the Linux file system has a root directory **/**,
and under this directory are other directories like
**/home**, **/bin**, and so forth.
A chroot (**change root**) environment 
is a way to create a pseudo root directory
at some specific location in the directory tree, and
then build an environment in that pseudo root directory
that offers some applications.
Once that environment is setup,
we can then confine a user account(s) to that
pseudo directory, and
when they login to the server,
they will only be able to see
(e.g., with the ``cd`` command)
what's in that pseudo root directory and
only be able to use the applications that
we've made available in that chroot.

Thus, a **chroot** is a technology used
to change the
"apparent root **/** directory for a user or a process" and
confine that user to that location on the system.
A user or process that is confined to the
**chroot** cannot easily see or access
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

## Creating a chroot

In this tutorial,
we are going to create a ``chroot``.

1. First, we create a new directory for our chroot. That
   directory will be located at ``/mustafar`` (but it could
   be elsewhere). Note that the normal root directory is
   ``/``, but for the chroot, the root directory will be
   ``/mustafar`` even though it will appear as ``/`` in the
   ``chroot``.

   Depending on where we create the chroot, we want to check
   the permissions of the new directory and make sure it's
   owned by root. If not, use ``chown root:root /mustafar``
   to set it.

    ```
    sudo mkdir /mustafar
    ls -ld /mustafar
    ```

2. We want to make the ``bash`` shell available in the chroot.
   To do that, we'll create a ``/bin`` directory in
   ``/mustafar``, and copy ``bash`` to that directory.

    ```
    which bash
    sudo mkdir /mustafar/bin
    sudo cp /usr/bin/bash /mustafar/bin/
    ```

3. Large software applications have dependencies, aka
   libraries. We need to copy those libraries to our chroot 
   directory so applications, like Bash, can run. To
   identify libraries needed by ``bash``, we use the ``ldd``
   command:

   ```
   ldd /usr/bin/bash
   ```

   **Output (output may vary depending on your system):**

   ```
   linux-vdso.so.1 (0x00007fff2ab95000)
   libtinfo.so.6 => /lib/x86_64-linux-gnu/libtinfo.so.6 (0x00007fbec99f6000)
   libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fbec97ce000)
   /lib64/ld-linux-x86-64.so.2 (0x00007fbec9ba4000)
   ```

   We can ignore the first item in the output. But we will
   need the libraries in the last three lines.

<!--
    Use the ``locate`` command to identify the locations of
    the libraries. The ones we need should be located in the
    **/usr/lib/x86_64-linux-gnu/** and **/lib64**
    directories. The ``locate`` command might need to be
    installed and updated first. Here I show how to use it
    to locate one of the dependencies, but there are more
    than one for you to locate:

    ```
    sudo apt install mlocate
    sudo updatedb
    ```

    Then we use the ``locate`` command to identify the paths
    to the needed libraries. Here's an example of using
    ``locate`` to identify the path to the first library we
    need:

    ```
    locate libtinfo.so.6
    /snap/core20/1611/usr/lib/x86_64-linux-gnu/libtinfo.so.6
    /snap/core20/1611/usr/lib/x86_64-linux-gnu/libtinfo.so.6.2
    /snap/core20/1623/usr/lib/x86_64-linux-gnu/libtinfo.so.6
    /snap/core20/1623/usr/lib/x86_64-linux-gnu/libtinfo.so.6.2
    /snap/core22/275/usr/lib/x86_64-linux-gnu/libtinfo.so.6
    /snap/core22/275/usr/lib/x86_64-linux-gnu/libtinfo.so.6.3
    /snap/core22/310/usr/lib/x86_64-linux-gnu/libtinfo.so.6
    /snap/core22/310/usr/lib/x86_64-linux-gnu/libtinfo.so.6.3
    /usr/lib/i386-linux-gnu/libtinfo.so.6
    /usr/lib/i386-linux-gnu/libtinfo.so.6.3
    /usr/lib/x86_64-linux-gnu/libtinfo.so.6
    /usr/lib/x86_64-linux-gnu/libtinfo.so.6.3
    ```

    We have to decide, amongst all this output, which of
    these libraries is the needed one. We want to avoid the
    **snap** libraries. After eliminating those, the fourth
    one from the bottom becomes the obvious choice since
    it's an exact match.
-->

4.  Next we create directories for these libraries in
    ``/mustafar`` that match or mirror the directories they
    reside in.

    To do that, use the ``mkdir`` command to create a
    **/mustafar/lib/x86_64-linux-gnu/** directory and a
    **/mustafar/lib64** for the libraries. We need to name
    the library directories after the originals to stay
    consistent with the main environment.

    ```
    sudo mkdir -p /mustafar/lib/x86_64-linux-gnu
    sudo mkdir /mustafar/lib64
    ```

    Then we proceed to **copy** (not move!) the libraries to
    their respective directories in the **/mustafar**
    directory:

    ```
    cd /mustafar/lib/x86_64-linux-gnu/
    sudo cp /lib/x86_64-linux-gnu/libtinfo.so.6 .
    sudo cp /lib/x86_64-linux-gnu/libc.so.6
    cd /mustafar/lib64/
    sudo cp /lib64/ld-linux-x86-64.so.2 .
    ```

5. Finally, we can test the ``chroot``

    ```
    sudo chroot /mustafar
    bash-5.1# ls
    bash: ls: command not found
    bash-5.1# help
    bash-5.1# dirs
    bash-5.1# pwd
    bash-5.1# cd bin/
    bash-5.1# dirs
    bash-5.1# cd ../lib64/
    bash-5.1# dirs
    bash-5.1# cd ..
    bash-5.1# for i in {1..4} ; do echo "$i" ; done
    bash-5.1# exit
    ```

    We get a Bash prompt, which is great, but we do not have
    the main utilities that we normally use. If you type in
    ``help``, you will however find that you have some
    commands available, like ``pwd``, ``dirs``, ``cd``,
    ``help``, ``for``, and more.

## Exercise

Use the ``ldd`` command,
to add additional binaries.
Make the following utilities/binaries
available in the ``/mustafar``
chroot directory:

- ``ls``
- ``cat``

## Conclusion

Systems need to be secure from the inside and out.
In order to secure from the inside,
system users should be given access and permissions
as needed.

In this section, we covered how to create a **chroot** environment.
The chroot confines users and processes to this pseudo root location.
It provides them limited access to the overall file system and
to the software on the system.
We can use this chroot to confine users and processes,
like **apache2** or human users.
Any user listed in ``/etc/passwd`` can be chrooted, and
most users listed in that file are services.

Restricted a human user to a chrooted environment
may not be necessary.
On a multi-user system,
proper education and training about the policies
and uses of the system may be all that's needed.
Alternatively, when creating user accounts,
we could make their default shell ``rbash``,
or **restricted bash**.
``rbash`` limits access to a lot of
Bash's main functions, and
for added security, it
can be used in conjunction with ``chroot``.
In summary, if a stricter environment is needed,
now you know how to create
a basic **chroot** environment.

**Additional Sources:**

- [How to automatically chroot jail selected ssh user logins][chrootjail].
- [BasicChroot][basicchroot]
- [How to Use chroot for Testing on Ubuntu][linode]
- [How To Setup Linux Chroot Jails][linuxhint]

[chrootjail]:https://linuxconfig.org/how-to-automatically-chroot-jail-selected-ssh-user-logins
[docker]:https://en.wikipedia.org/wiki/Docker_(software)
[basicchroot]:https://help.ubuntu.com/community/BasicChroot
[linode]:https://www.linode.com/docs/guides/use-chroot-for-testing-on-ubuntu/
[linuxhint]:https://linuxhint.com/setup-linux-chroot-jails/

<!--
1. Let's create a new user. After we create the new user, we
   will ``chroot`` that user going forward.

    ```
    sudo adduser vader
    ```

6. Create a new group called *mustafar*. We can add users to
   this group that we want to jail.

    ```
    groupadd mustafar
    usermod -a -G mustafar vader
    groups vader
    ```

7. Edit ``/etc/ssh/sshd_config`` to direct users in the ``chrootjail`` group to
   the ``chroot`` directory. Add the following line at the end of the file.
   Then restart ssh server.

    ```
    sudo nano /etc/ssh/sshd_config
    Match group mustafar
                ChrootDirectory /mustafar
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
-->
