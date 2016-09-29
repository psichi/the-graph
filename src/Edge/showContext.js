export default function showContext(event) {
  // Don't show native context menu
  event.preventDefault()

  // Don't tap graph on hold event
  event.stopPropagation()
  if (event.preventTap) { event.preventTap() }

  const { isIn, exportKey, edge, graph, showContext } = this.props
  const _export = this.props.export

  // Get mouse position
  const x = event.x || event.clientX || 0
  const y = event.y || event.clientY || 0

  // App.showContext
  showContext({
    element: this,
    type: (_export ? (isIn ? 'graphInport' : 'graphOutport') : 'edge'),
    x,
    y,
    graph,
    itemKey: (_export ? exportKey : null),
    item: (_export ? _export : edge)
  })
}
