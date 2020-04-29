Today we'll examine and write out the following three scripts:

Script 1 is titled **studentcount.sh**:

```
#!/bin/bash

# Date: Thu Sep 12 2019
# Get a count of all members of the sis_students group

totalstudents=$(grep "sis_students" /etc/group | sed -e 's/:/\n/g' | tail -n1 | sed -s 's/,/\n/g' | wc -l)
printf "\nThere are $totalstudents student accounts.\n"
printf "\nThey include the following:\n"
printf "\n"
grep "sis_students" /etc/group | sed -e 's/:/\n/g' | tail -n1 | sed -e 's/,/\n/g' | pr -T -3
printf "\n"
```

Script 2 is titled **facstaffcount.sh**:

```
#!/bin/bash

# Date: Thu Sep 12 2019
# Get a count of all members of the sis_students group

totalfacstaff=$(grep "sis_fac_staff" /etc/group | sed -e 's/:/\n/g' | tail -n1 | sed -e 's/,/\n/g' | wc -l)
printf "\n"
printf "There are $totalfacstaff faculty or staff accounts.\n"
printf "\n"
printf "They include the following:\n"
grep "sis_fac_staff" /etc/group | sed -e 's/:/\n/g' | tail -n1 | sed -e 's/,/\n/g'
printf "\n"
```

Script 3 is titled **emailwho.sh**. The purpose of this script is to
help us avoid having to remember user account names when sending local
email via ``s-nail``. The script looks like this:

```
#!/bin/bash

# Search email addresses to get user account for specific person
# Date: Thu Sep 12 15:24:07 EDT 2019

# To use:
# s-nail -s "subject message" $(emailwho.sh [grep string])

lookup="/home/dropbox/addresses.csv"

grep -i "$1" "$lookup" | awk -F, '{ print $3}' | sed 's/"//g'
```

Importantly, the script searches the file **addresses.csv** that is
located in **/home/dropbox/**, a directory which you all have access to
and can use. The **addresses.csv** file looks like this:

```
"Allen, Brian David","bdal225"
"Bacon, Joshua R","jrba254"
"Carpenter, Eric Clark","ecca235"
"Carter Jr, Terald Ladon","tlca244"
"Dang, Thang Phuoc","tpda224"
"Edwards, Jonathan Tyler","jted222"
"Harrington, Andrew S","asha246"
"Johnson, Sydney McRae","smjo254"
"Kane, Cheick ","cka238"
"Karlen, Chase A","caka236"
"Kelly, Jalen T","jtke243"
"Lane, Derek", "drlane"
"Robinson, Wesley Scott","wsro223"
"Scholl, Samuel T","stsc227"
"Trivison, Dominic ","dtr227"
```

When we are on the *sised* server, we can use the above script with what's
called **Command Substitution** (search the Bash man page for details). That
is, we enclose our script command within ``$()`` and Bash will evaluate that
command first and use the output in the ``s-nail`` command. For example, to
email Cheick, we can do:

```
s-nail -s "test message" $(emailwho.sh cheick)
```

In preparation for additional Bash scripting, read through the links provided
in the Outline on this page:
[https://ryanstutorials.net/bash-scripting-tutorial/][1].

[1]:https://ryanstutorials.net/bash-scripting-tutorial/
