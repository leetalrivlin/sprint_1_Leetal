'use strict';
var gTimerInterval;

function get3Digits(seconds) {
  if (seconds < 10) {
    var zeros = '00';
  } else if (seconds < 99) {
    zeros = '0';
  } else {
    zeros = '';
  }
  return zeros + seconds;
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

function stopTimer() {
  clearInterval(gTimerInterval);
  gTimerInterval = null;
}

function resetTimer() {
  gGame.secsPassed = 0;
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = '000';
}

function updateBestScore(currBoardSize) {
  var level = `level-size-${currBoardSize}`;
  var currScore = `${gGame.secsPassed}`;
  var localBestScore = window.localStorage.getItem(level);
  var elBestScore = document.querySelector('.best-score span');

  if (!localBestScore || !currScore) {
    window.localStorage.setItem(level, '999');
  } else if (currScore < localBestScore) {
    console.log(
      'the currScore:',
      currScore,
      'the BESTSCORE',
      gLevel.BESTSCORE,
      'localBestScore',
      localBestScore
    );
    gLevel.BESTSCORE = currScore;
    localBestScore = window.localStorage.setItem(level, `${gLevel.BESTSCORE}`);
    elBestScore.innerText = gLevel.BESTSCORE;
  }
}
