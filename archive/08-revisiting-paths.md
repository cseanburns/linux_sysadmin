## Revisiting Paths

Here's a video on using the command line to navigate the file system or the paths. This is not a transcript, but in this video, I use commands like:

- ``cd`` to change directories
    - ``cd -`` (cd dash) to change to the previous working directory
    - ``cd ~`` (cd tilde) to change to the home directory
    - ``cd ..`` (cd dot dot) to change to the directory up one level
- ``mkdir -p`` to make multiple directories
- ``rm`` to remove files
    - ``rm ../file.txt`` to remove a file up one level 
    - ``rm ~/file.txt`` to remove a file in my home directory
    - ``rm ~/test0/test1/test2/file.txt`` to remove a file nested in multiple sub-directories
- ``cp`` to copy files
    - ``cp file.txt ../../../`` to copy a file multiple directories up from current position
    - ``cp bin/file.txt documents/file.txt`` to copy a file in my bin directory to my documents directory
- ``mv`` to move or rename a file
    - ``mv file.txt test0/test1/test2/`` to move a file in my home directory to the nested directories
    - ``mv bin/file.txt documents/file.txt`` to move a file from my bin directory to my documents directory
- ``tree -d`` to visualize the directory structure from my current directory
- ``find . -name "file.txt"`` to search for a file in my directories that's named "file.txt"

I hope this video helps. Please let me know if you have any questions.
