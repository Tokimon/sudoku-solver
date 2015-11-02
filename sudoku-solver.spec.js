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

function validateGrid( grid ) {
  const SudokuValidator = new Sudoku(grid);
  return SudokuValidator.validate();
}

function gridToFlat( grid ) {
  return Sudoku.flatten(grid).replace(/0/g, '.');
}

function faltToGrid( kudokuStr ) {
  return kudokuStr
      .match(/.{9}/g)
      .map(( part ) => { return part.match(/./g); });
}

function kudokuResolve( grid ) {
  const kudokuResult = kudoku()(gridToFlat(grid), 1);
  return faltToGrid(gridToFlat(kudokuResult));
}

describe('Sudoku validation', function() {
  it('should validate Grid 1 as correct', function() {
    expect(validateGrid(grid1_solved)).to.be.true;
  });

  it('should validate Grid 2 as correct', function() {
    expect(validateGrid(grid2_solved)).to.be.true;
  });

  it('should validate Extreme grid as correct', function() {
    expect(validateGrid(extreme_solved)).to.be.true;
  });
});

describe('Kudoku solver (reference solver)', function() {
  it('should solve grid 1', function() {
    const result = kudokuResolve(grid1);
    expect(validateGrid(result)).to.be.true;
  });

  it('should solve grid 2', function() {
    const result = kudokuResolve(grid2);
    expect(validateGrid(result)).to.be.true;
  });

  it('should solve extreme', function() {
    const result = kudokuResolve(extreme);
    expect(validateGrid(result)).to.be.true;
  });
});

describe('Sudoku Solver', function() {
  it(`should solve grid 1`, function() {
    const sudoku = new Sudoku(grid1);
    expect(validateGrid(sudoku.solve())).to.be.true;
  });

  it(`should solve grid 2`, function() {
    const sudoku = new Sudoku(grid2);
    expect(validateGrid(sudoku.solve())).to.be.true;
  });

  it(`should solve extreme`, function() {
    const sudoku = new Sudoku(extreme);
    expect(validateGrid(sudoku.solve())).to.be.true;
  });
});