# History of Unix and Linux

An outline of the history of Unix and Linux.

## Location: Bell Labs, part of AT&T (New Jersey), late 1960s through early 1970s

In the late 1960s through the early 1970s at Bell Labs,
part of AT&T in New Jersey,
the journey began with an operating system called Multics. 
Multics was a pioneering time-sharing system,
allowing more than one person to use it at once.
Despite its innovative approach,
Multics was fraught with issues and was slowly abandoned. 
In the midst of this abandonment,
[Ken Thompson][thompson]
stumbled upon an old PDP-7 and started 
writing what would become UNIX.
During this time,
he created the [ed][ed1] line editor,
pronounced e.d.,
but generally sounded out.
This specific version of UNIX would
later be known as Research Unix.
The project caught the attention of
[Dennis Ritchie][ritchie],
the creator of the C programming language,
who joined Thompson's efforts, and
together they laid the groundwork for
a revolution in computing.

## Location: Berkeley, CA (University of California, Berkeley), early to mid 1970s

In the early to mid-1970s at the
University of California, Berkeley,
the evolution of UNIX continued.
While not classified as 'free software,'
UNIX's code was low-cost and easily shared among
tech enthusiasts.
Ken Thompson visited Berkeley,
where he helped install Version 6 of [UNIX][unix6],
marking a significant moment in the system's history.
At Berkeley, several contributors,
including [Bill Joy][billjoy],
played vital roles in its development.
Joy was particularly influential,
creating the [vi][nvi] text editor,
a descendant of the popular [Vim][vim] editor,
and many other essential programs.
He also co-founded Sun Microsystems.
This installation and collaborative effort at
Berkeley eventually led to the creation of the
Berkeley Software Distribution, or [BSD][BSD],
a landmark in the history of UNIX
and computing as a whole.

## AT&T

Until its breakup in 1984,
AT&T operated under a unique agreement with the
U.S. government that restricted the company from
profiting off patents not directly related
to its telecommunications businesses.
This arrangement helped shield AT&T from
monopolistic charges,
but it also came with a significant limitation:
they could not commercialize UNIX.
The landscape changed dramatically after the
breakup of AT&T.
The constraints lifted,
allowing System V UNIX to emerge as
the standard bearer of commercial UNIX.
This transition marked a turning point
in the history of computing,
positioning UNIX as a central player
in the commercial technology market.

## Location: Boston, MA (MIT), early 1980s through early 1990s

In Boston, MA, at MIT during the early 1980s
through the early 1990s,
a significant shift in the software industry
was taking place.
In the late 1970s,
[Richard Stallman][stallman] observed the growing
trend of software becoming commercialized.
This commercialization led to hardware vendors
ceasing to share the code they developed
to make their hardware work.
This paradigm change was further solidified by the 
Copyright Act of 1976,
making software code eligible for copyright protection. 
Stallman, who thrived in a hacker culture,
began to battle against this new direction.
He responded by creating the [GNU project][gnuproject],
embracing the free software philosophy,
and developing influential tools such as GNU Emacs,
a popular text editor,
and many other programs.
The GNU project was an ambitious attempt
to create a completely free software operating
system that was Unix-like,
called GNU.
By the early 1990s,
Stallman and others had developed all
the utilities needed for a full operating system,
except for a kernel,
which they named [GNU Hurd][gnuhurd].
This encompassing project included
the creation of the Bash shell,
written by [Brian Fox][bfox],
reflecting a profound commitment
to free and open software.

The GNU philosophy includes several
propositions that define free software:

> The four freedoms, per GNU Project:
> 0. The freedom to run the program as you wish,
> for any purpose (freedom 0).
> 1. The freedom to study how the program works,
> and change it so it does your computing as you wish (freedom 1).
> Access to the source code is a precondition for this.
> 2. The freedom to redistribute copies so you can help others (freedom 2).
> 3. The freedom to distribute copies of your modified
> versions to others (freedom 3).
> By doing this you can give the whole community a chance
> to benefit from your changes.
> Access to the source code is a precondition for this.

[The Four Freedoms][fourfreedoms]

## The Unix wars and the lawsuit, late 1980s through the early 1990s

During the late 1980s through the early 1990s,
the so-called "Unix wars" and an
ensuing lawsuit marked a contentious period
in the history of computing.
Following its breakup,
AT&T began to commercialize Unix,
leading to distinct differences between
AT&T Unix and BSD Unix.
The former was aimed at commercial markets,
while the latter was targeted at
researchers and academics.
These contrasting objectives led to legal friction, 
culminating in UNIX Systems Laboratories, Inc.
(USL, part of AT&T) suing
Berkeley Software Design, Inc.
(BSDi, part of the University of California, Berkeley)
for copyright and trademark violations.
Ultimately, USL lost the case,
but not before the lawsuit had created significant 
obstacles for BSD Unix.
The legal battle delayed the adoption of BSD Unix,
leaving a lasting impact on the
development and dissemination of Unix systems.

## Linux, Linus Torvalds, University of Helsinki, Finland, early 1990s

In the early 1990s at the University of Helsinki
in Finland,
a significant development in the
world of computing unfolded.
On August 25, 1991,
[Linus Torvalds][linustorvalds] announced that he had
started working on a free operating system kernel 
specifically for the 386 CPU architecture and
his hardware.
This [kernel][kernel] would later be famously named Linux.
It's essential to understand that Linux
technically refers only to the kernel,
which handles startup, devices,
memory, resources, and more,
but does not provide user land
utilities—the kind of software
that people use on their computers.

Torvalds' motivation for this project was
both to learn about OS development and
to have access to a Unix-like system.
He already had access to an Unix-like
system called [MINIX][minix],
but MINIX was limited by technical and
copyright restrictions.
Interestingly, Torvalds has stated that if a
BSD or GNU Hurd operating system were
available at that time,
he might not have created the Linux kernel at all. 
However, he and others took the
GNU utilities and created what is
now widely referred to as Linux or GNU/Linux.
This amalgamation of Torvalds' kernel and
GNU utilities marked a critical point
in the evolution of free and open-source software, 
fostering a global community of developers and users.

## Distributions, early 1990s through today

Soon after the development of Linux in the early 1990s,
a trend began to emerge that continues to this day. 
Enthusiasts and developers started creating
their own Linux and GNU-based operating systems, 
customizing them to suit various needs and preferences. 
They would then distribute these customized
versions to others,
sharing their innovations and insights with a
wider community.
As a result of this practice,
these Linux operating systems became
known as "distributions."
This phenomenon has led to a rich ecosystem of
Linux distributions,
catering to different user bases,
industries, and interests, and
has played a central role in the
continued growth and
diversification of open-source computing.

The two oldest distributions that are still in
active development include:

  - [Slackware][slackware]
  - [Debian][debian]

## Short History of BSD, 1970s through today

The history of Berkeley Software Distribution (BSD)
spans from the 1970s to today and is closely
intertwined with the evolution of Unix.
Early Unix version numbers 1-6
eventually led to the development of BSD versions 1-4.
By the time of BSD 4.3,
all versions still contained some AT&T code.
A desire to remove this proprietary code led to the 
creation of BSD Net/1.

The effort continued until all AT&T
code was successfully removed by BSD Net/2.
This version was then ported to the Intel 386
processor, resulting in 386BSD,
made available in 1992,
a year after the Linux kernel was released.

386BSD eventually split into two distinct projects:
[NetBSD][netbsd] and [FreeBSD][freebsd].
Later, NetBSD itself split into another project,
giving rise to [OpenBSD][openbsd].
All three of these BSDs are still in
active development today,
and each has a unique focus:

- **NetBSD** is known for its focus on portability, finding
  applications in various environments such as MacOS and even
  NASA projects.
- **FreeBSD** is recognized for its wide applicability and has
  been utilized by notable companies and products like WhatsApp,
  Netflix, PlayStation 4, and MacOS.
- **OpenBSD** emphasizes security and has contributed several
  essential applications in this domain.

This intricate journey of BSD,
marked by splits, adaptations, and varied focuses,
has cemented its place in the history of
operating systems,
allowing it to cater to a wide range of
applications and audiences.

> MacOS is based on [Darwin][puredarwin],
> is [technically UNIX][unix], and is
> partly based on FreeBSD with some code
> coming from the other BSDs.
> See [Why is macOS often referred to as 'Darwin'?][whydarwin]
> for a short history.

## Short History of GNU, 1980s through today

The history of GNU,
particularly the GNU Hurd kernel,
traces back to the 1980s and continues to evolve today. 
The GNU Hurd, despite its long development process, 
remains in a pre-production state.
The latest release of this kernel was version 0.9,
which came out in December 2016.
Even though it has not yet reached full maturity,
a complete operating system based on the GNU Hurd
can be downloaded and run.
For example,
[Debian GNU/Hurd][debianhurd]
represents one such implementation.
This ongoing work on the GNU Hurd exemplifies
the free and open-source community's
commitment to innovation and collaboration,
maintaining a spirit of exploration that has
driven the software landscape for decades.

## Free and Open Source Licenses

In the free software and open source landscape,
there are several important free and/or open source
licenses that are used.
The two biggest software licenses are
based on the software used by GNU/Linux
and the software based on the BSDs.
They each take very different approaches to free
and/or open source software.
The biggest difference is this:

- Software based on software licensed under the GPL
must also be licensed under the GPL.
This is referred to as [copyleft][copyleft] software,
and the idea is to propagate free software.
    - [GNU General Public License (GPL)][gnugpl]
- Software based on software licensed under the BSD
license may be closed source and
primarily must only attribute the original source code and author.
    - [BSD License][bsdlicense]

[bfox]:https://opuslogica.com/
[billjoy]:https://en.wikipedia.org/wiki/Bill_Joy
[BSD]:https://en.wikipedia.org/wiki/Berkeley_Software_Distribution
[bsdlicense]:https://opensource.org/licenses/BSD-3-Clause
[copyleft]:https://www.gnu.org/licenses/copyleft.en.html
[debian]:https://www.debian.org/
[debianhurd]:https://www.debian.org/ports/hurd/
[ed1]:https://en.wikipedia.org/wiki/Ed_(text_editor)
[fourfreedoms]:https://www.gnu.org/philosophy/free-sw.html
[freebsd]:https://www.freebsd.org/
[gnugpl]:https://www.gnu.org/licenses/gpl-3.0.en.html
[gnuhurd]:https://www.gnu.org/software/hurd/
[gnuproject]:https://www.gnu.org/gnu/gnu.html
[kernel]:https://www.kernel.org/
[linustorvalds]:https://www.cs.helsinki.fi/u/torvalds/
[minix]:https://www.minix3.org/
[netbsd]:https://www.netbsd.org/
[nvi]:https://sites.google.com/a/bostic.com/keithbostic/vi/
[openbsd]:https://www.openbsd.org/
[puredarwin]:http://www.puredarwin.org/
[ritchie]:https://www.bell-labs.com/usr/dmr/www/
[slackware]:http://www.slackware.com/
[stallman]:https://en.wikipedia.org/wiki/Richard_Stallman
[thompson]:http://cs.bell-labs.co/who/ken/
[unix6]:https://en.wikipedia.org/wiki/Berkeley_Software_Distribution
[unix]:https://www.opengroup.org/membership/forums/platform/unix
[vim]:https://www.vim.org/
[whydarwin]:https://apple.stackexchange.com/questions/401832/why-is-macos-often-referred-to-as-darwin
