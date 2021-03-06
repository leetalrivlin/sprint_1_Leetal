'use strict';
const MINE = '💣';
const EMPTY = '';
const FLAG = '🚩';
const SMILEY = '🙂';
const WIN = '🥳';
const LOOSE = '😫';
const OOPS = '🤪';

var gLevel = {
  SIZE: 4,
  MINES: 2,
  BESTSCORE: 999,
};
var gBoard;
var gGame;
var gMines;
var gIsFirstClickMine;

function initGame() {
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
  };
  gBoard = buildBoard(gLevel.SIZE);
  renderBoard(gBoard, gLevel.SIZE);
  var elSentence = document.querySelector('.sentence');
  elSentence.style.visibility = 'hidden';
  var elBestScore = document.querySelector('.best-score span');
  elBestScore.innerText = gLevel.BESTSCORE;
}

function changeLevel(elLevelBtn) {
  stopTimer();
  resetTimer();
  var levelSize = elLevelBtn.dataset.size;
  var levelMinesAmount = elLevelBtn.dataset.mines;
  gLevel.SIZE = levelSize;
  gLevel.MINES = levelMinesAmount;
  var localBestScore = window.localStorage.getItem(`level-size-${gLevel.SIZE}`);
  gLevel.BESTSCORE = localBestScore ? localBestScore : '999';
  var elBestScore = document.querySelector('.best-score span');
  elBestScore.innerText = gLevel.BESTSCORE;
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

  return board;
}

function getRandMines(board, size) {
  gMines = [];

  for (var x = 0; x < gLevel.MINES; x++) {
    var minePosI = getRandomInteger(0, size);
    var minePosJ = getRandomInteger(0, size);

    // Checking that the mine pos is not already with a mine
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
// Sets the number on the cell
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
// Checks for mines neighbors
function minesNegsCount(board, size, currI, currJ) {
  var MinesNegsCount = 0;
  var negs = getNegs(size, currI, currJ);
  for (var x = 0; x < negs.length; x++) {
    var currNeg = negs[x];
    var neg = board[currNeg.i][currNeg.j];
    if (neg.isMine) {
      MinesNegsCount++;
    }
  }
  return MinesNegsCount;
}

function renderBoard(board, size) {
  var strHTML = '<table><tbody>';
  for (var i = 0; i < size; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < size; j++) {
      var cell = board[i][j];

      if (cell.isMine) {
        var cellType = MINE;
      } else if (!cell.isMine && cell.minesAroundCount === 0) {
        cellType = EMPTY;
      } else if (!cell.isMine && cell.minesAroundCount > 0) {
        cellType = cell.minesAroundCount;
      }
      strHTML += `<td class="cell cell-${i}-${j} cell-cover" data-celltype="${cellType}" onmousedown="cellClicked(this, ${i}, ${j}, event)"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';

  var elContainer = document.querySelector('.board-container');
  elContainer.innerHTML = strHTML;
  var elFlagscounter = document.querySelector('.flags-counter span');
  elFlagscounter.innerText = gLevel.MINES;
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerText = SMILEY;
  var elLive = document.querySelector('.lives span');
  elLive.innerText = gGame.lives;

  elContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

// On mouse click
function cellClicked(elCell, i, j, e) {
  if (!gGame.isOn) return;

  var elCoveredCells = document.querySelectorAll('.cell-cover');
  var cellsAmount = gLevel.SIZE ** 2;
  // If its the first click (right/left)
  if (elCoveredCells.length === cellsAmount) startTimer();

  switch (e.button) {
    case 2: // right click
      cellMarked(elCell, i, j);
      break;

    case 0: // left click
      cellReveales(elCell, i, j, elCoveredCells, cellsAmount);
      break;
  }
}

//Right click actions
function cellMarked(elCell, i, j) {
  if (gBoard[i][j].isShown) return;
  if (!gBoard[i][j].isMarked) {
    if (gGame.markedCount >= gLevel.MINES) return;
    //modal
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    // DOM
    elCell.innerText = FLAG; //put FLAG
  } else {
    //modal
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
    // DOM
    elCell.innerText = ''; //remove flag
  }

  var elFlagscounter = document.querySelector('.flags-counter span');
  elFlagscounter.innerText = gLevel.MINES - gGame.markedCount;
  checkGameOver(i, j);
}

// Left click actions
function cellReveales(elCell, i, j, elCoveredCells, cellsAmount) {
  //If the cell is already with flag or shown, dont do anything
  if (gBoard[i][j].isMarked || gBoard[i][j].isShown) return;

  //modal
  gBoard[i][j].isShown = true;
  gGame.shownCount++;
  // DOM
  elCell.classList.remove('cell-cover');
  var cellType = elCell.dataset.celltype;
  elCell.innerText = cellType; // The text on the revealed cell

  // If stepped on mine
  if (gBoard[i][j].isMine) {
    checkGameOver(i, j);

    // If empty cell, reveale all neighbors
  } else if (gBoard[i][j].minesAroundCount === 0) {
    expandShown(i, j);
    
    // if cell is a number (has mines neighbors)
  } else if (gBoard[i][j].minesAroundCount > 0) {
    checkGameOver(i, j);
  }
}

function expandShown(i, j) {

  checkGameOver(i, j);

  var negs = getNegs(gLevel.SIZE, i, j);
  for (var x = 0; x < negs.length; x++) {
    //Model
    var currNeg = negs[x];
    var neg = gBoard[currNeg.i][currNeg.j];
    //if the neighbor is not revealed, open it
    if (!neg.isShown) {
      neg.isShown = true;
      gGame.shownCount++;
      
      //DOM
      var elNegCell = document.querySelector(
        `.cell-${currNeg.i}-${currNeg.j}`
        );
        elNegCell.classList.remove('cell-cover');
        var cellType = elNegCell.dataset.celltype;
        elNegCell.innerText = cellType;
    }
  }
}

function checkGameOver(i, j) {
  var cellsAmount = gLevel.SIZE ** 2;

  //When loosing first three times
  if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    // check lives
    if (gGame.lives > 1) {
      gGame.lives--;

      var elLive = document.querySelector('.lives span');
      elLive.innerText = gGame.lives;

      var elSmiley = document.querySelector('.smiley');
      elSmiley.innerText = OOPS;
      var smileyInterval = setTimeout(function () {
        elSmiley.innerText = SMILEY;
      }, 900);
      return;

    } else if (gGame.lives === 1) {
      gGame.lives--;

      // reveale all other mines
      for (var x = 0; x < gMines.length; x++) {
        var otherMine = gMines[x];
        if (otherMine.i === i && otherMine.j === j) continue;

        var elOtherMine = document.querySelector(
          `.cell-${otherMine.i}-${otherMine.j}`
        );
        elOtherMine.classList.remove('cell-cover');
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        elOtherMine.innerText = elOtherMine.dataset.celltype;
      }

      var elSmiley = document.querySelector('.smiley');
      elSmiley.innerText = LOOSE;

      var elLive = document.querySelector('.lives span');
      elLive.innerText = gGame.lives;

      var elSentence = document.querySelector('.sentence');
      elSentence.innerText = 'Game over! you loose!';
      elSentence.style.color = 'red';
      elSentence.style.visibility = 'visible';

      gGame.isOn = false;

      stopTimer();
      clearTimeout(smileyInterval);
      smileyInterval = null;
    }

    // When winning
  } else if (
    gGame.shownCount + gGame.markedCount === cellsAmount ||
    gGame.shownCount === cellsAmount
  ) {
    var elSentence = document.querySelector('.sentence');
    elSentence.innerText = "You win! You're the bomb!";
    elSentence.style.color = 'white';
    elSentence.style.visibility = 'visible';

    updateBestScore(gLevel.SIZE);
    stopTimer();

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = WIN;
  }
}

function restart() {
  stopTimer();
  resetTimer();
  initGame();
}
