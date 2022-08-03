## File Attributes

Let's take a look at file attributes. Often we'll have to change the file permissions and owners of a file. This will become really important when we create our web servers.

1. ``chmod`` for changing file permissions (or file mode bits)
1. ``chown`` for changing file owner and group

We use ``chmod`` to change the file permissions:

```
# Make a file readable and writer for user:
chmod u+rw file.txt

# Make a file executable for user and group:
chmod ug+x file.sh

# Make a file readable by the world:
chmod o+r file.html
```

Let's change the ownership of a file so that it's owned by a group we're in:

```
chown sean:sis_fac_staff file.sh

# Let's make it read only for the group:
chmod g-wx+r file.sh
```

### Conclusion

In this demo, we looked at two ways to change the attributes of a file. This includes changing the ownership of a file and the read, write, and execute permissions of a file.

The commands we used to change these attributes include:

- ``chmod`` : for changing file permissions (or file mode bits)
- ``chown`` : for changing file ownwership
