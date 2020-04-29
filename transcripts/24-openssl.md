# OpenSSL for HTTPS

Let's create and install a self-signing certificate for SSL connections.

Here we follow the instructions per the [Fedora documentation][1] and we're
using the **mod ssl** method.

Let's create a certificate for our site.

Instructions: [https://fedoraproject.org/wiki/Https#openssl][2]


```
sudo openssl genrsa -out csbhome.key 2048
sudo openssl req -new -key csbhome.key -out csbhome.csr -sha512
sudo openssl x509 -req -days 365 -in csbhome.csr -signkey csbhome.key -out csbhome.crt -sha512
sudo cp csbhome.crt /etc/pki/tls/certs/
sudo cp csbhome.key /etc/pki/tls/private/
sudo cp csbhome.csr /etc/pki/tls/private/
sudo restorecon -RvF /etc/pki
chown root:root /etc/pki/tls/private/csbhome.csr
chown root:root /etc/pki/tls/private/csbhome.key
chown root:root /etc/pki/tls/certs/csbhome.crt
chmod 0600 /etc/pki/tls/private/csbhome.csr
chmod 0600 /etc/pki/tls/private/csbhome.key
chmod 0600 /etc/pki/tls/certs/csbhome.crt
```

Now let's set up Apache for SSL. Use the instructions [above][1] to guide your
edits of this file.

```
cd /etc/httpd/conf.d/
nano ssl.conf
```

Then restart Apache2:

```
sudo systemctl restart apache2
```

[1]:https://docs.fedoraproject.org/en-US/quick-docs/getting-started-with-apache-http-server/#mod-ssl-configuration
[2]:https://fedoraproject.org/wiki/Https#openssl
