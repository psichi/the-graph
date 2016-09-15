// rAF shim
/*
window.requestAnimationFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame
*/

const origAF = window.requestAnimationFrame;

window.requestAnimationFrame = function myAnimationFrame (callback) {
  if (window.superweird) {
  }
  console.log('REQUESTNEW ANIMATION FRAME!')
  return origAF(callback)
}
