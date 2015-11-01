/* eslint-env node, mocha */

'use strict';

const chai = require('chai');
const expect = chai.expect;

import {
  grid1,
  grid1_solved,
  grid2,
  grid2_solved,
  extreme,
  extreme_solved
} from './grids';

import kudoku from './kudoku.js';
import Sudoku from './Sudoku.js';

function gridToKudoku( grid ) {
  return grid
      .map(( row ) => { return row.join('').replace(/0/g, '.'); })
      .join('');
}

function kudokuToGrid( kudokuStr ) {
  return kudokuStr
      .match(/.{9}/g)
      .map(( part ) => { return part.match(/./g); });
}

describe('Kudoku solver (reference solver)', function() {
  it('should solve grid 1', function() {
    const result = gridToKudoku(kudoku()(gridToKudoku(grid1), 1));
    expect(gridToKudoku(grid1_solved)).to.equal(result);
  });

  it('should solve grid 2', function() {
    const result = gridToKudoku(kudoku()(gridToKudoku(grid2), 1));
    expect(gridToKudoku(grid2_solved)).to.equal(result);
  });

  it('should solve extreme', function() {
    const result = gridToKudoku(kudoku()(gridToKudoku(extreme), 1));
    expect(gridToKudoku(extreme_solved)).to.equal(result);
  });
});

describe('Sudoku Solver', function() {
  it(`should solve grid 1`, function() {
    const sudoku = new Sudoku(grid1);
    expect(gridToKudoku(sudoku.solve())).to.equal(gridToKudoku(grid1_solved));
  });

  it(`should solve grid 2`, function() {
    const sudoku = new Sudoku(grid2);
    expect(gridToKudoku(sudoku.solve())).to.equal(gridToKudoku(grid2_solved));
  });

  it(`should solve extreme`, function() {
    const sudoku = new Sudoku(extreme);
    expect(gridToKudoku(sudoku.solve())).to.equal(gridToKudoku(extreme_solved));
  });
});