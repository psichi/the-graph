export default function onTrack(event) {
  // Don't fire on graph
  event.stopPropagation()

  const { scale, triggerMoveGroup, item: { nodes } } = this.props

  const deltaX = Math.round(event.ddx / scale)
  const deltaY = Math.round(event.ddy / scale)

  triggerMoveGroup(nodes, deltaX, deltaY)
}
