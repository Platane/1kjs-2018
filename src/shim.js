/* global window, document, navigator */

window.AudioContext = window.AudioContext || window.webkitAudioContext
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(f) {
    window.setTimeout(f, 1000 / 30)
  }

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

window.a = document.getElementById('canvas')
window.a.width = window.innerWidth - 3
window.a.height = window.innerHeight - 3
window.b = document.body
window.c = window.a.getContext('2d')
window.d = document
