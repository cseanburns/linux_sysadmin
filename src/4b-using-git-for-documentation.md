## Using Git for Documentation

Managing and documenting complex systems is a challenge, but
it's essential to keep a record of how we change or alter our systems,
how we configure them,
and how we automate them.
It's essential because we administer systems for ourselves and for others, and
keeping records allows us to build off our prior work.
Maintaining documentation is also an important part of identifying points of failure in our systems.
For example, we might change some configuration files, and
one of those changes might lead to an eventual system failure.
Documenting our changes can help us track and identify the culprit file and the location in that file
in such a scenario.

Documentation in systems administration generally therefore covers several areas.
It includes configuration files, automation scripts, server deployment guides, and maintenance procedures.
It therefore serves as a crucial reference point for teams; i.e.,
it ensures consistency in system management and eases the onboarding process for new administrators.

We use Git because Git is robust, versatile, and widely used.
Specifically, it's is a distributed version control system used to track changes and
manage versions of text files.
Although it is more commonly used for software developers, it's not limited that usage.

In this section, we learn how to use Git to maintain and enhance documentation in a sysadmin context.
This will only be an intro to Git, but key areas of discussion include:

- Utilizing Git for version control of configuration files and scripts.
- Employing best practices for documenting system configurations.

### Understanding File Naming Conventions

First, it's important to standardize around file naming, especially for newly created files.
File naming is a fundamental aspect of organizing and maintaining a clear documentation system, and
adhering to a consistent naming convention is crucial for several reasons:

1. **Clarity and Accessibility**: Well-named files are easier to identify and
   understand at a glance, saving time and reducing confusion.
2. **System Compatibility**: Certain characters in file names can cause issues
   in different operating systems. Avoiding spaces and special characters
   ensures broader compatibility.
3. **Ease of Navigation**: Consistent naming aids in navigating through files,
   especially in a large directory or Git repository.
4. **Version Control**: Clear naming helps in tracking changes and managing
   versions more effectively.

When naming files, it's best to follow the guidelines below,
where I use the `md` extension to identify these files as Markdown files.
But regardless of file type, these guidelines are broadly applicable to all file naming:

- Use single words or combine words using camelCase, underscores (`_`), or hyphens (`-`). For example:
    - `ServerSetupGuide.md`,
    - `server_setup_guide.md`, or
    - `server-setup-guide.md`.
- Avoid spaces because they can cause issues in URLs and command-line operations. For example, do not name a file like this:
    - server setup guide.md
- Steer clear of special characters in file names, such as `!`, `$`, `#`, `%`, etc. These characters might have specific functions in certain environments or scripts, like the Bash shell.

#### Use Markdown

When documenting your system or some process, use Markdown format your documentation.
Markdown is a widely used markup format, and
files written in Markdown can be easily converted to HTML, DOCX, PPTX, PDF, and more.
Plus, if you use GitHub, files written in Markdown will automatically render into HTML.

### Basic Markdown Tutorial

Here's a quick guide to the most commonly used Markdown syntax, but
also see [Markdown Guide][markdown_guide].

#### Headings

Headings are created using the `#` symbol before your text.
The number of `#` symbols indicates the level of the heading:

```
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

Use the Heading 1 only once in a document, and then other heading levels for sections and subsections.
As an example:

```
# Apache Web Server Documentation

Some introductory text here.

## Installing Apache

Some text on installing Apache here.

## Configuring Apache

Some text on configuring Apache here.

## Starting Apache

Some text on starting Apache here.
```

#### Emphasis

- **Bold**: To make text bold, wrap it in double asterisks or double
  underscores. For example, `**bold**` or `__bold__`.
- *Italic*: To italicize text, wrap it in single asterisks or single
  underscores. For example, `*italic*` or `_italic_`.

#### Lists

- **Unordered Lists**: Use asterisks, plus signs, or hyphens to create bullet points.
- Nest lists using extra indentation.

  ```
  * Item
  * Item
    * Subitem
    * Subitem
  ```

- **Ordered Lists**: Use numbers followed by periods for an ordered list.

  ```
  1. First item
  2. Second item
     1. Subitem 2.1
     2. Subitem 2.2
  ```

- Ordered Lists: Alternate numbered and lettered lists:


  ```
  1. First item
  2. Second item
     a. Subitem 2.a
     b. Subitem 2.b
  ```

- Ordered Lists: Alternate numbered and unordered lists:

  ```
  1. First item
  2. Second item
     - Subitem
     - Subitem
  ```

#### Links and Images

- **Links**: To create a link, wrap the link text in brackets `[ ]`, and then
  wrap the URL in parentheses `( )`. 
    - For example, `[GitHub](https://github.com)`
- **Images**: Use similarly to links, but start with an exclamation mark, followed by
  the alt text in brackets, and the URL in parentheses. The `URL` is simply the location to the file. It can be a location in your current directory or a location on the web.
    - For example, `![Alt text](image-url.jpg)`
    - For example, `![Alt text](http://example.com/images/image-url.jpg)`

#### Code

- **Inline Code**: For small bits of code, use backticks to wrap your code. For example, `` `code` ``.
- **Code Blocks**: For larger sections of code, use three backticks or indent with four spaces.

  \```language
  your code here
  \```

Replace `language` with the programming language for syntax highlighting
(e.g., `python`, `javascript`) on some platforms.

#### Blockquotes

To create a blockquote, use the `>` symbol before your text.
For nested blockquotes, use multiple `>` symbols.

```markdown
> This is a blockquote.
>> This is a nested blockquote.
```

#### Horizontal Rules

Create a horizontal line or rule by using three or more asterisks, dashes, or
underscores on a new line.

```markdown
---
```

#### Additional Tips

- **Whitespace and Line Breaks**: To create a new line without starting a new paragraph by
  ending a line with two or more spaces before hitting Enter.
- **Escaping Markdown**: To display a Markdown character, precede it with a
  backslash (`\`). For example, `\*not italic\*`.

Markdown's makes formatted text simple and readable, and
is thus a great choice for for documentation and note-taking.
As you become more comfortable with these basics,
you'll find it a versatile tool for your writing needs.

## Using Git

### Check Installed

To begin to use `git`, log in to your remote system, and make sure `git` installed with the `which` command:

```
which git
```

If the output produces a path to `git`, like `/usr/bin/git`, then it's installed.

If it's not installed, then you can install it with the `apt` command:

```
sudo apt install git
```

### Configuring Git

**Note:** The following `git` tutorial is based on the [Git Documentation][git_docs].

First we want to configure `git` so that when we create or change files,
it can track who made those changes.
We do that with the `git config` command.
We configure `git` by inputting our name:

```
git config --global user.name "Sean Burns"
```

And then we add our email address:

```
git config --global user.email sean@example.com
```

> Use your personal email address and not your work or university email address.
> That way, it'll be easier to maintain your repository over the long run if you decide later to use a service like GitHub. 

### Creating and Initializing a Project

We absolutely **do not want Git to manage our home directory**, but
we do want it to manage a project directory in our home directory.
Let's start off by creating a directory for our project.
I'll call my directory `docs`, but you can use any name.
Be sure to use a good name (no spaces, no special characters, etc.):

```
mkdir ~/docs
```

Then change to the `docs` directory:

```
cd ~/docs
```

Next we initialize the project directory, which places all content in this directory under revision control:

```
git init
```

If you run the `ls -a` command, you will see a new hidden directory called `.git`.
In most cases, you don't do anything with this directory.
It's mainly where `git` keeps tabs of changes in your project directory.

### Adding Content

Using your text editor of choice, create a new file.
In the following example, I'll create and open a file called `lamp.md` using the `vim` text editor.
Use whichever text editor you like.
Be sure you're still in your project directory.

```
vim lamp.md
```

Add some content, and then save and exit.
I'll add just a simple header line:

```
# LAMP Documentation
```

We can use the `git status` command to view how `git` sees the changes:

```
git status
```

Read the output closely.
The output names your branch, notes that changes have not been staged,
instructs you how to stage them (`git add`), instructs you how to undo the changes
(`git restore <file>`), and tells you which files have been modified.

Now we can instruct `git` to stage the new content, which means that `git` takes a snapshot of the changes:

```
git add lamp.md
```

The `git add` command **stages** the new content.
Run the `git status` command again, and it shows you which files have been staged and need to be committed.
It also shows the command to undo the staged changes (`git restore --stage <file>`).

We permanently track the content using the `git commit -m` command.
The `-m` option allows us to enter a commit message, which is placed inside quotes.
This message should be relatively brief, but it should describe the changes you made:

```
git commit -m "created lamp.md doc file and added header info"
```

Finally, running the `git status` command will show that there's nothing to commit, aka, all is done.

### Tracking Changes

Now that we've made a commit to our project, we can use the `git log` command to view our `git` history:

```
git log
```

We can see how this log changes when we edit our file.
In the example below, I re-open the file and add a date to it:

```
vim lamp.md
```

Add date to file, then save and exit:

```
# LAMP Documentation

August 24, 2025
```

Re-stage the new content:

```
git add lamp.md
```

> If you have made changes to multiple files, you can name all the files with `git add`,
> like so: `git add file1.md file2.md file3.md`, or you can make changes to all files at once:
> `git add .`

Before committing the content, you can see a **diff** of the changes:

```
git diff --cached
```

If satisfied, you can now commit the changes:

```
git commit -m "added date to file"
```

Now you can see the new commit message in the logs:

```
git log
```

You can see the difference between the changes in the file with the following command:

```
git log -p
```

And you can view a more detailed summary of commits:

```
git log --stat --summary
```

### Undoing Committed Changes

As seen above, the following two commands are useful for undoing changes before files are committed.
Specifically, the following command undoes a change after it's been modified (e.g., saved in a text editor):

```
git restore <file>
```

You can see how files were modified with `git diff`.
In the following command, you can see how unstaged content has changed based on the prior commit:

```
git diff HEAD
```

And the following command undoes a change after it's been staged with `git add <file>`:

```
git restore --stage <file>
```

After staging a file, you can use the `git diff` command to see how content has changed in a file:

```
git diff --cached
```

If we need to undo a change after content has been committed with `git commit -m`,
then we have to use the `git reset` command.
This makes sense when you view the output of `git log`, which only shows changes that have been committed,
and not changes to files that have simply been modified or staged.
When content has been modified and committed, the changes have become part of the version history.
Thus to undo a committed change, we have to undo the history that `git` tracks.
In some cases, especially when collaborating with others, this can have serious implications,
which is why we have a separate command for undoing commits.

There are several ways to undo a commit with `git reset`.
To undo the most recent commit, we can use the following command:

```
git reset --soft HEAD~1
```

Or to undo the two most recent commits, we change the number to 2:

```
git reset --soft HEAD~2
```

With the `--soft` option, all changes to files remain, but the commit history is cleared.

We can use the following command to undo changes permanently:

```
git reset --hard <commit_numer>
```

The commit number can be found in the output of `git log`, and we only need the first eight digits:

```
git log
```

And the output is something like:

```
commit 048cd90e48036b82667e46d5b2ded21fa86c0e80 (HEAD -> main)
Author: Sean Burns <email@example.com>
Date: Sun Aug 24 10:58:50 2025 --400

    <commit message>

commit 0062b4c187b8096857373f7880315e8e9aa8ce9c
Author: Sean Burns <email@example.com>
Date:   Sun Aug 24 10:54:34 2025 -0400

    created lamp.md doc file and added header info
```

To revert back to the first commit:

```
git reset --hard 0062b4c1
```

Now, all changes to the file have been undone except for the changes made when the file was first created.
We can see that with the following `git log` command:

```
git log
```

Output:

```
commit 0062b4c187b8096857373f7880315e8e9aa8ce9c
Author: Sean Burns <email@example.com>
Date:   Sun Aug 24 10:54:34 2025 -0400

    created lamp.md doc file and added header info
```

Before we reset the version history, you can use `git diff` with those commit numbers.
In the following, I compare a prior version with the most recent commit ("HEAD"):

```
git diff 048cd90e HEAD
```

### Git Workflow

The benefit of `git` is in developing a workflow with it.
Basically, for a single person, we follow these steps:

For a new project:

1. `mkdir project_directory` : create a new project directory
2. `cd project_directory` : change to the new project directory
3. `git init` : initialize project directory

`git init` only needs to be run once.
Afterwards, for working in that project directory:

1. Edit a text file with your text editor of choice, and save and quit the editor when done.
2. `git add <file>`
3. `git commit -m "commit message"

If necessary, use the undo commands when or if necessary:

1. `git restore <file>` : after editing
2. `git restore --stage <file> : undo after staging with `git add`
3. `git reset --soft HEAD~1` : undo the most recent commit, saving all changes to files
4. `git reset --hard <commit_number> : undo to the commit number (based on `git log`), undoing all file changes

## Conclusion

In summary, Git is powerful tool for documentation and version control.
For sysadmins, `git` is useful for managing configuration files, automation scripts,
server deployment guides, maintenance procedures, and probably more.

Remember to:

1. Adhere to clear file naming conventions.
2. Use Markdown formatting for structuring and documenting content in files.

And most importantly, start documenting everything with a `git` based workflow.

[markdown_guide]:https://www.markdownguide.org/
[git_docs]:https://git-scm.com/docs/gittutorial
