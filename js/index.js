'use strict';
const MINE = '*';
const EMPTY = '';
const FLAG = '^';

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
var gMines;

function initGame() {
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);
  gGame.isOn = true;
}

function buildBoard(size) {
  var board = [];
  for (var i = 0; i < size; i++) {
    board[i] = [];
    for (var j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
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
  gMines = [];
  for (var x = 0; x < gLevel.MINES; x++) {
    var minePosI = getRandomInteger(0, size);
    var minePosJ = getRandomInteger(0, size);
    // Checking that the mine pos is not already with a mine or first clicked////
    while (board[minePosI][minePosJ].isMine) {
      minePosI = getRandomInteger(0, size);
      minePosJ = getRandomInteger(0, size);
    }
    board[minePosI][minePosJ].isMine = true;
    var minePos = {i: minePosI, j: minePosJ};
    gMines.push(minePos);
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
      strHTML += `<td class="cell cell-${i}-${j} cellCover" data-celltype="${cellType}" onmousedown="cellClicked(this, ${i}, ${j}, event)"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';

  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
  var elFlagscounter = document.querySelector('.flags-counter');
  elFlagscounter.innerText = gLevel.MINES;

  elContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

function cellClicked(elCell, i, j, e) {
  // var startTime = Date.now();

  switch (e.button) {
    case 2: // right click
      cellMarked(elCell, i, j);
      break;

    case 0: // left click
      cellReveales(elCell, i, j);
      break;
  }
}

function cellMarked(elCell, i, j) {
  if (!gBoard[i][j].isMarked) {
    if (gGame.markedCount === gLevel.MINES) return;
    //modal
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    // DOM
    elCell.innerText = FLAG;
  } else {
    //modal
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
    // DOM
    elCell.innerText = EMPTY;
  }

  var elFlagscounter = document.querySelector('.flags-counter');
  elFlagscounter.innerText = gLevel.MINES - gGame.markedCount;
  checkGameOver(elCell, i, j);
}
function cellReveales(elCell, i, j) {
  if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return;
  //modal
  gBoard[i][j].isShown = true;
  gGame.shownCount++;
  // DOM
  elCell.classList.remove('cellCover');
  var cellType = elCell.dataset.celltype;
  elCell.innerText = cellType;
  checkGameOver(elCell, i, j);
}

function checkGameOver(elCell, i, j) {
  var cellsAmount = gLevel.SIZE ** 2;
  if (gBoard[i][j].isMine && gBoard[i][j].isMarked === false) {
    for (var x = 0; x < gMines.length; x++) {
      var otherMine = gMines[x];
      if (otherMine.i !== i && otherMine.j !== j) {
        console.log('otherMine',otherMine);
        var elOtherMine = document.querySelector(`.cell-${otherMine.i}-${otherMine.j}`);
        elOtherMine.classList.remove('cellCover');
        elOtherMine.innerText = elOtherMine.dataset.celltype;
      }
    }
console.log('Game over! you loose');
  } else if ((gGame.shownCount + gGame.markedCount) === cellsAmount) {
console.log('You win!');
  }
}
