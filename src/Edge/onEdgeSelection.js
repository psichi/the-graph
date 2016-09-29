export default function onEdgeSelection(event) {
  // Don't click app
  // event.stopPropagation()

  const { edgeID, edge, onEdgeSelection } = this.props

  // MetaKey must be tested per component also
  // const toggle = (TheGraph.metaKeyPressed || event.pointerType === 'touch')
  const toggle = (event.pointerType === 'touch')

  onEdgeSelection(edgeID, edge, toggle)
}

