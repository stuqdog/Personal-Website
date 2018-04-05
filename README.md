# stuqdog.github.io

This repository will play host to various web apps I have developed. Currently, it holds a KenKen solving algorithm and associated front-end. New tools, information, and updates will be added over time.

_KenKen_
-------

##### About KenKen

KenKen is a type of logic puzzle developed by Tetsuya Miyamoto, a Japanese math teacher, in 2004. It is similar to sudoku in that the player must fill an NxN grid with the numbers 1 to N such that no row or column contains repeated numbers. It differs from sudoku in that N is a variable number ranging from 3 to 9. In addition, KenKen introduces elements of arithmetic by requiring that clusters of cells satisfy a mathematical requirement, e.g. a cluster of three cells with a requirement of *16 could be (1, 2, 8), (4, 1, 4), or (2, 4, 2). For more information, see [Wikipedia](https://en.wikipedia.org/wiki/KenKen). If you want to try puzzles out, you can do so for free on the [KenKen Puzzle](http://www.kenkenpuzzle.com/) or [New York Times](https://www.nytimes.com/crosswords/game/kenken) websites.

##### Why KenKen?

In short: solving KenKen puzzles have long been a joy and hobby of mine. Working on a solver seemed a great way to develop a number of skills in programming: optimizing algorithms, structuring data efficiently, developing front-end user interfaces, and ensuring readability of code.

##### What tools are you using?

The front-end is written in React. The code can be found in the static/src folder. The back-end logic is written in Python using Flask. Flask work can be found in kenken/app/routes.py. The solver itself can be found in kenken/solver.py. 

##### Where can I use it? 

Unfortunately, GitHub web hosting, while excellent and free, does not (to my knowledge) provide any back-end functionality. You can download the source code yourself and run it in Flask, or stay tuned for an update with live link! If you want to test the algorithm but don't want to deal with getting Flask set up, The solver.py file is sufficient to solve any puzzle if you don't mind manually typing in puzzle details and viewing results in your terminal.

##### What next? 

A lot! In no particular order...

* Adding functionality for modifying clusters once they have already been assigned, which will require a refactor of how data is shared between JavaScript and Python. 

* Improving the solver algorithm. For most puzzles you'll find on the New York Times website, the algorithm will give you an answer in under a second. However, for some especially complicated 9x9 puzzles, it can take upwards of 10 seconds to provide a solution. I would like to cut down on that substantially.

* Developing a tool to generate puzzles, in addition to solving them. 

* Getting web hosting so that people can use this online without having to compile it themselves.

##### I have ideas on how to make this better

Wonderful! I am delighted to receive any and all feedback on my work. Feel free to make pull requests, or leave comments. I will be sure to respond. 
