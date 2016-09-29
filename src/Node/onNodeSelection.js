export default function onNodeSelection(event) {
  // Don't tap app (unselect)
  // Hammer 2.0 does not have it, fix later
  // see: https://stackoverflow.com/questions/26027362/how-to-stoppropagation-w-hammer-js-2-0
  // event.stopPropagation()

  const { nodeID, node, onNodeSelection } = this.props

  const toggle = (this.metaKeyPressed || event.pointerType === 'touch')

  if (onNodeSelection) {
    onNodeSelection(nodeID, node, toggle)
  }
}

