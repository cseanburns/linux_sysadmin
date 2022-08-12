## Changing the ``hostname``

The ``hostname`` of a system is the label it uses to identify itself
to others (humans) on a (sub)network. If the hostname is on the web (or
the internet), it may also be part of its of the fully qualified domain
name (FQDN), which we studied during the DNS and networking weeks. For
example, on a server identified as **enterprise.example.net**, then
**enterprise**, is the hostname, **example.net** is the domain name,
and **enterprise.example.net** is the fully qualified domain name. If
two computers are on the same subnet, then they can be reachable via
the hostname only, but the domain name is part of the DNS system and is
required for two computers on the broader internet to reach each other.

We're going to check and set the system ``hostname`` on our Fedora
(virtual) machines using the ``hostname`` and ``hostnamectl`` commands:

Check the default hostname:

```
# hostname
localhost.localdomain
```

To change the default hostname from **localhost**, use the ``hostnamectl``
command to update the system's hostname per the file. My new hostname
will be **enterprise**.  You can name your hostname whatever you want,
but be sure it's a single word with no punctuation.

```
hostnamectl set-hostname enterprise
hostname
cat /etc/hostname
```

We can access our site by hostname rather than by IP:

```
w3m http://enterprise
```

### Optional

After you've completed the above steps, do the following:

1. On your host machine, find your OS's version of ``/etc/hosts``. 
    - Windows instructions: [https://gist.github.com/zenorocha/18b10a14b2deb214dc4ce43a2d2e2992][windowshosts].
    - macOS users can edit their ``/etc/hosts`` file.
1. Map your guest IP address (your Fedora IP) to your new hostname:

    ```
    192.168.4.31 enterprise
    ```

Then, in your Firefox, Chrome, or whatever browser, visit your new
website and replace **enterprise** with the hostname that you chose for
your guest OS:

```
http://enterprise
```

