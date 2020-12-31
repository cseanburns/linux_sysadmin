# History of Unix and Linux

## Location: Bell Labs, part of AT&T (New Jersey), late 1960s through early 1970s

- Multics, a time sharing system (that is, more than one person could use it at
  once)
- Multics had issues and was slowly abandoned
- [Ken Thompson][thompson] found an old PDP-7. Started to write UNIX.
- Also, the ``ed`` text editor was written. Pronounced e.d. but generally
  sounded out.
- This version of UNIX would later be referred to as *Research Unix*
- [Dennis Ritchie][ritchie] joined him and created the C language (In October
  2011, Steve Jobs passed away a week before Dennis Ritchie, but the world
  mourned Jobs and Ritchie's death went largely unnoticed).

## Location: Berkeley, CA (University of California, Berkeley), early to mid 1970s

- The code for UNIX was not 'free' but low cost and easily shared.
- Ken Thompson visited Berkeley and helped install Version 6 of UNIX
  [https://en.wikipedia.org/wiki/Berkeley_Software_Distribution][BSD].
- Bill Joy and others contributed heavily (Joy created vi, which Vim descends
  from).
- This installation of UNIX would eventually become known as the Berkeley
  Software Distribution, or BSD.

## AT&T

- Until its breakup in 1984, AT&T was not allowed to profit off of patents that
  were not directly related to its telecommunications businesses.
- This agreement with the US government helped protect the company from charges
  of monopoly, and as a result, they could not commercialize UNIX.
- This changed after the breakup. System V UNIX became the standard bearer of
  commercial UNIX.

## Location: Boston, MA (MIT), early 1980s through early 1990s

- In the late 1970s, [Richard Stallman][stallman] began to notice that software
  began to become commoditized and as a result, hardware vendors were no longer
  sharing the code they developed to make their hardware work. During much of
  his education, software code was not eligible for copyright protection
  (changed under the Copyright Act of 1976).
- Stallman, who thrived in a *hacker culture* (Wikipedia page on Stallman),
  began to wage battles against this.
- Stallman created the [GNU project][gnu_project] and philosophy (also the
  creator of GNU Emacs). The project is an attempt to create a completely
  **free** operating system, that was Unix-like, called GNU.
- By the early 1990s, Stallman and others had developed all the utilities
  needed to have a full operating system, except for a kernel.
- This includes the Bash shell, written by [Brian Fox][bfox].
- The philosophy includes several propositions that define free software:

## The four freedoms, per GNU Project

[https://www.gnu.org/philosophy/free-sw.html][four_freedoms]

> 0. The freedom to run the program as you wish, for any purpose (freedom 0).
> 1. The freedom to study how the program works, and change it so it does your
>   computing as you wish (freedom 1). Access to the source code is
>   a precondition for this.
> 2. The freedom to redistribute copies so you can help others (freedom 2).
> 3. The freedom to distribute copies of your modified versions to others
>   (freedom 3). By doing this you can give the whole community a chance to
>   benefit from your changes. Access to the source code is a precondition for
>   this.

## The Unix wars and the lawsuit

- Differences in AT&T Unix and BSD Unix arose. The former was aimed at
  commercialization and the latter aimed at researchers and academics.
- UNIX Systems Laboratories, Inc. (USL, part of AT&T) sued Berkeley Software
  Design, Inc. (BSDi, part of the University of California, Berkeley) for
  copyright and trademark violations.
- USL ultimately lost the case.

## The Rise of Linux, Linus Torvalds, University of Helsinki, Finland

- On August 25, 1991 (28 years ago this last Sunday), [Linus][linux_torvalds]
  [Torvalds][torvalds_linus] announced that he had started working on
  a **free** operating system kernel for the 386 CPU architecture and for the
  specific hard drives that he had. This kernel would later be named Linux.
- Linux technically refers only to the kernel. An operating system kernel
  handles startup, devices, memory, resources, etc.
- His motivation was to learn about OS development but also to have access to
  a Unix-like system. He already had access to an Unix-like system called
  MINIX, but MINIX had some technical and copyright restrictions.
- Torvalds has stated that if a BSD or if GNU Hurd were available, then he may
  not have created the Linux kernel.
- But Torvalds and others took the GNU utilities and created what is now called
  Linux, or GNU/Linux.

## Distributions

- Soon after Linux development, people would create their own Linux and GNU
  based operating systems and would distribute.
- As such, they became referred to as *distributions*.
- The two oldest distributions that are still in active development include:
  - Slackware
  - Debian

## Short History of BSD

- Unix version numbers 1-6 eventually led to BSD 1-4.
- At BSD 4.3, all versions had some AT&T code. Desire to remove this code led
  to BSD Net/1.
- All AT&T code was removed by BSD Net/2.
- BSD Net/2 was ported to the Intel 386 processor. This became 386BSD and was
  made available a year after the Linux kernel was released, in 1992.
- 386BSD split into two projects:
  - NetBSD
  - FreeBSd
- NetBSD split into another project: OpenBSD.
- All three of these BSDs are still in active development. From a bird's eye
  point of view, they each have different foci:
  - [NetBSD][netbsd] focuses on portability (MacOS, NASA)
  - [FreeBSD][freebsd] focuses on wide applicability (WhatsApp, Netflix,
    PlayStation 4, MacOS)
  - [OpenBSD][openbsd] focuses on security (has contributed a number of very
    important applications)

Note: MacOS is based on [Darwin][puredarwin], is [technically UNIX][unix], and
is partly based on FreeBSD with some code coming from the other BSDs.

## Short History of GNU

- The GNU Hurd is still being developed, but it's only in the pre-production
  state. The last release was 0.9 on December 2016. A complete OS based on the
  GNU Hurd can be downloaded and ran.

## Free and Open Source Licenses

- [GNU General Public License (GPL)][gnu_gpl]
- [BSD License][bsd_license]

[thompson]:http://cs.bell-labs.co/who/ken/
[ritchie]:https://www.bell-labs.com/usr/dmr/www/
[stallman]:https://en.wikipedia.org/wiki/Richard_Stallman
[gnu_project]:https://www.gnu.org/gnu/gnu.html
[bfox]:https://opuslogica.com/
[four_freedoms]:https://www.gnu.org/philosophy/free-sw.html
[linus_torvalds]:https://www.cs.helsinki.fi/u/torvalds/
[torvalds_linus]:https://www.kernel.org/
[netbsd]:https://www.netbsd.org/
[freebsd]:https://www.freebsd.org/
[openbsd]:https://www.openbsd.org/
[pure_darwin]:http://www.puredarwin.org/
[unix]:https://www.opengroup.org/membership/forums/platform/unix
[gnu_gpl]:https://www.gnu.org/software/hurd/
[bsd_license]:https://opensource.org/licenses/BSD-3-Clause
[BSD]:https://en.wikipedia.org/wiki/Berkeley_Software_Distribution]
