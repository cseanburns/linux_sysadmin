# Local Security

By the end of this section, you should know:

* The purpose of a `chroot` environment and how it enhances local security by restricting users to a defined directory.
* How to create a basic `chroot` directory and structure it to mimic a limited root file system.
* How to set up and test the `chroot` environment to ensure users are confined to their pseudo-root directory.
* The process for identifying and copying necessary binaries and their dependencies into a `chroot`.
* Basic troubleshooting techniques for common issues that may arise when setting up or entering a `chroot`.
* The limitations of `chroot` for security and how it serves as a foundational concept for containerization technologies like Docker.
* How to configure SSH to restrict specific user groups to a `chroot` environment for added security.

## Getting Started

Security challenges predominantly emanate from network interactions;
however, safeguarding a system from potential internal threats is equally critical.
This can be achieved by enforcing stringent file permissions and ensuring that users lack certain types of access, such as `sudo` privileges.
Take, for instance, the program `/usr/bin/gcc`.
`gcc` serves as the GNU C and C++ compiler, translating C or C++ source code into executable programs (like `exe` programs on Windows computers).
Unrestricted access to this compiler could potentially allow users to create programs capable of compromising the system
(I know, based on personal experience).

In the following section, we will shift focus to external threats and learn about setting up a firewall.
In this section, we focus on internal threats and learn how to create a **chroot** environment.
This is a specialized environment that restricts user operations or processes to a defined directory, thereby bolstering system security.
By delving into the setup of a `chroot` environment, we will unveil an effective strategy that can mitigate risks stemming from within the system.

## chroot

As we all know, the Linux file system has a root directory **/**, and under this directory are other directories like **/home**, **/bin**, and so forth.
A `chroot` (**change root**) environment is a way to create a fake root directory at some specific location in the directory tree, and
then build an environment in that pseudo root directory that offers some applications.
Once that environment is setup, we can confine a user account(s) to that pseudo directory, and when they login to the server,
they will only be able to see (e.g., with the ``cd`` command) what's in that pseudo root directory and only be able to use the applications that
we've made available in that chroot.

Thus, a `chroot` is a technology used to change the "apparent root **/** directory for a user or a process" and
confine that user to that location on the system.
A user or process that is confined to the `chroot` cannot easily see or access the rest of the file system and 
will have limited access to the binaries (executables/apps/utilities) on the system.
From its ``man`` page:

```
chroot (8) - run command or interactive shell with special root directory
```

Although it is not security proof, it does have some useful security use cases.
Some use `chroot` to contain DNS or [web servers][apachechroot], for example.

`chroot` is also the conceptual basis for some kinds of virtualization technologies that are common today, like [Docker][docker].

## Creating a chroot

In this tutorial, we are going to create a ``chroot``.

1. First, we create a new directory for our chroot. That directory will be
   located at ``/mustafar`` (but it could be elsewhere). Note that the normal
   root directory is ``/``, but for the chroot, the root directory will be
   ``/mustafar`` even though it will appear as ``/`` in the ``chroot``.

   Depending on where we create the chroot, we want to check the permissions of
   the new directory and make sure it's owned by root. If not, use ``chown
   root:root /mustafar`` to set it.

   Create directory:

    ```
    sudo mkdir /mustafar
    ```

    Check user and group ownership:

    ```
    ls -ld /mustafar
    ```

2. We want to make the ``bash`` shell available in the chroot. To do that, we
   create a ``/bin`` directory in ``/mustafar``, and copy ``bash`` to that
   directory.

    ```
    which bash
    sudo mkdir /mustafar/bin
    sudo cp /usr/bin/bash /mustafar/bin/
    ```

    **ALTERNATIVELY**: use command substitution to copy `bash`:

    ```
    sudo mkdir /mustafar/bin
    sudo cp $(which bash) /mustafar/bin
    ```

3. Large software applications have dependencies, aka libraries. We need to
   copy those libraries to our chroot directory so applications,like `bash`,
   can run.

   To identify libraries needed by ``bash``, we use the ``ldd`` command:

   ```
   ldd /usr/bin/bash
   ```

   **Do not copy!! Output (output may vary depending on your system):**

   ```
   linux-vdso.so.1 (0x00007fff2ab95000)
   libtinfo.so.6 => /lib/x86_64-linux-gnu/libtinfo.so.6 (0x00007fbec99f6000)
   libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fbec97ce000)
   /lib64/ld-linux-x86-64.so.2 (0x00007fbec9ba4000)
   ```

   Ignore the first item in the output (`linux-vdso.so.1`). But we will need
   the libraries in the last three lines.

4.  Next we create directories for these libraries in `/mustafar` that match or
    mirror the directories they reside in. For example, in the above `ldd`
    output, two directory paths are highlighted: `/lib/x86_64-linux-gnu` and
    `/lib64`. Therefore, we need to create directories with those names in
    `/mustafar`.

    To do that, use the `mkdir` command to create a
    `/mustafar/lib/x86_64-linux-gnu/` directory and a `/mustafar/lib64` for
    the libraries. We need to name the library directories after the originals
    to stay consistent with the main environment.

    ```
    sudo mkdir -p /mustafar/lib/x86_64-linux-gnu
    ```

    And then:

    ```
    sudo mkdir /mustafar/lib64
    ```

    Then we proceed to **copy** (not move!) the libraries to their respective
    directories in the **/mustafar** directory:

    ```
    cd /mustafar/lib/x86_64-linux-gnu/
    sudo cp /lib/x86_64-linux-gnu/libtinfo.so.6 .
    sudo cp /lib/x86_64-linux-gnu/libc.so.6
    cd /mustafar/lib64/
    sudo cp /lib64/ld-linux-x86-64.so.2 .
    ```

5. Finally, we can test the `chroot`:

    ```
    sudo chroot /mustafar
    ```

    If successful, you should see a new prompt like below:

    ```
    bash-5.1#
    ```
    
    If you try running some commands, that are not part of Bash itself, you'll
    encounter some errors.

    We do have access to some commands, like `help`, `dirs`, `pwd`, `cd`, and
    more because these are **builtin** to `bash`. Utilities not builtin to
    `bash` are not yet available. These include `ls`, `cat`, `cp`, and more.
    The following is a brief example of interacting in a limited chroot
    environment with no outside utilities available:

    ```
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
    ```
    
    To exit the `chroot` environment, simply type `exit`:

    ```
    bash-5.1# exit
    ```

## Exercise

Use the ``ldd`` command, to add additional binaries.
Make the following utilities/binaries available in the `/mustafar` chroot directory:

- ``ls``
- ``cat``

### Troubleshooting Common chroot Setup Errors

When setting up a `chroot` environment, you may encounter an error like:

```
chroot: failed to run command '/bin/bash': No such file or directory
```

This error often occurs if the `chroot` environment is missing critical files or directories, such as the `bash` executable or its required libraries. Here are some steps to resolve this:

1. **Check for the Bash Binary**: Ensure that the `bash` executable has been
correctly copied to `/mustafar/bin/`:
   
   ```
   sudo ls /mustafar/bin/bash
   ```
   
   If this file isn't there, go back to the step where you copy `bash` to the `chroot` directory.

2. **Verify Library Dependencies**: The `bash` binary requires certain
libraries to run. Use the `ldd` command to list these dependencies and confirm
they are copied to `/mustafar`:

   ```
   ldd /usr/bin/bash
   ```

   Ensure each library listed is copied to the matching directory within `/mustafar`, such as `/mustafar/lib/x86_64-linux-gnu/` and `/mustafar/lib64/`.

3. **Correct File Structure**: Confirm that your `chroot` directory structure
mirrors the actual root structure. The paths within `/mustafar` should match
the paths of the dependencies found using `ldd`.

After confirming these items, try running `chroot` again:

```
sudo chroot /mustafar
```

If these checks don't resolve the issue, double-check permissions on the `chroot` directory to ensure root ownership:

```
sudo chown root:root /mustafar
```

## Conclusion

Systems need to be secure from the inside and out.
In order to secure from the inside, system users should be given access and permissions as needed.

In this section, we covered how to create a **chroot** environment.
The chroot confines users and processes to this pseudo root location.
It provides them limited access to the overall file system and to the software on the system.
We can use this chroot to confine users and processes, like **apache2** or human users.
Any user listed in `/etc/passwd` can be chrooted, and most users listed in that file are services.

Restricting a human user to a chrooted environment may not be necessary.
On a multi-user system, proper education and training about the policies and uses of the system may be all that's needed.
Alternatively, when creating user accounts, we could make their default shell `rbash`, or **restricted bash**.
`rbash` limits access to a lot of Bash's main functions, and for added security, it can be used in conjunction with `chroot`.
See `man rbash` for more details.

In summary, if a stricter environment is needed, you know how to create a basic `chroot` environment.

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
[apachechroot]:https://tldp.org/LDP/solrhe/Securing-Optimizing-Linux-RH-Edition-v1.3/chap29sec254.html

## Appendix A: Non-Google Cloud Systems

Our user accounts and connections to our Google Cloud virtual instances are managed on the Google Cloud console,
and we reach these instances using the `gcloud compute ssh` command.
The `gcloud` command is special software that we installed on our personal systems and authentication happens via our Google accounts.
However, on traditional remote systems, we use `ssh` with its standard syntax, which is: `ssh user@domain.com` or `ssh user@<ip_address>`,
where `user` is the account name managed directly on the server and `domain.com` is the host name of the server.

On those traditional types of systems, we can take advantage of `chroot` to isolate user accounts to a chrooted environment.
There are a number of ways to do this, but below I demonstrate how to isolate users to a chrooted environment based on their group membership.

1. Let's create a new user. After we create the new user, we will ``chroot`` that user going forward.

    ```
    sudo adduser vader
    ```

6. Create a new group called `mustafar`. We can add users to this group that we want to jail in a chrooted environment.

    ```
    sudo groupadd mustafar
    sudo usermod -a -G mustafar vader
    groups vader
    ```

7. Edit `/etc/ssh/sshd_config` to direct users in the `chrootjail` group to the
   `chroot` directory. Add the following line at the end of the file. Then
   restart ssh server.

    ```
    sudo nano /etc/ssh/sshd_config
    ```
    
    Then add:
    
    ```
    Match group mustafar
                ChrootDirectory /mustafar
    ```

    Exit `nano`, and restart `ssh`:

    ```
    systemctl restart sshd
    ```

8. Test the `ssh` connection for the `vader` user. Here I use `ssh` on the local system to connect to the local system, simply to test it.

    ```
    ssh vader@localhost
    -bash-5.1$ ls
    -bash: ls: command not found
    exit
    ```

    That works as expected. The user `vader` is now restricted to a special
    directory and has limited access to the system or to any utilities on that
    system.

## Appendix B: Additional Tools for Securing Multi-User Shell Systems

In addition to `chroot` and `rbash`, other Linux tools can help secure multi-user, shell-accessible systems.
These tools can be used to restrict file modifications, monitor system changes, and limit user actions.
Together they provide an extra layer of control and protection.

1. `chattr` (Change File Attributes)

    The `chattr` command changes file attributes on Linux filesystems. By
    setting certain attributes on files, you can restrict users—even with
    superuser permissions—from modifying critical files. This is particularly
    useful for preventing accidental or malicious deletion or alteration of
    configuration files and other sensitive data.

    * **Common Usage**: The most frequently used option is the `+i` (immutable) attribute, which prevents modification or deletion.

    ```
    sudo chattr +i /path/to/important/file
    ```

    Once this attribute is set, the file cannot be modified, renamed, or deleted until the attribute is removed with `chattr -i`.

    * **Other Options**: There are additional flags to explore, such as `+a`,
      which allows only appending to a file, which is useful for log files that
      should not be altered.

2. `lsattr` (List File Attributes)

    The `lsattr` command is used to view the attributes set by `chattr`.
    This command shows you which files are immutable or otherwise restricted.
    It allows administrators to verify that critical files have the appropriate protections.

    * **Common Usage**:

    ```
    lsattr /path/to/important/file
    ```

    This command outputs a list of attributes and helps administrators quickly identify files that are protected or have special restrictions.

3. `sudo` and `sudoers` Configuration

    The `sudo` command grants specific users permission to execute commands as
    superuser, but the `sudoers` file can also be configured to limit which
    commands a user may execute with `sudo`. By restricting `sudo` permissions,
    you can allow users access to only the commands they need to perform their
    roles.

    * **Common Usage**: Open the `sudoers` file with `visudo` to edit user permissions. For example, to allow a user only to use `ls` and `cat` with `sudo`, add:

    ```
    username ALL=(ALL) /bin/ls, /bin/cat
    ```

4. `ulimit` (User Limits)

    The `ulimit` command sets resource limits for user sessions, such as
    maximum file sizes, number of open files, and CPU time. This is essential
    in preventing users from consuming excessive resources, which could slow
    down or crash the system.

    * **Common Usage**: To set a file size limit of 100MB for a session, use:

    ```
    ulimit -f 100000
    ```

    You can make these limits permanent for specific users by adding them to the user’s shell configuration file (e.g., `~/.bashrc`) or to the `/etc/security/limits.conf` file for global settings. If you add them to a user's `~/.bashrc` file, you can use the `chattr` command to prevent the user from editing that file.

5. `faillock` and Account Lockout Policies

    `faillock` helps protect against brute-force attacks by locking user accounts after a specified number of failed login attempts. This can prevent unauthorized access to user accounts.

    * **Common Usage**: To set a policy that locks an account for 10 minutes after three failed login attempts, edit `/etc/security/faillock.conf`:

    ```
    deny = 3
    unlock_time = 600
    ```

    Then, restart your authentication services to apply the changes.

6. `iptables` for Access Control

    While traditionally used for network security, `iptables` can also be configured to control user access to certain resources or services. For example, you can restrict SSH access to specific IP addresses, reducing the attack surface on multi-user systems.

    * **Common Usage**: To limit SSH access to users coming from a specific IP address:

    ```
    sudo iptables -A INPUT -p tcp --dport 22 -s <allowed_ip> -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 22 -j DROP
    ```
    
    On Debian-based systems, including Ubuntu, you can use the `ufw` command (Uncomplicated Firewall) instead of `iptables`:
    
    To permit SSH access (port 22) only from a specific IP address, use:
    
    ```
    sudo ufw allow from <allowed_ip> to any port 22
    ```
    
    To block SSH access from all other IPs, use:
    
    ```
    sudo ufw deny 22
    ```
    
    For example, to block SSH traffic from `192.168.1.100`, you would write:
    
    ```
    sudo ufw allow from 192.168.1.100` to any port 22
    sudo ufw deny 22
    ```
    
    Make sure `ufw` is active and running with these commands:
    
    ```
    sudo ufw enable
    sudo ufw status
    ```

Combined with `chroot` and `rbash`, these create a layered approach to security for multi-user shell systems.
Each tool has specific use cases, but together they help administrators establish a secure and controlled environment.
