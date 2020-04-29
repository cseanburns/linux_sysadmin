# The Linux/Unix File System and File Types

- ``tree`` : list contents of directories in a tree-like format
  - ``tree -dfL 1`` : dir only, full path, one level

## The root directories
- ``/bin`` : binary files needed to use the system
- ``/boot``  : files needed to boot the system
- ``/dev`` : device files -- all hardware has a file
- ``/etc`` : system configuration files
- ``/home`` : user directories
- ``/lib`` : libraries/programs needed for other programs
- ``/media`` : external storage is mounted
- ``/mnt`` : other file systems may be mounted
- ``/opt`` : store software code to compile software
- ``/proc`` : files containing info about your computer 
- ``/root`` : home directory of superuser
- ``/run`` : used by system processes
- ``/sbin`` : like ``/bin``, binary files that require superuser privs
- ``/usr`` : user binaries, etc that might be installed by users
- ``/srv`` : contains data for servers 
- ``/sys`` : contains info about devices 
- ``/tmp`` : temp files used by applications
- ``/var`` : variable files, used often for system logs

Source: [https://www.linux.com/tutorials/linux-filesystem-explained/][1]

[1]:https://www.linux.com/tutorials/linux-filesystem-explained/
