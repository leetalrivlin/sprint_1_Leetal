'use strict';
const MINE = '*';

var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function initGame() {
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);
}

function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: true,
        isMine: false,
        isMarked: true,
      };
    }
  }
  // Placing mines
  board = getRandMines(board, size);
  console.table(board);
  return board;
}

function getRandMines(board, size) {
  var mines = [];
  for (var x = 0; x < gLevel.MINES; x++) {
    var minePosI = getRandomInteger(0, size);
    var minePosJ = getRandomInteger(0, size);
    // Check that the mine pos is not already with a mine
    while (board[minePosI][minePosJ].isMine) {
      minePosI = getRandomInteger(0, size);
      minePosJ = getRandomInteger(0, size);
    }
    board[minePosI][minePosJ].isMine = true;

    // mines array is for me- delete afterwords!!!
    var mine = { i: minePosI, j: minePosJ };
    mines.push(mine);
  }
  console.log('mines', mines);
  return board
}
