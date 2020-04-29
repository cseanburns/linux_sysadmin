# Apache2 User Directories

## Reset httpd.service to port 80

If you have not reverted to port 80, it's time to change the listening port to
80 from 8080 (per the first instructions on Apache2). Change it back to port 80
by editing ``/etc/httpd/conf/httpd.conf``. (Be sure to login as root or use the
``sudo`` command, as appropriate.)

```bash
# cd /etc/httpd/conf/
# nano httpd.conf
```

After changing the configuration file, close ``nano`` (or whatever text editor
you're using) and then restart ``httpd.service`` and see if it's successfully
running on port 80.

```bash
# systemctl restart httpd.service
# systemctl status httpd.service
# w3m http://127.0.0.1/
```

## Enable userdir (``$HOME/public_html`` sites)

Edit the ``userdir.conf`` file.

```bash
# cd /etc/httpd/conf.d/
# nano userdir.conf
```

Make the following changes:

- ``UserDir disabled`` to ``UserDir enabled``
- Uncomment line ``UserDir public_html``

After saving and exiting, restart ``httpd.service``:

```bash
# systemctl restart httpd.service
```

## Tasks

1. Exit out of root account
2. Go to your regular user's home directory
3. Make a directory titled ``public_html``
4. Change home directory permissions to 711
5. Change ``public_html`` directory permissions to 755

## SELinux

Now, because of SELinux, we need to set some SELinux switches. Using ``sudo``
or logging in as ``root``:

```bash
# setsebool -P httpd_enable_homedirs true
# chcon -R -t httpd_sys_content_t /home/sean/public_html
```

In the last line above, replace ``/home/sean/public_html`` with the correct
path for your regular user (i.e., you're not *sean*). Exit out of root if you
need to.

## Test

Now test to see if your ``public_html`` site is operational by simply visiting
the site. For me, I use the following command:

```bash
$ cd ~/public_html/
$ echo "<p>Hello world</p>" >> index.html
$ w3m http://127.0.0.1/~sean
```
