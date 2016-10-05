export default function showContext(event: SyntheticMouseEvent) {
  // Don't show native context menu
  event.preventDefault()

  // Don't tap graph on hold event
  event.stopPropagation()
  if (event.preventTap) { event.preventTap() }

  const { isIn, graph, exportKey, node, nodeID, showContext } = this.props
  const _export = this.props.export

  // Get mouse position
  const x = event.x || event.clientX || 0
  const y = event.y || event.clientY || 0

  // App.showContext
  showContext({
    element: this,
    type: (_export ? (isIn ? 'graphInport' : 'graphOutport') : 'node'),
    x,
    y,
    graph,
    itemKey: (_export ? exportKey : nodeID),
    item: (_export ? _export : node)
  })
}

