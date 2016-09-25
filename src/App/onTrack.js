export default function onTrack(event) {
  if (this.pinching) { return }

  const { x, y } = this.state
  const { ddx, ddy } = event

  this.setState({
    x: x + ddx,
    y: y + ddy
  })
}
