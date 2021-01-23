function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
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
