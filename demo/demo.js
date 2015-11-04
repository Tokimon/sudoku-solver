(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sudoku = (function () {
  function Sudoku(grid, name) {
    _classCallCheck(this, Sudoku);

    this.grid = grid;
    this.name = name || 'Sudoku';

    this.init();
  }

  /**
   * Determines whether a number (from a tile) is solved or not.
   * (Syntactic helper function to uniform this check)
   *
   * @param num {int|array}
   * @returns {boolean}
   */

  _createClass(Sudoku, [{
    key: 'init',

    /**
     * Run initial run through of the grid replacing 0 with a list of possible choices
     */
    value: function init() {
      var _this = this;

      this.lookUpGrid(function (num, tile) {
        if (num === 0) {
          (function () {
            var usedNums = _this.contextNumbers(tile);
            var suggestions = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (i) {
              return usedNums.indexOf(i) < 0;
            });

            _this.tileNumber(tile, suggestions);
          })();
        }
      });
    }

    /**
     * Try to solve the grid.
     *
     * @returns {array}
     */

  }, {
    key: 'solve',
    value: function solve() {
      // We check right away that the Sudoku has been solved or not.
      if (this.isSolved()) {

        // We validate that the Sudoku has been solved correctly
        try {
          this.validate();
        } catch (ex) {
          throw new Error('The Sudoku was solved but failed validation:\n' + ex);
        }

        // If the Sudoku is solved and validated just return the solved grid
        return this.grid;
      }

      // FIXME: Should probably be moved to method
      // We keep the old grid to compare if we have made changes since last time
      var oldFlatGrid = Sudoku.flatten(this.grid);

      // Loop through the grid and perform changes
      this.loopGrid();

      // FIXME: Should probably be moved to method
      // If the grid has changed since the last run through...
      if (oldFlatGrid !== Sudoku.flatten(this.grid)) {
        // We rerun the solve() method to see if we can solve it this time
        // (or to verify that is has now been solved)
        return this.solve();
      }

      // Otherwise we have to take a guess on a number and see if that solves it.
      return this.guess();
    }

    /**
     * Overrides the default 'Object.toString()' method, to give a clearer representation of the grid
     *
     * @returns {string}
     */

  }, {
    key: 'toString',
    value: function toString() {
      var _this2 = this;

      var x = 0,
          y = 0;

      var g = function g() {
        var tile = [x, y];
        if (++x > 8) {
          x = 0;y++;
        }
        return _this2.isTileSolved(tile) ? _this2.tileNumber(tile) : '_';
      };

      return '\n-------------\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n-------------\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n-------------\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n|' + g() + g() + g() + '|' + g() + g() + g() + '|' + g() + g() + g() + '|\n-------------\n';
    }

    /**
     * Like 'toString()' but shows possible values for unsolved fields
     *
     * @returns {string}
     */

  }, {
    key: 'showGrid',
    value: function showGrid() {
      var sizes = this.grid.reduce(function (arr, row) {
        row.forEach(function (cell, j) {
          var size = Array.isArray(cell) ? cell.length * 2 + 1 : 1;
          if (!arr[j] || arr[j] < size) {
            arr[j] = size;
          }
        });

        return arr;
      }, []);

      var totalLength = sizes.reduce(function (base, size) {
        return base + size;
      }, 0);
      var line = Array(totalLength + 10).fill('-').join('');

      return this.grid.map(function (row, i) {
        row = row.reduce(function (arr, cell, j) {
          var size = Array.isArray(cell) ? cell.length * 2 + 1 : 1;
          var str = Array.isArray(cell) ? '[' + cell + ']' : cell;

          var spaces = sizes[j] - size;

          str += Array(spaces).fill(' ').join('');

          arr.push(str);

          return arr;
        }, []);

        var seperator = !(i % 3) ? line + '\n' : '';
        return seperator + '|' + row.join('|') + '|';
      }).join('\n') + ('\n' + line);
    }

    /**
     * Validates that the board has been completed correctly
     *
     * @returns {boolean}
     */

  }, {
    key: 'validate',
    value: function validate() {
      var x = 0,
          y = 0;

      while (y < 9) {
        this.validateRow([0, y++]);
      }

      while (x < 9) {
        this.validateColumn([x++, 0]);
      }

      for (y = 0; y < 9; y += 3) {
        for (x = 0; x < 9; x += 3) {
          this.validateSquare([x, y]);
        }
      }

      return true;
    }

    /**
     * Validates designated 3x3 square.
     *
     * @param tile {array}
     * @returns {boolean}
     */

  }, {
    key: 'validateSquare',
    value: function validateSquare(tile) {
      var nums = this.squareNumbers(tile, true);

      if (nums.length < 9) {
        throw new Error('Square not completed: ' + tile);
      }

      nums.reduce(function (arr, i) {
        if (arr.indexOf(i) > -1) {
          throw new Error('Square has duplicate numbers: ' + tile + ' : ' + i);
        }
        arr.push(i);
        return arr;
      }, []);

      return true;
    }

    /**
     * Validates designated row
     *
     * @param tile {array}
     * @returns {boolean}
     */

  }, {
    key: 'validateRow',
    value: function validateRow(tile) {
      var nums = this.rowNumbers(tile, true);
      if (nums.length < 9) {
        throw new Error('Row not completed: ' + tile);
      }

      nums.reduce(function (arr, i) {
        if (arr.indexOf(i) > -1) {
          throw new Error('Row has duplicate numbers: ' + tile + ' : ' + i);
        }
        arr.push(i);
        return arr;
      }, []);

      return true;
    }

    /**
     * Validates designated column
     *
     * @param tile {array}
     * @returns {boolean}
     */

  }, {
    key: 'validateColumn',
    value: function validateColumn(tile) {
      var nums = this.columnNumbers(tile, true);

      if (nums.length < 9) {
        throw new Error('Column not completed: ' + tile);
      }

      nums.reduce(function (arr, i) {
        if (arr.indexOf(i) > -1) {
          throw new Error('Column has duplicate numbers: ' + tile + ' : ' + i);
        }
        arr.push(i);
        return arr;
      }, []);

      return true;
    }

    /**
     * Indicates whether or not the grid has been solved
     *
     * @returns {boolean}
     */

  }, {
    key: 'isSolved',
    value: function isSolved() {
      return this.unsolvedNumbers().length === 0;
    }

    /**
     * Indicates whether the designated tile has been solved (filled with a number between 1 and 9) or not
     *
     * @param tile {array}
     * @returns {boolean}
     */

  }, {
    key: 'isTileSolved',
    value: function isTileSolved(tile) {
      return Sudoku.isNumberSolved(this.tileNumber(tile));
    }

    /**
     * Loop through each tile in the grid and try to solve the tiles (by filtering out suggestions)
     */

  }, {
    key: 'loopGrid',
    value: function loopGrid() {
      var _this3 = this;

      this.unsolvedNumbers(function (num, tile) {
        _this3.filterSuggestions(tile);
      });
    }

    /**
     * Filter out solved numbers from the suggestions + check if one of the numbers
     * in the remaining suggestions, should be unique in a context.
     *
     * @param tile {array}
     * @returns {int|array}
     */

  }, {
    key: 'filterSuggestions',
    value: function filterSuggestions(tile) {
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

  }, {
    key: 'tileNumber',
    value: function tileNumber(tile, num) {
      var _tile = _slicedToArray(tile, 2);

      var x = _tile[0];
      var y = _tile[1];

      // falsy or out of bounds

      if (!num || num < 1 || num > 9) {
        return this.grid[y][x];
      }

      // If it solved the tile
      if (Sudoku.isNumberSolved(num)) {
        if (!this.unique(tile, num)) {
          throw new Error('Number not unique in context: ' + tile + ' : ' + num + ' : ' + this.contextNumbers(tile, true));
        }

        this.grid[y][x] = num;
        this.ruleOutNumbersFromOthers(tile, num);

        return num;
      }

      // Number is array
      var len = num.length;

      if (len === 1) {
        return this.tileNumber(tile, num[0]);
      } else if (len === 0) {
        throw new Error('No solution for this tile');
      }

      this.grid[y][x] = num;

      return num;
    }

    /**
     * Loops through all contexts of a given tile and counts how many have been solved
     *
     * @param tile {array}
     * @param includeCurrent {boolean}
     * @returns {Array}
     */

  }, {
    key: 'contextNumbers',
    value: function contextNumbers(tile, includeCurrent) {
      var nums = [];

      this.lookUpAllContexts(tile, function (num, tile) {
        if (Sudoku.isNumberSolved(num)) {
          nums.push(num);
        }
      }, includeCurrent);

      return nums;
    }

    /**
     * Loops through the 3x3 square context of a given tile and return those that have been solved
     *
     * @param tile {array}
     * @param includeCurrent {boolean}
     * @returns {Array}
     */

  }, {
    key: 'squareNumbers',
    value: function squareNumbers(tile, includeCurrent) {
      var nums = [];

      this.lookUpSquare(tile, function (num) {
        if (Sudoku.isNumberSolved(num)) {
          nums.push(num);
        }
      }, includeCurrent);

      return nums;
    }

    /**
     * Loops through the row context of a given tile and return those that have been solved
     *
     * @param tile {array}
     * @param includeCurrent {boolean}
     * @returns {Array}
     */

  }, {
    key: 'rowNumbers',
    value: function rowNumbers(tile, includeCurrent) {
      var nums = [];

      this.lookUpRow(tile, function (num) {
        if (Sudoku.isNumberSolved(num)) {
          nums.push(num);
        }
      }, includeCurrent);

      return nums;
    }

    /**
     * Loops through the column context of a given tile and return those that have been solved
     *
     * @param tile {array}
     * @param includeCurrent {boolean}
     * @returns {Array}
     */

  }, {
    key: 'columnNumbers',
    value: function columnNumbers(tile, includeCurrent) {
      var nums = [];

      this.lookUpColumn(tile, function (num) {
        if (Sudoku.isNumberSolved(num)) {
          nums.push(num);
        }
      }, includeCurrent);

      return nums;
    }

    /**
     * Loops through the entire grid and return those tiles that have not been solved
     *
     * @param cb {function}
     * @returns {Array}
     */

  }, {
    key: 'unsolvedNumbers',
    value: function unsolvedNumbers(cb) {
      var numbers = [];

      this.lookUpGrid(function (num, tile) {
        if (!Sudoku.isNumberSolved(num)) {
          numbers.push(num);
          if (cb && cb(num, tile) === false) {
            return false;
          }
        }
      });

      return numbers;
    }

    /**
     * Loops through all the contexts of a given tile and return those that have not been solved
     *
     * @param tile {array}
     * @returns {Array}
     */

  }, {
    key: 'contextUnsolved',
    value: function contextUnsolved(tile, cb) {
      this.lookUpAllContexts(tile, function (num, t) {
        return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
      });
    }

    /**
     * Loops through the 3x3 square context of a given tile and return those that have not been solved
     *
     * @param tile {array}
     * @returns {Array}
     */

  }, {
    key: 'squareUnsolved',
    value: function squareUnsolved(tile, cb) {
      this.lookUpSquare(tile, function (num, t) {
        return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
      });
    }

    /**
     * Loops through the row context of a given tile and return those that have not been solved
     *
     * @param tile {array}
     * @returns {Array}
     */

  }, {
    key: 'rowUnsolved',
    value: function rowUnsolved(tile, cb) {
      this.lookUpRow(tile, function (num, t) {
        return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
      });
    }

    /**
     * Loops through the column context of a given tile and return those that have not been solved
     *
     * @param tile {array}
     * @returns {Array}
     */

  }, {
    key: 'columnUnsolved',
    value: function columnUnsolved(tile, cb) {
      this.lookUpColumn(tile, function (num, t) {
        return !Sudoku.isNumberSolved(num) ? cb(num, t) : true;
      });
    }

    /**
     * Find the shortest array of possibilities for a tile (choosing the first that consists of only 2 numbers)
     *
     * @returns {object}
     */

  }, {
    key: 'shortestUnsolved',
    value: function shortestUnsolved() {
      var shortest = null;

      this.unsolvedNumbers(function (num, tile) {
        if (!shortest || num.length < shortest.num.length) {
          shortest = { num: num, tile: tile };
        }

        if (shortest.num.length === 2) {
          return false;
        }
      });

      return shortest;
    }

    /**
     * Rule out the given number(s) from the give tile
     *
     * @param tile {array}
     * @param numbers {int|array}
     */

  }, {
    key: 'ruleOutNumbers',
    value: function ruleOutNumbers(tile, numbers) {
      var currNum = this.tileNumber(tile);

      // We only have to look af tiles with suggestions
      if (!Array.isArray(currNum)) {
        return currNum;
      }

      // Normalize the numbers
      if (!Array.isArray(numbers) && numbers) {
        numbers = [numbers];
      }

      // No need to do anything as there are no numbers to filter out
      if (!numbers || numbers.length === 0) {
        return currNum;
      }

      // Filter out the numbers from the suggestions
      return this.tileNumber(tile, currNum.filter(function (n) {
        return numbers.indexOf(n) < 0;
      }));
    }

    /**
     * Rules out the given number(s) from the other tiles in all directions
     *
     * @param tile {array}
     * @param num {int|array}
     */

  }, {
    key: 'ruleOutNumbersFromOthers',
    value: function ruleOutNumbersFromOthers(tile, num) {
      var _this4 = this;

      this.contextUnsolved(tile, function (n, tile) {
        _this4.ruleOutNumbers(tile, num);
      });
    }

    /**
     * Determines if a given number is found elsewhere in the given tile contexts
     *
     * @param tile
     * @param num
     * @returns {boolean}
     */

  }, {
    key: 'unique',
    value: function unique(tile, num) {
      return !this.contextNumbers(tile).some(function (n) {
        return n === num;
      });
    }

    /**
     * Checks if the suggested number in the tile are unique in the row, column or square
     * and sets it to that number if it is the case
     *
     * @param tile {array}
     * @returns {boolean}
     */

  }, {
    key: 'uniqueSuggestion',
    value: function uniqueSuggestion(tile) {
      var suggestions = this.tileNumber(tile);

      // If we allready solved the tile, then we just return true
      if (Sudoku.isNumberSolved(suggestions)) {
        return true;
      }
      // If the tile has not yet been initialized, the return false
      if (suggestions === 0) {
        return false;
      }

      // Array in case we find numbers that has not been sorted out of the suggestions already
      var usedNumbers = [];

      // Loop through the tile suggestions
      for (var i = 0, l = suggestions.length; i < l; i++) {
        var num = suggestions[i];

        // Callback looks for:...
        var cb = function cb(n) {
          if (!Sudoku.isNumberSolved(n)) {
            // 1. Compared number has not been initialized yet,
            //    so we return false as we don't know if it is unique
            if (n === 0) {
              return false;
            }

            // 2. Compared number is a suggestion array as well,
            //    so check if the current suggestion number exists in those suggestions
            return n.indexOf(num) < 0;
          }

          // 3. The number matched, which means it has to be ruled out when we are done,
          //    so add it to the list of used numbers and return false
          if (n == num) {
            usedNumbers.push(num);
            return false;
          }

          return true;
        };

        // Use the callback on the different contexts, to see if we found a unique number:
        var isUnique = this.lookUpSquare(tile, cb);
        if (!isUnique && this.lookUpRow(tile, cb)) {
          isUnique = true;
        }
        if (!isUnique && this.lookUpColumn(tile, cb)) {
          isUnique = true;
        }

        // If we did it means that the number can be updated
        if (isUnique) {
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

  }, {
    key: 'lookUpAllContexts',
    value: function lookUpAllContexts(tile, cb, includeCurrent) {
      if (!this.lookUpSquare(tile, cb, includeCurrent)) {
        return false;
      }
      if (!this.lookUpRow(tile, cb, includeCurrent)) {
        return false;
      }
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

  }, {
    key: 'lookUpSquare',
    value: function lookUpSquare(tile, cb, includeCurrent) {
      var _tile2 = _slicedToArray(tile, 2);

      var currX = _tile2[0];
      var currY = _tile2[1];

      var startX = currX - currX % 3;
      var startY = currY - currY % 3;

      var x = startX;
      var y = startY;

      while (y <= startY + 2) {
        var t = [x, y];

        if (++x > startX + 2 && ++y) {
          x = startX;
        }
        if (t[0] === currX && t[1] === currY && !includeCurrent) {
          continue;
        }
        if (cb && cb(this.tileNumber(t), t) === false) {
          return false;
        }
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

  }, {
    key: 'lookUpRow',
    value: function lookUpRow(tile, cb, includeCurrent) {
      var _tile3 = _slicedToArray(tile, 2);

      var x = _tile3[0];
      var currY = _tile3[1];

      var y = -1;

      while (++y < 9) {
        if (y === currY && !includeCurrent) {
          continue;
        }
        var t = [x, y];
        if (cb && cb(this.tileNumber(t), t) === false) {
          return false;
        }
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

  }, {
    key: 'lookUpColumn',
    value: function lookUpColumn(tile, cb, includeCurrent) {
      var _tile4 = _slicedToArray(tile, 2);

      var currX = _tile4[0];
      var y = _tile4[1];

      var x = -1;

      while (++x < 9) {
        if (x === currX && !includeCurrent) {
          continue;
        }
        var t = [x, y];
        if (cb && cb(this.tileNumber(t), t) === false) {
          return false;
        }
      }

      return true;
    }

    /**
     * Runs through the entire grid
     *
     * @param cb {function}
     * @returns {boolean}
     */

  }, {
    key: 'lookUpGrid',
    value: function lookUpGrid(cb) {
      var x = 0,
          y = 0;

      while (y < 9) {
        var tile = [x, y];
        var num = this.tileNumber(tile);

        if (cb && cb(num, tile) === false) {
          return false;
        }
        if (++x > 8 && ++y) {
          x = 0;
        }
      }

      return true;
    }

    /**
     * Try out all numbers of the shortest array of suggestions until as solution is found
     * or the list is exhausted, where as it must be concluded that the board cannot be solved.
     *
     * These guesses are made to be nested indefinitely, as one guess might require another guess on another tile.
     *
     * @returns {array}
     */

  }, {
    key: 'guess',
    value: function guess(multiChoice) {
      multiChoice = multiChoice || this.shortestUnsolved();

      var len = multiChoice.num.length;

      // If all the options have been exhausted a solution has not been fund :(
      if (!len) {
        throw new Error('No solution found for the sudoku!');
      }

      var index = Math.floor(Math.random() * len);

      var _multiChoice$tile = _slicedToArray(multiChoice.tile, 2);

      var x = _multiChoice$tile[0];
      var y = _multiChoice$tile[1];

      var num = multiChoice.num[index];

      // Copy the grid
      var grid = this.grid.map(function (row) {
        return row.map(function (col) {
          return Array.isArray(col) ? col.slice() : col;
        });
      });

      // Try the value in the tile
      grid[y][x] = num;

      // Create a sub solver from the guess
      var subguess = new Sudoku(grid, this.name + ':guess');

      try {
        // try to solve the sudoku with this grid, if it fails we try another number
        return subguess.solve();
      } catch (ex) {
        // Attempt failed, so exclude the number from the array
        multiChoice.num.splice(index, 1);
        return this.guess(multiChoice);
      }
    }
  }], [{
    key: 'isNumberSolved',
    value: function isNumberSolved(num) {
      return !Array.isArray(num) && num !== 0;
    }

    /**
     * Flatten an array to just one long string of numbers.
     *
     * @param arr {array}
     * @returns {string}
     */

  }, {
    key: 'flatten',
    value: function flatten(arr) {
      return arr.map(function (sub) {
        return Array.isArray(sub) ? sub.join('') : sub;
      }).join('');
    }
  }]);

  return Sudoku;
})();

exports.default = Sudoku;

},{}],2:[function(require,module,exports){
'use strict';

var _grids = require('../../grids');

var Grids = _interopRequireWildcard(_grids);

var _Sudoku = require('../../Sudoku');

var _Sudoku2 = _interopRequireDefault(_Sudoku);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function writeGrid(grid) {
  var rows = document.querySelectorAll("#SudokuBoard tr");

  for (var i = 0, l = rows.length; i < l; i++) {
    var row = rows[i];
    var gridRow = grid[i];

    var cells = row.querySelectorAll("td");

    for (var i2 = 0, l2 = cells.length; i2 < l2; i2++) {
      cells[i2].innerText = gridRow[i2] || '';
    }
  }
}

function readGrid() {
  var rows = document.querySelectorAll("#SudokuBoard tr");
  var grid = [];

  for (var i = 0, l = rows.length; i < l; i++) {
    var row = rows[i];
    var cells = row.querySelectorAll("td");

    grid[i] = grid[i] || [];

    for (var i2 = 0, l2 = cells.length; i2 < l2; i2++) {
      grid[i][i2] = parseInt(cells[i2].innerText) || 0;
    }
  }

  return grid;
}

function chooseGrid(node) {
  var gridName = node.dataset.grid;
  writeGrid(Grids[gridName]);
  timerText('');
}

function listGrids() {
  var gridSection = document.getElementById("Grids");

  gridSection.innerHTML += '\n  <div data-grid="grid1">Grid 1</div>\n  <div data-grid="grid2">Grid 2</div>\n  <div data-grid="extreme">Extreme Grid</div>\n  ';

  var divs = gridSection.getElementsByTagName('div');

  for (var i = 0, l = divs.length; i < l; i++) {
    divs[i].addEventListener('click', function () {
      chooseGrid(this);
    }, false);
  }
}

function solve() {
  console.time('Sudoku Solved');
  var sudoku = new _Sudoku2.default(readGrid());
  writeGrid(sudoku.solve());
  console.timeEnd('Sudoku Solved');
  timerText('Sudoku solved. Completion time tracked in the console.');
}

function activateButton() {
  document.querySelector('.button').addEventListener('click', solve, false);
}

var timer = undefined;

function timerText(text) {
  document.getElementById('Timer').innerText = text;
}

window.demo = function () {
  listGrids();
  activateButton();
};

},{"../../Sudoku":1,"../../grids":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var grid1 = exports.grid1 = [[0, 7, 6, 0, 1, 0, 0, 4, 3], [0, 0, 0, 7, 0, 2, 9, 0, 0], [0, 9, 0, 0, 0, 6, 0, 0, 0], [0, 0, 0, 0, 6, 3, 2, 0, 4], [4, 6, 0, 0, 0, 0, 0, 1, 9], [1, 0, 5, 4, 2, 0, 0, 0, 0], [0, 0, 0, 2, 0, 0, 0, 9, 0], [0, 0, 4, 8, 0, 7, 0, 0, 1], [9, 1, 0, 0, 5, 0, 7, 2, 0]];

var grid1_solved = exports.grid1_solved = [[2, 7, 6, 9, 1, 5, 8, 4, 3], [3, 4, 1, 7, 8, 2, 9, 6, 5], [5, 9, 8, 3, 4, 6, 1, 7, 2], [7, 8, 9, 1, 6, 3, 2, 5, 4], [4, 6, 2, 5, 7, 8, 3, 1, 9], [1, 3, 5, 4, 2, 9, 6, 8, 7], [8, 5, 7, 2, 3, 1, 4, 9, 6], [6, 2, 4, 8, 9, 7, 5, 3, 1], [9, 1, 3, 6, 5, 4, 7, 2, 8]];

var grid2 = exports.grid2 = [[1, 0, 0, 0, 3, 0, 5, 9, 0], [3, 0, 0, 5, 0, 0, 0, 2, 0], [0, 5, 0, 9, 0, 2, 6, 3, 8], [4, 3, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 6, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 8, 7], [6, 4, 7, 3, 0, 8, 0, 5, 0], [0, 1, 0, 0, 0, 5, 0, 0, 9], [0, 9, 2, 0, 7, 0, 0, 0, 3]];

var grid2_solved = exports.grid2_solved = [[1, 2, 6, 8, 3, 7, 5, 9, 4], [3, 8, 9, 5, 4, 6, 7, 2, 1], [7, 5, 4, 9, 1, 2, 6, 3, 8], [4, 3, 5, 7, 8, 9, 2, 1, 6], [9, 7, 8, 6, 2, 1, 3, 4, 5], [2, 6, 1, 4, 5, 3, 9, 8, 7], [6, 4, 7, 3, 9, 8, 1, 5, 2], [8, 1, 3, 2, 6, 5, 4, 7, 9], [5, 9, 2, 1, 7, 4, 8, 6, 3]];

var extreme = exports.extreme = [[5, 0, 0, 0, 0, 2, 0, 8, 9], [4, 2, 0, 8, 0, 0, 5, 1, 0], [0, 7, 0, 0, 5, 0, 0, 0, 0], [1, 0, 0, 5, 0, 3, 0, 6, 0], [0, 0, 5, 0, 0, 0, 3, 0, 0], [0, 3, 0, 7, 0, 6, 0, 0, 5], [0, 0, 0, 0, 2, 0, 0, 9, 0], [0, 9, 6, 0, 0, 8, 0, 5, 4], [8, 5, 0, 9, 0, 0, 0, 0, 6]];

var extreme_solved = exports.extreme_solved = [[5, 6, 1, 3, 7, 2, 4, 8, 9], [4, 2, 3, 8, 6, 9, 5, 1, 7], [9, 7, 8, 4, 5, 1, 6, 2, 3], [1, 4, 7, 5, 8, 3, 9, 6, 2], [6, 8, 5, 2, 9, 4, 3, 7, 1], [2, 3, 9, 7, 1, 6, 8, 4, 5], [3, 1, 4, 6, 2, 5, 7, 9, 8], [7, 9, 6, 1, 3, 8, 2, 5, 4], [8, 5, 2, 9, 4, 7, 1, 3, 6]];

},{}]},{},[2]);
