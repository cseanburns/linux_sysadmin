Basic steps to:

1. create a new user
2. create a new group
3. create a shared directory for the new group

```
# become root user
sudo su      

# create user account
useradd bfox

# create password for user bfox
passwd bfox

# create new group
groupadd bashclub

# add user sean to 'bashclub' group
usermod -aG bashclub sean

# add user bfox to 'bashclub' group
usermod -aG bashclub bfox

# check if sean is part of 'bashclub' group
groups sean

# check if bfox is part of 'bashclub' group
groups bfox

# change to /home directory
cd /home

# create the directory to be shared by bashclub 
mkdir bashclubfolder

# make bashclub group owner of bashclubfolder
chgrp -R bashclub bashclubfolder
chmod -R 2775 bashclubfolder

# check ownership
ls -l 
```

Now you can log in as either user and work in that shared directory!
