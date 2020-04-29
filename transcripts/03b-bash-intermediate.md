# Bash Intermediate
## Date: Tue Sep  3 08:38:50 EDT 2019

## Job control

**Note**: the dollar sign in the examples below simply indicate the Bash 
prompt. Don't type those in if you follow along.

Bash provides tools to work with multiple utilities. For example, open
the *nano* text editor like so:

``$ nano``

And then press the **Ctrl-z** combo to background the process. Now open
*vim*, and then repeat with the **Ctrl-z** combo to background that
process. Repeat with *htop*: 

``$ vim``

**Ctrl-z**

``$ htop``

**Ctrl-z**

To get a list of jobs, run the *jobs* command:

``$ jobs``

Each job will have an ID number. To foreground the second job, use the *fg* 
command:

``$ fg 2``

If a process is stopped and backgrounded, you can make it run in the background by using the percent sign along with the job number. Let's ``bg`` the ``sleep`` command and then let it run in the background:

``$ sleep 1``

Ctrl-z

``$ bg %1``

It's best not to *kill* a job, i.e., with the *kill* command. Instead, try to 
close it out normally (such as **Ctrl-x** in *nano*). But if you want, run 
*jobs* like so to get the PID (process ID) number for the job:

``$ jobs -l``

That will return the PID number for the backgrounded jobs. To kill a runaway 
process/job, you'd do:

``$ kill -9 30125``

Assuming that 30125 is the PID for the misbehaving job.

## Environmental Variables

To print environmental variables, run the following command:

``$ printenv``

This is useful because it will give you information about how variables have 
been set in places like .profile, .bashrc, and elsewhere. Notice, for example,  
the $PATH variable (listed in printenv output with the dollar sign). That tells 
you where Bash looks for executables when you run them. If you want to add new 
directories to the $PATH variable, then you can do that in your **.bashrc** 
file.

## Redirection

A command like *ls* normally prints output to the screen, which in many cases 
is what we call the standard output, or *stdout*, for short. We can redirect 
*stdout* to file using the right angle bracket:

``$ ls > directory_listing.txt``

Using only a single right angle bracket will overwrite the file, here named
**directory_listing.txt**, if it already exists. To **append** (or add) 
**stdout** to the file, use two angle brackets:

``$ ls -ahlt >> directory_listing.txt``

We can redirect in the reverse order. That is, we can take input from a file 
instead of the keyboard -- thus making the file function as **stdin** rather 
than the keyboard. To do so, we reverse the angle bracket. This is usually 
helpful in Bash scripts. For example, when I created the user accounts for our 
server, I used the following conditional in Bash that took a file name as 
**stdin**. Here's an abbreviated form of that command, where the variable 
"$user_list" is a file containing a single column of usernames. This is not the 
full command that I use, so if you try it, it won't work the way you'd like:

``$ while read i ; do useradd "$i" ; done <"$user_list"``

Another example -- creating a bunch of empty files:

``$ while read j ; do touch "$i" ; done<greek-letters``

Another way to redirect **stdin** is to use what's called [process 
substitution][1]. This is what's happening in the *ls* commands in the 
parentheses below. Process substitution is where the ["input or output of a 
process ... appear as a temporary file"][2]:

Create a **tmp** directory and change to it:

``$ mkdir tmp ; cd tmp/``

Create two new subdirectories in **tmp/**:

``$ mkdir A ; mkdir B``

Create three empty files in the **tmp/A/** directory:

``$ cd A ; touch one two three``

Create three empty files in the **tmp/B/** directory:

``$ cd ../B ; touch one two four``

Compare the differences with process substitution:

``$ cd .. ; sdiff <(ls A/) <(ls B/)``

## File permissions

All files in Linux have permissions. See, e.g., below, where I have one 
regular, empty file called **newfile.txt** and one directory called 
**workspace**:

<pre>
$ ls -lh
-rw-r--r--  1 sean sean    0 Sep  6 00:28 newfile.txt
drwxr-xr-x 16 sean sean 4.0K Jun 21 18:35 workspace
</pre>

For now, we're going to concentrate on the three octals represented
after the initial dash or the initial **d** in the above list. The initial 
dash can indicate a number of file attributes, and I'll cover some 
of that a bit later in this video and more of it later on in the course. 

Each of the letters in the list of file permissions represent a number. The 
**r** for read access is represented by the number 4. The **w** for write 
access is represented by the number 2. And the **x** for execute is represented 
by the number 1. You can read more about this in *man* page for *chmod*.

Additionally, the **rwx** values can be repeated up to three times in order to 
indicate permissions for the user who owns the file, other users in the file's 
group, and the last for all users, which is important to set if the file is to 
be accessible on a website. 

Thus, the **newfile.txt** listed above indicates that the user has read and 
write access (**rw-**), that the group **sean** has read access (**r--**), and 
that all users have read access (**r--**). If I want to make sure that only I 
have read and write access, then I use *chmod* like so:

``$ chmod 600 newfile.txt``

Since **r** indicates 4 and **w** indicates 2, then the six is simply the sum 
of those two numbers. If I want a group to have read and write access to that 
file, then I simply repeat the sum of those numbers in the second set of 
octals:

``$ chmod 660 newfile.txt``

Or, if I want the owner of the file to have read and write access but 
the group to have only read access, and all users to have no access, 
then:

``$ chmod 640 newfile.txt``

If we want to be able to *cd* into a directory, then the **x**, or execute, bit 
must be set. For a regular file, the **x** bit indicates that the file is a 
script, application, or program of some sort (could be a binary program or a 
script file, like Bash, Python, etc.).

The *chown* command changes who owns the file, for either or both the 
user or group. The following command changes the owner of the file to a user 
named **sam**::

``$ chown sam newfile.txt``

If I want to also change the group, then I state both the owner's name and the 
group's name. Here the group's name is **wildcats** (assuming the group 
**wildcats** already exists on the system):

``$ chown sam:wildcats newfile.txt``

More on creating new groups later.

## Hard and Symbolic links

**Hard Links**

- two files that share a hard link are the exact same file
- can delete either file and the other will remain
- cannot extend across file systems

**Soft Links**

- two files that share a soft link are not the exact same file
- if delete the original file, the soft link file is also gone
- can extend across file systems

Let's create a directory called **tmp** and change to that directory:

``$ mkdir tmp ; cd tmp/``

Create an empty file called **a.txt**:

``$ touch a.txt``

Link **a.txt** to a file called **b.txt**, which will be created when I 
make the link:

``$ ln a.txt b.txt``

Look at the inode for each file (i.e., its metadata), note that they 
are the same because this is a hard link:

``$ stat a.txt ; stat b.txt``

Or:

``$ ls -il``

Add info to **a.txt** and cat file **b.txt**, and you'll note that the 
content is the same.

To create a symbolic link, which is useful if the symbolic link exists on a 
separate file system, using the *-s* option for the *ln* command:

``$ ln -s a.txt c.txt``

Note that these files, although the content is updated whenever one 
file is updated, are two separate files:

``$ stat a.txt ; stat c.txt``

[1]: http://tldp.org/LDP/abs/html/process-sub.html
[2]: http://wiki.bash-hackers.org/syntax/expansion/proc_subst
