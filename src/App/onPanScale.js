export default function onPanScale() {
  const { x, y, scale } = this.state
  const { onPanScale } = this.props

  // Pass pan/scale out to the-graph
  if (onPanScale) {
    onPanScale(x, y, scale)
  }
}
