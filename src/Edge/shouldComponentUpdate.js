export default function shouldComponentUpdate(nextProps /* , nextState */) {
  let positionsChanged

  if (nextProps.getPositions) {
    const newPositions = nextProps.getPositions()

    positionsChanged = (
      newPositions.sX !== this.positions.sX ||
      newPositions.sY !== this.positions.sY ||
      newPositions.tX !== this.positions.tX ||
      newPositions.tY !== this.positions.tY
    )

    if (positionsChanged) {
      this.positions = newPositions
    }
  } else {
    positionsChanged = (
      nextProps.sX !== this.positions.sX ||
      nextProps.sY !== this.positions.sY ||
      nextProps.tX !== this.positions.tX ||
      nextProps.tY !== this.positions.tY
    )
  }

  // Only re-render if changed
  return (
    positionsChanged ||
    nextProps.selected !== this.props.selected ||
    nextProps.animated !== this.props.animated ||
    nextProps.route !== this.props.route
  )
}

