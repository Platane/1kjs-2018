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

const canvas = (window.canvas = window.a = document.getElementById('canvas'))
canvas.width = window.innerWidth - 3
canvas.height = window.innerHeight - 3
window.b = document.body
window.ctx = window.c = canvas.getContext('2d')
window.d = document
