export default function scheduleWheelZoom() {
  if (isNaN(this.zoomFactor)) { return }

  const { minZoom, maxZoom, scale: scaleState, x: currentX, y: currentY } = this.state

  // Speed limit
  let zoomFactor

  zoomFactor = this.zoomFactor / -500
  zoomFactor = Math.min(0.5, Math.max(-0.5, zoomFactor))

  let scale

  scale = this.state.scale + (this.state.scale * zoomFactor)

  this.zoomFactor = 0

  if (scale < minZoom) {
    scale = minZoom
  } else if (scale > maxZoom) {
    scale = maxZoom
  }

  if (scale === scaleState) { return }

  // Zoom and pan transform-origin equivalent
  const scaleD = scale / scaleState
  const oX = this.zoomX
  const oY = this.zoomY
  const x = scaleD * (currentX - oX) + oX
  const y = scaleD * (currentY - oY) + oY

  this.setState({
    scale,
    x,
    y,
    tooltipVisible: false
  })
}
