# Grep and Regular Expressions 

The file I'll demo for this video is at the bottom.

See ``man grep`` for documentation.

## Whole words, case sensitive by default
 
```
grep "yesterday" example.txt
grep "Yesterday" example.txt
grep -i "yesterday" example.txt
```

## Character Classes and Bracket Expressions

```
grep [a-d] example.txt
grep [1-3] example.txt
grep [^a-d] example.txt
grep [^1-3] example.txt
grep [[:alpha:]] example.txt
grep [[:lower:]] example.txt
```

## Anchoring

```
grep "^I" example.txt
grep "\"$" example.txt
```

## Repetition

```
grep "l*" example.txt
grep -E "x = [0-9]" example.xt
grep -E "x = -?[0-9]" example.xt
# grep 'l{2,}' example.txt doesn't work because Bash needs us to escape
# the curly braces, so:
grep 'l\{2,\}' example.txt
```

## Concatenation

```
grep [yY] example.txt
```

## Alternation

```
grep "six\|done" example.txt
```

## Example file

```
Oct 2, 2019

Yesterday was a busy day. I got a lot of work done.

I like to walk.

"What do you get if you multiply six by nine?"

"Six by nine. Forty two."

"That's it. That's all there is."

"I always thought something was fundamentally wrong with the universe."

x = -12345

x = 45678
```
