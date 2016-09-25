export default function onWheel(event) {
  // Don't bounce
  event.preventDefault()

  if (!this.zoomFactor) { // WAT
    this.zoomFactor = 0
  }

  // Safari is wheelDeltaY
  this.zoomFactor += event.deltaY ? event.deltaY : 0 - event.wheelDeltaY
  this.zoomX = event.clientX
  this.zoomY = event.clientY

  requestAnimationFrame(this.scheduleWheelZoom)
}
