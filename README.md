# Linux Sys Admin

This repository contains material for a course on systems administration with
Linux. The content is written in markdown (see **src/** directory) and is built
using [mdBook][mdbook]. The output is nearly complete (as of August 11, 2022)
and is hosted on my [website][linuxBook]. The **archive/** directory contains
prior content that I want to save separately.

**To Do for Fall 2022:**

- Switch from Fedora to Ubuntu
  - Reason: Ubuntu offers fairly recent versions of software but is much less
    bleeding edge than Fedora. It's easier to manage a course that uses a more
    stable and consistent operating system.
- Switch from VirtualBox to Google Cloud.
  - Reason: Many students have Apple computers, and the recent switch to the M1
    chip made it impossible for those students to continue to use VirtualBox.
    Considered letting them buy different and better supported virtualization
    software, but that wouldn't solve the problem for x86 virtual machines, and
    decided they'd benefit more learning to use a cloud service.

[mdbook]:https://github.com/rust-lang/mdBook
[linuxBook]:https://cseanburns.net/WWW/linux-systems-admin/index.html
