# Google Cloud CLI Assignment

For more details, see:
[Google Cloud Essentials](https://www.cloudskillsboost.google/course_sessions/6189322/labs/403395)

At the beginning of the semester,
each of you installed the `gcloud` software
are your personal computers.
You have continuously used the `gcloud`
software to connect to your virtual instances.

The `gcloud` command is much more powerful.
In this tutorial,
I'll show you how to use the `gcloud` command
to create a virtual instance.
After you practice this,
I would like you to **adapt**
the instructions on how to
[Set Up Network and HTTP Load Balancers](https://www.cloudskillsboost.google/course_sessions/6189322/labs/403400).
When completed,
take a screen shot of the list of
your Google Cloud instances.
As you create the load balancer,
keep notes in your GitHub repository.
Use Markdown to format your notes.
Be sure to adapt the instructions and
provide some context as you write them out.
Submit a link to your GitHub notes
on creating and setting up the load balancers.

## Getting Started with `gcloud`

Do this from your computer's command line,
and not from you virtual machine.

### List authorized users

The `gcloud` commands can do quite a bit of work,
and since they are commands,
they can be automated using scripts.
Thus, even though in the following steps
I'm only going to create a single machine,
you can see how through automation
I could create dozens, hundreds, or even more
virtual instances.

First, let's get some basic information.
The following command lists the
default account that I'm using with Google Cloud:

```
gcloud auth list
```

### List the default project

You can work with multiple projects.
For example,
I used Google Cloud for a different class,
but I have a separate project for that.
Therefore, we might want to confirm our
default project, and
get its project ID.

```
gcloud config list project
```

We can use command substitution and
a slightly different `gcloud` command
to save the project ID to a variable named
**PROJECT_ID**.

```
export PROJECT_ID=$(gcloud config get-value project)
```

### List the default zone

Since we can work with multiple zones
around the world,
we want to make sure we use a zone
that's geographically near us.
Here we get the default zone:

```
gcloud config list zone
```

Again, we can modify that command
and save the output to a variable
using command substitution:

```
export ZONE=$(gcloud config get-value compute/zone)
```

### Create a new virtual instance

Using the `gcloud` command,
we can now create a new virtual instance.
The end of this command takes advantage
of the **$ZONE** variable that we declared above.
If your system (perhaps Windows??) saves
variables differently,
just use the value for the variable instead
of the variable name:

```
gcloud compute instances create debian23 --machine-type e2-medium --zone="$ZONE'
```

The above command created a virtual instance
based on the Debian distribution of Linux,
which is the default used by Google Cloud.
**debian23** is simply a unique name
I chose for this virtual instance.

You can confirm that the new instance
was created in your Google Cloud Console.

### SSH into the new virtual instance

Now we can use the `gcloud compute ssh` command
to connect to our new virtual instance:

```
gcloud compute ssh --zone "$ZONE" "debian23" --project "$PROJECT_ID"
```

After you have successfully worked through this,
feel free to delete the machine to avoid incurring
any costs.

Your goal is to follow and adapt the steps
outlined in the
[Set Up Network and HTTP Load Balancers](https://www.cloudskillsboost.google/course_sessions/6189322/labs/403400).
