# Quick SSH Connect

Later in the semester, each of you will install virtual machine software so that you can install a Linux operating system and manage it on your own computer. Until then, we will need to connect to a remote server in order to acquire some basic Linux command line skills. To do that, we will use what is called [SSH][1], or [Secure Shell][4].

How you use SSH will depend on which operating system or OS version you are using. If you are using a macOS computer, then everything I do in this video will be exactly the same for you. Use SpotLight to search for the *terminal.app* and open it. You will see a command line prompt similar to mine (although by default, I think macOS uses black text on a white background, but you can configure this in the app preferences).

If you are on a Windows machine, then I hope you are using version 10. If so, then you can install a *SSH client*. I don't use Windows and can't create a video for you, but I found one that looks pretty helpful. Follow the instructions in that video and see if it works for you. Alternatively, below is a link to some other instructions. I am not sure which one is more current, but between the two, you should be able to figure it out:

- [How to enable and install Built-in SSH in Windows 10 using the windows command prompt or powershell][2]
- [How to Enable and Use Windows 10’s New Built-in SSH Commands][3] 

If neither of those work for you, then you should install [PuTTY][5]. This is a great app, and since it's available on Linux, I will show you how to use it in this video.

## Linux and macOS

- Open terminal
- type: ``ssh username@ip-address``
- Enter your password
- type ``less README``
- press ``q``
- type ``exit`` to exit the session

## Windows with PuTTY

- Open PuTTY
- Enter IP Address in field marked *Host Name (or IP address)
- Click Open at the bottom
- Enter your username at the prompt: ``login as: ``
- Enter your password
- type ``less README``
- press ``q``
- type ``exit`` to exit the session

## PuTTY Configuration

If you use PuTTY, then you can configure font size and screen colors, if you want. The default font size is too small for me, and so that's something I'd change right away. To change the font size, in the PuTTY window:

- Click on *Fonts* under the *Window* category
- Click on *Change...* next to the item labeled *Font used for ordinary text*. 
- Select the font and size that you prefer

## The End

That's all for today. Keep these notes and next week we start to connect to our remote Linux server in order to learn some command line basics.


[1]:https://en.wikipedia.org/wiki/Secure_Shell
[2]:https://www.youtube.com/watch?v=xIfzZXHaCzQ
[3]:https://www.howtogeek.com/336775/how-to-enable-and-use-windows-10s-built-in-ssh-commands/
[4]:https://www.openssh.com/
[5]:https://www.chiark.greenend.org.uk/~sgtatham/putty/
