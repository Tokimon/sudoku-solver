Sudoku Solver
=============

![Sudoku Solver](http://i.imgur.com/0rZqqF6.png)

Yet another Sudoku solver which I created because I was challenged to it :)  
Challange accepted and VOILA!!

It might be more elaborate than your average solver, but many of the feature has been included due to heavy debugging
(I suck at sudoku normally). At least now it has a lot of nifty features, such as getting a string representation
of the board, with or without field notes (yeah it actually has field notes) and pretty error reporting.

It is written in ES 6 so be sure to enable you loyal transpiler if you like to use it.

## Usage
The puzzle grid is given by a multidimentional array, with empty tiles marked with a zero (0).

```javascript
const grid =[
  [0,7,6, 0,1,0, 0,4,3],
  [0,0,0, 7,0,2, 9,0,0],
  [0,9,0, 0,0,6, 0,0,0],
  
  [0,0,0, 0,6,3, 2,0,4],
  [4,6,0, 0,0,0, 0,1,9],
  [1,0,5, 4,2,0, 0,0,0],
  
  [0,0,0, 2,0,0, 0,9,0],
  [0,0,4, 8,0,7, 0,0,1],
  [9,1,0, 0,5,0, 7,2,0]
];

const sudoku = new Sudoku(grid);
const result = sudoku.solve();
```

## Tests

    $ npm test

I have borrowed the awesome [Kudoku](http://attractivechaos.github.io/plb/kudoku.html) solver to compare results against.
So big thanks to [attractivechaos](https://github.com/attractivechaos) for that.


## Update
I later read [this article](http://norvig.com/sudoku.html) that states that I was on the right path when I solve the sudoku. Good to know :)