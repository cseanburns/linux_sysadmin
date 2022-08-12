# Linux Systems Administration

Author: C. Sean Burns  
Date: 2022-08-12  
Email: [sean.burns@uky.edu](sean.burns@uky.edu)  
Website: [cseanburns.net](https://cseanburns.net)  
Twitter: [@cseanburns](https://twitter.com/cseanburns)  
GitHub: [@cseanburns](https://github.com/cseanburns)  

## Introduction

This short book was written for my
Linux Systems Administration course.
The book and course's goals are to
provide the very basics about systems
administration using Linux, and
to teach students:

1. how to use the command line in order to become more efficient computer users
   and more comfortable with using computers in general;
2. how to use command line utilities and programs and to learn what they can
   accomplish using those programs;
3. how to administer users and manage software on a Linux server;
4. how to secure a Linux server; and
3. the basics of cloud computing;

And finally, this book/course ends on walking students
through the process of building a [LAMP stack][lampWikipedia].

## About This Book

Since I use this book for my Linux Systems Administration course,
which I teach each fall semester,
this book will be a live document.
I will update the content as I teach it in order
to address changes in the technology and to
edit for clarity when I discover some aspect
of the book causes confusion or
does not provide enough information.

This book is not a
comprehensive introduction to Linux nor
to systems administration.
It's designed for an entry level course on these topics and
is focused on a select and small range of those topics that
have specific pedagogical aims (see above).

The book started off as a series of transcripts and
demonstrations.
It still has that focus, but
I've had a long-term goal to make these transcripts
more cohesive.
Achieving this became easier when I learned about
[mdBook][mdbook].

The conent in this book is open access and
licensed under the [GNU GPL v3.0][gplrepo].
Feel free to fork it on [GitHub][linuxSysAdmin] and
modify it for your own needs.

## History of This Course

I created and started teaching this course in the Fall 2016 semester.
I originally used Soyinka's (2016) excellent
introduction to Linux administration, and
we used VirtualBox and the Fedora Server distribution
to practice and learn the material.

However, around 2018 or '19,
I moved away from Soyinka's comprehensive book to
focus the material on a more limited range of topics.
I did this for two reasons.
First, most of my students do not
become systems administrators,
although some have (to my delight).
Second, my students have grown up using only
graphical user interfaces on one of the two common,
commercial operating systems, and
consequently have very constrained and limited understandings
of how computers work and what can be done with them.
In redesigning this course,
I wanted to strike a balance between these two problems.
I wanted students to acquire enough skills and
gain enough confidence to feel comfortable applying for 
(at least) entry level systems administrator jobs, and
more basically,
I wanted students to be exposed to a different
type of computing environment than what they were used to
and that fostered a hacking mentality,
[in the more benign and playful sense of the word][hackerJargon].

I moved us away from using
Fedora Server for the Fall 2022 course.
Fedora Server is a great and fun operating system, and
there's a lot to learn about Linux using it, but
it was too bleeding edge for me, and
that meant something would break in my demonstrations each year
I taught this course.
Thus, identifying what had changed in Fedora
each year made using it somewhat of a chore to keep up.
We have therefore switched to a less bleeding edge
distribution of Linux: the most recent
[Ubuntu Server LTS release][ubuntuLTS].
Based on my personal experience managing several servers
that run on some release of Ubuntu LTS,
I believe this should provide more stability.
It helps that Ubuntu Server has a big share of the
Linux server market.

The primary reason I moved us away from VirtualBox is because 
a good number of my students each year use Apple computers, and
this created a
major obstacle because of
[Apple's switch to the M1 chip][m1StackOverflow].
I originally considered asking those students
with Apple computers to use
different virtualization software, but
it was nice to have all students,
regardless of operating system, and myself using the
same software.
I also considered using something like [Docker][docker]
as a replacement, but
decided instead to use Google Cloud.
I figured that learning how to use a
service like Google Cloud might be more broadly useful
to students, and
that if we used Docker,
we'd have to spend a lot of time installing and
configuring that on their laptops.
We'll see how this goes this semester (Fall 2022).

## References

Soyinka, W. (2016). *Linux administration: A beginner's guide* (7th ed.). New
York: MacGraw Hill Education. ISBN: 978-0-07-184536-6

[lampWikipedia]:https://en.wikipedia.org/wiki/LAMP_(software_bundle)
[hackerJargon]:http://www.catb.org/jargon/html/H/hacker.html
[ubuntuLTS]:https://ubuntu.com/blog/what-is-an-ubuntu-lts-release
[m1StackOverflow]:https://apple.stackexchange.com/questions/422565/does-virtualbox-run-on-apple-silicon
[docker]:https://www.docker.com/
[mdbook]:https://github.com/rust-lang/mdBook
[linuxSysAdmin]:https://github.com/cseanburns/linux_sysadmin
[gplrepo]:https://github.com/cseanburns/linux_sysadmin/blob/master/LICENSE
