# Learning the Command Line

In this section, our focus is learning the command line environment, how to use it, and what it offers.

It's more common for people to learn how to use a computer via a graphical user interface (GUI).
Yet, GUIs are not well suited for servers.
There are a few reasons for this.
First, GUIs entail extra software.
The more software we have on a server, the more resources that software consumes,
the more software that needs to be managed, and the more we expose our systems to security risks.
You could therefore imagine how problematic it would be for a company to manage thousands of servers if all those servers had GUIs installed on them.
Second, GUIs do not provide a good platform for automation (aka, scripting), at least not remotely as well as command line interfaces (CLIs) do.
It's because of this and for other reasons, we will learn how to use the CLI.

Learning the CLI has other benefits.
Using the command line means using a [shell][shell], and using a shell means programming a computer.
Thus, while this book does not spend much time on *programming* per se, you will by default be programming just by using the CLI.
Using the CLI also removes a lot of [abstractions][desktop_metaphor] that GUIs introduce.
These abstractions, or metaphors, obfuscate how computers function even if they make using computers easier, which is debatable.
Thus, by learning the CLI, you'll gain a better understanding how computers work.

Fortunately, Linux and many other Unix-like operating systems have the ability to operate without graphical user interfaces.
This is partly the reason why these operating systems have done so well in the server market.
Let's get started!

[shell]:https://en.wikipedia.org/wiki/Unix_shell
[desktop_metaphor]:https://en.wikipedia.org/wiki/Desktop_metaphor
