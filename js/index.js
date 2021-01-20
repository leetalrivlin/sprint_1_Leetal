'use strict';
const MINE = '*';
const EMPTY = '';

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
  getRandMines(board, size);
  // Checking for mines neighbors
  setMinesNegsCount(board, size);

  console.table(board);
  return board;
}

function getRandMines(board, size) {
  for (var x = 0; x < gLevel.MINES; x++) {
    var minePosI = getRandomInteger(0, size);
    var minePosJ = getRandomInteger(0, size);
    // Check that the mine pos is not already with a mine
    while (board[minePosI][minePosJ].isMine) {
      minePosI = getRandomInteger(0, size);
      minePosJ = getRandomInteger(0, size);
    }
    board[minePosI][minePosJ].isMine = true;
  }
  return board;
}

function setMinesNegsCount(board, size) {
  //Go through every cell
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var currI = i;
      var currJ = j;
      var minesCount = minesNegsCount(board, size, currI, currJ);
      board[i][j].minesAroundCount = minesCount;
    }
  }
}
// check neighbors
function minesNegsCount(board, size, currI, currJ) {
  var MinesNegsCount = 0;
  for (var i = currI - 1; i <= currI + 1; i++) {
    if (i < 0 || i > size - 1) continue;
    for (var j = currJ - 1; j <= currJ + 1; j++) {
      if (j < 0 || j > size - 1) continue;
      var neighbor = board[i][j];

      if (i === currI && j === currJ) continue;
      if (neighbor.isMine) {
        MinesNegsCount++;
      }
    }
  }
  return MinesNegsCount;
}

function renderBoard(board) {
  var strHTML = '<table><tbody>';
  for (var i = 0; i < board[0].length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      var cellType = cell.isMine ? MINE : cell.minesAroundCount;
      if (!cell.isMine && cell.minesAroundCount === 0) cellType = EMPTY;
      strHTML += `<td class="cell cell${i}-${j}" cellClicked(this, i, j)>${cellType}</td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {}
