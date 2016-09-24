export default function onTransformEnd(event) {
  // Don't drag nodes
  event.srcEvent.stopPropagation()
  event.srcEvent.stopImmediatePropagation()

  // Hammer.js
  this.pinching = false
}
