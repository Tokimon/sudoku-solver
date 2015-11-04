'use strict';

import * as Grids from '../../grids';
import Sudoku from '../../Sudoku';

function writeGrid( grid ) {
  const rows = document.querySelectorAll("#SudokuBoard tr");

  for( let i = 0, l = rows.length; i < l; i++ ) {
    const row = rows[i];
    const gridRow = grid[i];

    const cells = row.querySelectorAll("td");

    for( let i2 = 0, l2 = cells.length; i2 < l2; i2++ ) {
      cells[i2].innerText = gridRow[i2] || '';
    }
  }
}

function readGrid() {
  const rows = document.querySelectorAll("#SudokuBoard tr");
  const grid = [];

  for( let i = 0, l = rows.length; i < l; i++ ) {
    const row = rows[i];
    const cells = row.querySelectorAll("td");

    grid[i] = grid[i] || [];

    for( let i2 = 0, l2 = cells.length; i2 < l2; i2++ ) {
      grid[i][i2] = parseInt(cells[i2].innerText) || 0;
    }
  }

  return grid;
}

function chooseGrid( node ) {
  const gridName = node.dataset.grid;
  writeGrid(Grids[gridName]);
  timerText('');
}

function listGrids() {
  const gridSection = document.getElementById("Grids");

  gridSection.innerHTML += `
  <div data-grid="grid1">Grid 1</div>
  <div data-grid="grid2">Grid 2</div>
  <div data-grid="extreme">Extreme Grid</div>
  `;

  const divs = gridSection.getElementsByTagName('div');

  for(let i = 0, l = divs.length; i < l; i++) {
    divs[i].addEventListener('click', function() { chooseGrid(this); }, false);
  }
}

function solve() {
  console.time('Sudoku Solved');
  const sudoku = new Sudoku(readGrid());
  writeGrid(sudoku.solve());
  console.timeEnd('Sudoku Solved');
  timerText('Sudoku solved. Completion time tracked in the console.');
}

function activateButton() {
  document.querySelector('.button').addEventListener('click', solve, false);
}

let timer;

function timerText( text ) {
  document.getElementById('Timer').innerText = text;
}

window.demo = function() {
  listGrids();
  activateButton();
};
