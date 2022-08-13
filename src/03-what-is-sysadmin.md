# What is Systems Administration?

## Introduction

What is systems administration or
who is a systems administrator (or **sysadmin**)?
Let's start off with some definitions provided by
the [National Institute of Standards and Technology][nist]:

> An individual, group, or organization responsible for setting up and
> maintaining a system or specific system elements, implements approved secure
> baseline configurations, incorporates secure configuration settings for IT
> products, and conducts/assists with configuration monitoring activities as
> needed.

Or:

> Individual or group responsible for overseeing the day-to-day operability of a
> computer system or network. This position normally carries special privileges
> including access to the protection state and software of a system.

See: [Systems Administrator @NIST][sysadminNIST]

## Specialized Positions

In addition to the above definitions,
which broadly define the role,
there are a number of related or specialized positions.
We'll touch on the first three in this course:

- Web server administrator:
  - "web server administrators are system architects responsible for the
    overall design, implementation, and maintenance of Web servers. They may or
    may not be responsible for Web content, which is traditionally the
    responsibility of the Webmaster ([Web Server Administrator"
    @NIST][webadminNIST]).
- Database administrator:
  - like web admins, and to paraphrase above, database administrators are system
    architects responsible for the overall design, implementation, and
    maintenance of database management systems. 
- Network administrator:
  - "a person who manages a network within an organization. Responsibilities
    include network security, installing new applications, distributing software
    upgrades, monitoring daily activity, enforcing licensing agreements,
    developing a storage management program, and providing for routine backups"
    ([Network Administrator @NIST][netadminNIST]).
- Mail server administrator:
  - "mail server administrators are system architects responsible for the
    overall design and implementation of mail servers" ([Mail Server
    Administrators @NIST][mailadminNIST]).

Depending on where a system administrator works,
they may specialize in any of the above administrative areas, or
if they work for a small organization,
all of the above duties may be rolled into one position.
Some of the positions have evolved quite a bit over the last
couple of decades.
For example, it wasn't too long ago when organizations would
operate their own mail servers, but
this has largely been outsourced to third-party providers,
such as Google (via Gmail) and Microsoft (via Outlook).
People are still needed to work with these
third-party email providers, but
the nature of the work is different than operating
independent mail servers.

## Certifications

It's not always necessary to get certified
as a systems administrator to get work as one, but
there might be cases where it is necessary; for example,
in government positions or in large corporations.
It also might be the case that you can get work
as an entry level systems administrator and
then pursue certification with
the support of your organization.

Some common starting certifications are:

- [Red Hat Certified System Administrator (RHCSA)][redhatSysAdmin]
- [CompTIA Server+][comptiaServer]
- [CompTIA A+][compTIAAplus]

Plus, Google offers, via [Coursera][coursera], a
beginners [Google IT Support Professional Certificate][googleIT]
that may be helpful.

## Associations

Getting involved in associations and related
organizations is a great way to learn and
to connect with others in the field.
Here are few ways to connect.

[LOPSA][lopsa], or
The League of Professional System Administrators,
is a non-profit association that seeks to advance
the field and membership is free for students.

[ACM][acm], or the Association for Computing Machinery,
has a number of relevant
[special interest groups (SIGs)][acmSIGs]
that might be beneficial to systems administrators. 

[NPA][npa], or the Network Professional Association,
is an organization that "supports IT/Network 
professionals."

## Codes of Ethics

Systems administrators manage computer systems
that contain a lot of data about us and
this raises privacy and competency issues,
which is why some have created code of ethics statements.
Both LOPSA and NPA have created such statements
that are well worth reviewing and discussing.

- LOPSA: [Code of Ethics][coeLOPSA]
- NPA: [Code of Ethics][coeNPA]

## Keeping Up

Technology changes fast.
In fact, even though I teach this course
about every year,
I need to revise the
course each time, sometimes substantially,
to reflect changes that have developed
over short periods of time.
It's also your responsibility,
as sysadmins,
to keep up, too.

I therefore suggest that you continue your
education by reading and practicing.
For example, there are lots of books on 
systems administration.
[O'Reilly][oreillySysAdmin] continually
publishes on the topic.
RedHat,
the makers of the Red Hat Linux distribution,
and sponsors of [Fedora Linux][fedora] and
[CentOS Linux][centos],
provides the [Enable Sysadmin][enableSysadmin] site,
with new articles each day,
authored by systems administrators,
on the field.
Opensource.com, also supported by Red Hat,
[publishes articles on systems administration][opensourceSysAdmin].
[Command Line Heroes][clh] is a fun and
informative podcast on technology and
sysadmin related topics.
[Linux Journal][linuxjournal] publishes great articles
on Linux related topics.

## Conclusion

In this section I provided definitions of systems administrators
and also the related or more specialized positions,
such as database administrator, network administrator,
and others.

I provided links to various certifications you might
pursue as a systems administrator, and
links to associations that might benefit you and career.

Technology manages so much of our daily lives, and
computer systems store lots of data about us.
Since systems administrators manage these systems,
they hold a great amount of responsibility
to protect them and our data.
Therefore, I provided links to two code of ethics
statements that we will discuss.

It's also important to keep up with the technology,
which changes fast.
The work of a systems administrator is much different
today than it was ten or twenty years ago, and
that surely indicates that it could be much different in
another ten to twenty years.
If we don't keep up,
we won't be of much use to the people we serve.
  
[comptiaServer]:https://www.comptia.org/certifications/server
[redhatSysAdmin]:https://www.redhat.com/en/services/certification/rhcsa
[compTIAAplus]:https://www.comptia.org/certifications/a
[googleIT]:https://www.coursera.org/professional-certificates/google-it-support
[coursera]:https://www.coursera.org/
[nist]:https://www.nist.gov/
[sysadminNIST]:https://csrc.nist.gov/glossary/term/system_administrator
[webadminNIST]:https://csrc.nist.gov/glossary/term/web_server_administrator
[netadminNIST]:https://csrc.nist.gov/glossary/term/network_administrator
[mailadminNIST]:https://csrc.nist.gov/glossary/term/mail_server_administrator
[lopsa]:https://lopsa.org/AboutLOPSA
[acm]:https://www.acm.org/
[acmSIGs]:https://www.acm.org/special-interest-groups/alphabetical-listing
[npa]:http://www.npa.org/
[coeLOPSA]:https://lopsa.org/CodeOfEthics
[coeNPA]:https://www.npa.org/public/about_codeofethics.cfm
[centos]:https://centos.org/
[fedora]:https://www.linuxjournal.com/
[linuxjournal]:https://www.linuxjournal.com/
[oreillySysAdmin]:https://www.npa.org/public/about_codeofethics.cfm
[enableSysadmin]:https://www.redhat.com/sysadmin/
[opensourceSysAdmin]:https://opensource.com/tags/sysadmin
[clh]:https://www.redhat.com/en/command-line-heroes
