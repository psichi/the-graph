export default function onShowContext(event) {
  event.preventDefault()
  event.stopPropagation()
  if (event.preventTap) { event.preventTap() }

  const { graph } = this.props

  // Get mouse position
  const x = event.x || event.clientX || 0
  const y = event.y || event.clientY || 0

  // App.showContext
  this.showContext({
    element: this,
    type: 'main',
    x,
    y,
    graph,
    itemKey: 'graph',
    item: graph
  })
}
