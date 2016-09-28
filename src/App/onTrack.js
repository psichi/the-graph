export default function onTrack(event) {
  if (this.pinching) { return }

  const { x, y } = this.state
  const { movementX, movementY } = event

  const newState = {
    x: x + movementX,
    y: y + movementY
  }

  this.setState(newState)
}
