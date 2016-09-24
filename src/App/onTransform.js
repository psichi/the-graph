export default function onTransform(event) {
  // Don't drag nodes
  event.srcEvent.stopPropagation()
  event.srcEvent.stopImmediatePropagation()

  const { minZoom } = this.props

  // Hammer.js
  const { scale: currentScale, x: currentX, y: currentY } = this.state
  const { scale: scaleEvent, center: { x: oX, y: oY } } = event
  const scaleDelta = 1 + (scaleEvent - this.lastScale)

  this.lastScale = scaleEvent

  let scale

  scale = scaleDelta * currentScale
  scale = Math.max(scale, minZoom)

  // Zoom and pan transform-origin equivalent
  const deltaX = oX - this.lastX
  const deltaY = oY - this.lastY
  const x = scaleDelta * (currentX - oX) + oX + deltaX
  const y = scaleDelta * (currentY - oY) + oY + deltaY

  this.lastX = oX
  this.lastY = oY

  this.setState({
    scale,
    x,
    y,
    tooltipVisible: false
  })
}
