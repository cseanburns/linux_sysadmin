## Using Git and GitHub for Documentation

Managing and documenting complex systems is a challenge.
Effective documentation is a cornerstone of operational efficiency and reliability.
This lecture explores how Git, traditionally seen as tools for software developers,
is equally valuable for systems administrators for
documenting processes, scripts, and configurations.

Documentation in systems administration encompasses a broad spectrum.
It includes configuration files and scripts to
server deployment guides and maintenance procedures.
It can serve as a crucial reference point for teams,
which can ensure consistency in system management and
ease the onboarding process for new administrators.

Our focus on Git arises is motivated because Git is robust, versatile, and widely used.
Git is a distributed version control system, and
it excels in tracking changes and managing versions of any set of files.
This includes any text document.

In this lecture, we learn how to use this tool to maintain and enhance documentation
in a systems administration context.
This will only be an intro to Git, but key areas of discussion include:

- Utilizing Git for version control of configuration files and scripts.
- Employing best practices for documenting system configurations.

Learning Git will help streamline your documentation processes and
improve the overall efficiency and communication within your teams.

### Understanding File Naming Conventions

File naming is a fundamental aspect of organizing and maintaining a
clear and efficient documentation system.
Adhering to a consistent naming convention is crucial for several reasons:

1. **Clarity and Accessibility**: Well-named files are easier to identify and
   understand at a glance, saving time and reducing confusion.
2. **System Compatibility**: Certain characters in file names can cause issues
   in different operating systems. Avoiding spaces and special characters
   ensures broader compatibility.
3. **Ease of Navigation**: Consistent naming aids in navigating through files,
   especially in a large repository.
4. **Version Control**: Clear naming helps in tracking changes and managing
   versions more effectively.

When naming files, it's best to follow these guidelines:

- Use single words or combine words using camelCase, underscores (`_`), or
  hyphens (`-`). For example:
      - `ServerSetupGuide.md`,
      - `server_setup_guide.md`, or
      - `server-setup-guide.md`.
- Avoid spaces because they can cause issues in URLs and command-line operations.
- Steer clear of special characters like `!`, `$`, `#`, `%`, etc. because they
  might have specific functions in certain environments or scripts.

#### Use Markdown

Use Markdown for formatting your documentation.
Markdown is a widely used markup format.
Files written in Markdown can be easily converted to HTML, DOCX, PPTX, PDF, and more.
Plus, if you use GitHub, files written in Markdown will automatically be
rendered into HTML.

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

#### Emphasis

- **Bold**: To make text bold, wrap it in double asterisks or double
  underscores. For example, `**bold**` or `__bold__`.
- *Italic*: To italicize text, wrap it in single asterisks or single
  underscores. For example, `*italic*` or `_italic_`.

#### Lists

- **Unordered Lists**: Use asterisks, plus signs, or hyphens to create bullet
  points.
- Nest lists using extra indentation.

  ```
  * Item 1
  * Item 2
    * Subitem 2.1
    * Subitem 2.2
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
     a. Subitem 2.1
     b. Subitem 2.2
  ```

#### Links and Images

- **Links**: To create a link, wrap the link text in brackets `[ ]`, and then
  wrap the URL in parentheses `( )`. 
    - For example, `[GitHub](https://github.com)`.
- **Images**: Similar to links, but start with an exclamation mark, followed by
  the alt text in brackets, and the URL in parentheses. 
    - For example, `![Alt text](image-url.jpg)`.

#### Code

- **Inline Code**: For small bits of code, use backticks to wrap your code. For
  example, `` `code` ``.
- **Code Blocks**: For larger sections of code, use three backticks or indent
  with four spaces:

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

- **Whitespace and Line Breaks**: In Markdown, line breaks and spacing can be
  crucial. To create a new line without starting a new paragraph, end a line
  with two or more spaces before hitting Enter.
- **Escaping Markdown**: To display a Markdown character, precede it with a
  backslash (`\`). For example, `\*not italic\*`.

Markdown's makes formatted text simple and readable.
It's a great choice for for documentation and note-taking.
As you become more comfortable with these basics,
you'll find it a versatile tool for your writing needs.

## Conclusion

In summary, Git is powerful tool for documentation and version control,
offering a platform for managing, tracking, and collaborating on projects.

Adhere to clear file naming conventions to enhance its efficiency.
This ensures files are accessible and compatible across various environments.

Furthermore, the use of Markdown within this framework simplifies the process
of creating and maintaining readable and well-structured documentation.

[markdown_guide]:https://www.markdownguide.org/
