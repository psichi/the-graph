export default function renderPreviewEdge(event) {
  const { app: { state: { offsetX, offsetY, scale, x: appX, y: appY } } } = this.props

  let x = event.x || event.clientX || 0
  let y = event.y || event.clientY || 0

  x -= offsetX || 0
  y -= offsetY || 0

  this.setState({
    edgePreviewX: (x - appX) / scale,
    edgePreviewY: (y - appY) / scale
  })

  this.markDirty()
}
