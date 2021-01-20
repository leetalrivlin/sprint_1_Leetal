function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board[0].length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j];
        var cellType = (cell.isMine) ? MINE : cell.minesAroundCount;
        strHTML += `<td class="cell cell${i}-${j}">${cellType}</td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;  
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }