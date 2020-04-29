To read about the ``test`` command:

```
help test | less
```

This will print "yes" because the second command runs regardless of the output
of the first command:

```
[[ -a homework.txt ]] ; echo "yes"
```

To make the second command run **if and only if** the first command succeeds, we use the Boolean **AND** operator, which is implemented with two ampersands: ``&&``:

```
[[ -a homework.txt ]] && echo "yes"
```

Test if one file is newer or older than an other:

```
[[ file.txt -nt file2.txt ]] && echo "yes"
```

To test if a number is greater or lesser than another number:

```
[[ $(expr 4 + 3) -gt $(expr 2 + 1) ]] && echo "yes"
```

To test the Boolean **NOT** operator, we use two vertical bars: ``||``. This
will create the file *homework.txt* if and only if the file **does not** exist:

```
[[ -a homework.txt ]] || touch homework.txt
```
