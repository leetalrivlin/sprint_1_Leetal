function getRandomInteger(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

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
