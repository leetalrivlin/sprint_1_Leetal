'use strict';
const MINE = '*';
const EMPTY = '';
const FLAG = '^';
const SMILEY = '🙂';
const WIN = '🥳';
const LOOSE = '😫';

var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gBoard;
var gGame;
var gMines;
var gTimerInterval;

function initGame() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard);
}

function changeLevel(elLevelBtn) {
  resetTimer();
  var levelSize = elLevelBtn.dataset.size;
  var levelMinesAmount = elLevelBtn.dataset.mines;
  gLevel.SIZE = levelSize;
  gLevel.MINES = levelMinesAmount;
  initGame();
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
    var minePos = { i: minePosI, j: minePosJ };
    gMines.push(minePos);
  }
  return board;
}

function setMinesNegsCount(board, size) {
  //Go through every cell in board
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var currI = i;
      var currJ = j;
      var minesCount = minesNegsCount(board, size, currI, currJ);
      board[i][j].minesAroundCount = minesCount;
    }
  }
}
// check for mines neighbors
function minesNegsCount(board, size, currI, currJ) {
  var MinesNegsCount = 0;
  var negs = getNegs(size, currI, currJ);
  for (var x = 0; x < negs.length; x++) {
    //Model
    var currNeg = negs[x];
    var neg = board[currNeg.i][currNeg.j];
    if (neg.isMine) {
      MinesNegsCount++;
    }
  }
  return MinesNegsCount;
}

//Gets all neighbors
function getNegs(size, currI, currJ) {
  var neighbors = [];
  for (var i = currI - 1; i <= currI + 1; i++) {
    if (i < 0 || i > size - 1) continue;
    for (var j = currJ - 1; j <= currJ + 1; j++) {
      if (j < 0 || j > size - 1) continue;
      var neighbor = { i: i, j: j };

      if (neighbor.i === currI && neighbor.j === currJ) continue;
      neighbors.push(neighbor);
    }
  }
  return neighbors;
}

function renderBoard(board) {
  var strHTML = '<table><tbody>';
  for (var i = 0; i < board[0].length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      var cellType = cell.isMine ? MINE : cell.minesAroundCount;
      if (!cell.isMine && cell.minesAroundCount === 0) cellType = EMPTY;
      strHTML += `<td class="cell cell-${i}-${j} cell-cover" data-celltype="${cellType}" onmousedown="cellClicked(this, ${i}, ${j}, event)"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';

  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
  var elFlagscounter = document.querySelector('.flags-counter');
  elFlagscounter.innerText = gLevel.MINES;
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerText = SMILEY;

  elContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

function startTimer() {
  var startTime = Date.now();
  gTimerInterval = setInterval(getSecsPassed, 1000, startTime);
}

function getSecsPassed(startTime) {
  gGame.secsPassed = parseInt((Date.now() - startTime) / 1000);
  var elTimer = document.querySelector('.timer');
  var printedTime = get3Digits(gGame.secsPassed);
  elTimer.innerText = printedTime;
}

function resetTimer() {
  gGame.secsPassed = 0;
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = '000';
}

function cellClicked(elCell, i, j, e) {
  if (!gGame.isOn) return;
  var elCoveredCells = document.querySelectorAll('.cell-cover');
  var cellsAmount = gLevel.SIZE ** 2;
  if (elCoveredCells.length === cellsAmount) startTimer();

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
  checkGameOver(i, j);
}

function cellReveales(elCell, i, j) {
  if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return;
  //modal
  gBoard[i][j].isShown = true;
  gGame.shownCount++;
  // DOM
  elCell.classList.remove('cell-cover');
  var cellType = elCell.dataset.celltype;
  elCell.innerText = cellType;

  if (gBoard[i][j].isMine) {
    checkGameOver(i, j);
  } else if (gBoard[i][j].minesAroundCount === 0) {
    var negs = getNegs(gLevel.SIZE, i, j);
    console.log('negs', negs);
    for (var x = 0; x < negs.length; x++) {
      //Model
      var currNeg = negs[x];
      var neg = gBoard[currNeg.i][currNeg.j];
      if (neg.isShown === false) {
        neg.isShown = true;
        gGame.shownCount++;
        //DOM
        var elNegCell = document.querySelector(
          `.cell-${currNeg.i}-${currNeg.j}`
        );
        elNegCell.classList.remove('cell-cover');
      }
      console.log('gGame.shownCount', gGame.shownCount);
    }
    checkGameOver(i, j);
  } else if (gBoard[i][j].minesAroundCount !== 0) {
    checkGameOver(i, j);
  }
}

function checkGameOver(i, j) {
  var cellsAmount = gLevel.SIZE ** 2;
  //When loosing
  if (gBoard[i][j].isMine && gBoard[i][j].isMarked === false) {
    for (var x = 0; x < gMines.length; x++) {
      var otherMine = gMines[x];
      if (otherMine.i === i && otherMine.j === j) continue;
      var elOtherMine = document.querySelector(
        `.cell-${otherMine.i}-${otherMine.j}`
      );
      elOtherMine.classList.remove('cell-cover');
      elOtherMine.innerText = elOtherMine.dataset.celltype;
    }
    console.log('Game over! you loose');

    clearInterval(gTimerInterval);
    gTimerInterval = null;

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = LOOSE;
    gGame.isOn = false;
    // When winning
  } else if (gGame.shownCount + gGame.markedCount === cellsAmount) {
    console.log("You win! You're the bomb!");

    clearInterval(gTimerInterval);
    gTimerInterval = null;

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = WIN;
  }
}

function restart() {
  resetTimer();
  initGame();
}
