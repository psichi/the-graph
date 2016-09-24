export default function onTransformStart(event) {
  // Don't drag nodes
  event.srcEvent.stopPropagation()
  event.srcEvent.stopImmediatePropagation()

  // Hammer.js
  this.lastScale = 1
  this.lastX = event.center.x
  this.lastY = event.center.y
  this.pinching = true
}
