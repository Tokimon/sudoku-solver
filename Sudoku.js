'use strict';

export default class Sudoku {
  constructor( grid, name ) {
    this.grid = grid;
    this.name = name || 'Sudoku';

    this.init();
  }

  static isNumberSolved( num ) {
    return !Array.isArray(num) && num !== 0;
  }

  static flatten( arr ) {
    return arr.map((sub) => { return Array.isArray(sub) ? sub.join(',') : sub; }).join(',')
  }

  init() {
    this.lookUpGrid((num, tile) => {
      if( num === 0 ) {
        const usedNums = this.contextNumbers(tile);
        const suggestions = [1,2,3,4,5,6,7,8,9].filter((i) => { return !usedNums.includes(i); });

        this.tileNumber(tile, suggestions);
      }
    });
  }

  solve() {
    // We check right away that the Sudoku has been solved or not.
    if( this.isSolved() ) {

      // We validate that the Sudoku has been solved correctly
      try { this.validate() }
      catch(ex){ throw new Error(`The Sudoku was solved but failed validation:\n${ex}`); }

      // If the Sudoku is solved and validated just return the solved grid
      return this.grid;
    }

    // FIXME: Should probably be moved to method
    // We keep the old grid to compare if we have made changes since last time
    const oldFlatGrid = Sudoku.flatten(this.grid);

    // Loop through the grid and perform changes
    this.loopGrid();

    // FIXME: Should probably be moved to method
    // If the grid has changed since the last run through...
    if( oldFlatGrid !== Sudoku.flatten(this.grid) ) {
      // We rerun the solve() method to see if we can solve it this time
      // (or to verify that is has now been solved)
      return this.solve();
    }

    // Otherwise we have to take a guess on a number and see if that solves it.
    return this.guess();
  }

  toString() {
    let x = 0, y = 0;

    const g = () => {
      const tile = [x, y];
      if( ++x > 8 ) { x=0; y++; }
      return this.isTileSolved(tile) ? this.tileNumber(tile) : '_';
    };

    return `
-------------
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
-------------
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
-------------
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
|${g()}${g()}${g()}|${g()}${g()}${g()}|${g()}${g()}${g()}|
-------------
`;
  }

  showGrid() {
    const sizes = this.grid.reduce((arr, row) => {
      row.forEach((cell, j) => {
        const size = Array.isArray(cell) ? (cell.length * 2) + 1 : 1;
        if( !arr[j] || arr[j] < size ) { arr[j] = size; }
      });

      return arr;
    }, []);

    const totalLength = sizes.reduce((base, size) => { return base + size }, 0);
    const line = Array(totalLength + 10).fill('-').join('');

    return this.grid
        .map((row, i) => {
          row = row.reduce((arr, cell, j) => {
            const size = Array.isArray(cell) ? (cell.length * 2) + 1 : 1;
            let str = Array.isArray(cell)? `[${cell}]` : cell;

            const spaces = sizes[j] - size;

            str += Array(spaces).fill(' ').join('');

            arr.push(str);

            return arr;
          }, []);

          const seperator = !(i % 3) ? `${line}\n` : '';
          return `${seperator}|${row.join('|')}|`;
        })
        .join('\n') + `\n${line}`;
  }

  validate() {
    let x=0, y=0;

    while( y < 9) { this.validateRow([0,y++]); }

    while( x < 9) { this.validateColumn([x++,0]); }

    for( y=0; y < 9; y+=3 ) {
      for( x=0; x < 9; x+=3 ) {
        this.validateSquare([x,y]);
      }
    }

    return true;
  }

  validateSquare( tile ) {
    const nums = this.squareNumbers(tile, true);

    if( nums.length < 9 ) { throw new Error(`Square not completed: ${tile}`); }

    nums.reduce((arr, i) => {
      if( arr.includes(i) ) { throw new Error(`Square has duplicate numbers: ${tile} : ${i}`); }
      arr.push(i);
      return arr;
    },[]);
  }

  validateRow( tile ) {
    const nums = this.rowNumbers(tile, true);
    if( nums.length < 9 ) { throw new Error(`Row not completed: ${tile}`); }

    nums.reduce((arr, i) => {
      if( arr.includes(i) ) { throw new Error(`Row has duplicate numbers: ${tile} : ${i}`); }
      arr.push(i);
      return arr;
    },[]);
  }

  validateColumn( tile ) {
    const nums = this.columnNumbers(tile, true);

    if( nums.length < 9 ) { throw new Error(`Column not completed: ${tile}`); }

    nums.reduce((arr, i) => {
      if( arr.includes(i) ) { throw new Error(`Column has duplicate numbers: ${tile} : ${i}`); }
      arr.push(i);
      return arr;
    },[]);
  }

  isSolved() {
    return this.unsolvedNumbers().length === 0;
  }

  isTileSolved(tile) {
    return Sudoku.isNumberSolved(this.tileNumber(tile));
  }

  loopGrid() {
    this.lookUpGrid((num, tile) => {
      if( !Sudoku.isNumberSolved(num) ) {
        this.filterSuggestions(tile);
      }
    });
  }

  filterSuggestions( tile ) {
    this.ruleOutNumbers(tile, this.contextNumbers(tile));
    this.uniqueSuggestion(tile);
    return this.tileNumber(tile);
  }

  /**
   * Set the number (or possible numbers) on a tile.
   * If the possible numbers set include just one number,
   * set the tile number to that number.
   *
   * If the number is 0 (or below) it will be replaced by an array of the numbers 1 to 9
   *
   * @param tile {array}
   * @param num {int|array}
   * @returns {int|array}
   */
  tileNumber( tile, num ) {
    const [x, y] = tile;

    // falsy or out of bounds
    if( !num || num < 1 || num > 9 ) { return this.grid[y][x]; }

    // If it solved the tile
    if( Sudoku.isNumberSolved(num) ) {
      if( !this.unique(tile, num) ) {
        throw new Error(`Number not unique in context: ${tile} : ${num} : ${this.contextNumbers(tile, true)}`);
      }

      this.grid[y][x] = num;
      this.ruleOutNumbersFromOthers(tile, num);

      return num;
    }

    // Number is array
    const len = num.length;

    if( len === 1 ) {
      return this.tileNumber(tile, num[0]);
    } else if( len === 0 ) {
      throw new Error('No solution for this tile');
    }

    this.grid[y][x] = num;

    return num;
  }

  contextNumbers( tile, includeCurrent ) {
    const nums = [];

    this.lookUpAllContexts(tile, (num, tile) => {
      if( Sudoku.isNumberSolved(num) ) { nums.push(num); }
    }, includeCurrent);

    return nums;
  }

  squareNumbers( tile, includeCurrent ) {
    const nums = [];

    this.lookUpSquare(tile, (num) => {
      if( Sudoku.isNumberSolved(num) ) { nums.push(num); }
    }, includeCurrent);

    return nums;
  }

  rowNumbers( tile, includeCurrent ) {
    const nums = [];

    this.lookUpRow(tile, (num) => {
      if( Sudoku.isNumberSolved(num) ) { nums.push(num); }
    }, includeCurrent);

    return nums;
  }

  columnNumbers( tile, includeCurrent ) {
    const nums = [];

    this.lookUpColumn(tile, (num) => {
      if( Sudoku.isNumberSolved(num) ) { nums.push(num); }
    }, includeCurrent);

    return nums;
  }

  unsolvedNumbers(cb) {
    const numbers = [];

    this.lookUpGrid((num, tile) => {
      if( !Sudoku.isNumberSolved(num) ) {
        numbers.push(num);
        if(cb && cb(num, tile) === false) { return false; };
      }
    });

    return numbers;
  }
  
  contextUnsolved( tile, cb ) {
    this.lookUpAllContexts(tile, (num, t) => {
      return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
    });
  }

  squareUnsolved( tile, cb ) {
    this.lookUpSquare(tile, (num, t) => {
      return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
    });
  }

  rowUnsolved( tile, cb ) {
    this.lookUpRow(tile, (num, t) => {
      return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
    });
  }

  columnUnsolved( tile, cb ) {
    this.lookUpColumn(tile, (num, t) => {
      return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
    });
  }

  /**
   * Rule out the given number(s) from the give tile
   *
   * @param tile {array}
   * @param numbers {int|array}
   */
  ruleOutNumbers( tile, numbers ) {
    let currNum = this.tileNumber(tile);

    // We only have to look af tiles with suggestions
    if( !Array.isArray(currNum) ) { return currNum; }

    // Normalize the numbers
    if( !Array.isArray(numbers) && numbers ) { numbers = [numbers]; }

    // No need to do anything as there are no numbers to filter out
    if( !numbers || numbers.length === 0 ) { return currNum; }

    // Filter out the numbers from the suggestions
    return this.tileNumber(tile, currNum.filter((n) => { return !numbers.includes(n); }));
  }

  /**
   * Rules out the given number(s) from the other tiles in all directions
   *
   * @param tile {array}
   * @param num {int|array}
   */
  ruleOutNumbersFromOthers( tile, num ) {
    this.contextUnsolved(tile, (n, tile) => { this.ruleOutNumbers(tile, num); });
  }

  unique( tile, num ) {
    return !this.contextNumbers(tile).some((n) => { return n === num; });
  }

  /**
   * Checks if the suggested number in the tile are unique in the row, column or square
   * and sets it to that number if it is the case
   *
   * @param tile {array}
   * @returns {boolean}
   */
  uniqueSuggestion( tile ) {
    const suggestions = this.tileNumber(tile);

    // If we allready solved the tile, then we just return true
    if( Sudoku.isNumberSolved(suggestions) ) { return true; }
    // If the tile has not yet been initialized, the return false
    if( suggestions === 0 ) { return false; }

    // Array in case we find numbers that has not been sorted out of the suggestions already
    const usedNumbers = [];

    // Loop through the tile suggestions
    for( let i=0, l=suggestions.length; i < l; i++ ) {
      const num = suggestions[i];

      // Callback looks for:...
      const cb = (n) => {
        if( !Sudoku.isNumberSolved(n) ) {
          // 1. Compared number has not been initialized yet,
          //    so we return false as we don't know if it is unique
          if( n === 0 ) { return false; }

          // 2. Compared number is a suggestion array as well,
          //    so check if the current suggestion number exists in those suggestions
          return !n.includes(num);
        }

        // 3. The number matched, which means it has to be ruled out when we are done,
        //    so add it to the list of used numbers and return false
        if( n == num ) {
          usedNumbers.push(num);
          return false;
        }

        return true;
      };

      // Use the callback on the different contexts, to see if we found a unique number:
      let isUnique = this.lookUpSquare(tile, cb);
      if( !isUnique && this.lookUpRow(tile, cb) ) { isUnique = true; }
      if( !isUnique && this.lookUpColumn(tile, cb) ) { isUnique = true; }

      // If we did it means that the number can be updated
      if( isUnique ) {
        this.tileNumber(tile, num);
        // Just break the entire function here and indicate that we found a unique.
        return true;
      }
    }

    // Check ended without finding a unique value, so rule out any numbers we encountered in the loop
    // and indicate if the number has been resolved or not after the correction.
    return Sudoku.isNumberSolved(this.ruleOutNumbers(tile, usedNumbers));
  }

  /**
   * Looks up numbers in all directions
   * - In the Square
   * - In the Row
   * - In the Column
   *
   * @param tile {array}
   * @param cb {function}
   * @param includeCurrent {boolean}
   */

  lookUpAllContexts( tile, cb, includeCurrent ) {
    if( !this.lookUpSquare(tile, cb, includeCurrent) ) { return false; }
    if( !this.lookUpRow(tile, cb, includeCurrent) ) { return false; }
    return this.lookUpColumn(tile, cb, includeCurrent);
  }

  /**
   * Runs through all the tiles in an entire 3x3 square
   *
   *  -------
   * | 1 2 3 |
   * | 4 5 6 |
   * | 7 8 9 |
   *  -------
   *
   * @param tile {array}
   * @param cb {function}
   * @param includeCurrent {boolean}
   */
  lookUpSquare( tile, cb, includeCurrent ) {
    const [currX, currY] = tile;

    const startX = currX - (currX % 3);
    const startY = currY - (currY % 3);

    let x = startX;
    let y = startY;

    while( y <= startY + 2 ) {
      const t = [x, y];

      if( ++x > startX + 2 && ++y ) { x = startX; }
      if( t[0] === currX && t[1] === currY && !includeCurrent ) { continue; }
      if( cb && cb(this.tileNumber(t),t) === false ) { return false; }
    }

    return true;
  }

  /**
   * Runs through all the numbers in a row
   * (skipping current tile)
   *
   *  -----------------------
   * | 1 2 3 | 4 5 6 | 7 8 9 |
   *  -----------------------
   *
   * @param tile {array}
   * @param cb {function}
   * @param includeCurrent {boolean}
   */
  lookUpRow( tile, cb, includeCurrent ) {
    const [x, currY] = tile;
    let y = -1;

    while( ++y < 9 ) {
      if( y === currY && !includeCurrent ) { continue; }
      const t = [x, y];
      if( cb && cb(this.tileNumber(t),t) === false ) { return false; }
    }

    return true;
  }

  /**
   * Runs through all the numbers in a column
   * (skipping current tile)
   *
   *       ---
   *      | 1 |
   *      | 2 |
   *      | 3 |
   *      |---|
   *      | 4 |
   *      | 5 |
   *      | 6 |
   *      |---|
   *      | 7 |
   *      | 8 |
   *      | 9 |
   *       ---
   *
   * @param tile {array}
   * @param cb {function}
   * @param includeCurrent {boolean}
   */
  lookUpColumn( tile, cb, includeCurrent ) {
    const [currX, y] = tile;
    let x = -1;

    while( ++x < 9 ) {
      if( x === currX && !includeCurrent ) { continue; }
      const t = [x, y];
      if( cb && cb(this.tileNumber(t),t) === false ) { return false; }
    }

    return true;
  }

  lookUpGrid( cb ) {
    let x = 0, y = 0;

    while( y < 9 ) {
      const tile = [x, y];
      const num = this.tileNumber(tile);

      if( cb && cb(num, tile) === false ) { return false; }
      if( ++x > 8 && ++y ) { x = 0; }
    }

    return true;
  }

  guess() {
    let multiChoice = {};

    this.unsolvedNumbers((num, tile) => {
      if( !multiChoice.num || num.length < multiChoice.num.length ) {
        multiChoice = { num, tile };
      }

      if( multiChoice.num.length === 2 ) { return false; }
    });

    return this.grid = this.tryNumber(multiChoice);
  }

  tryNumber( multiChoice, index = 0 ) {
    const [x, y] = multiChoice.tile;
    const num = multiChoice.num[index];

    // Index out of bounds, which means all the options have been exhausted and a solution has not been fund :(
    if( !num ) { throw new Error('No solution found for the sudoku!'); }

    // Copy array
    const grid = this.grid.map((row) => { return row.slice(); });

    // try the value in the tile
    grid[y][x] = num;

    // Create a sub solver from the guess
    const guess = new Sudoku(grid, `${this.name}:guess`);

    try {
      // try to solve the sudoku with this grid, if it fails we try another number
      return guess.solve();
    } catch(ex) {
      // Attempt failed, so try next number
      return this.tryNumber(multiChoice, index + 1);
    }
  }
}
