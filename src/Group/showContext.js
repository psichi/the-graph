export default function showContext(event) {
  // Don't show native context menu
  event.preventDefault()

  // Don't tap graph on hold event
  event.stopPropagation()
  if (event.preventTap) { event.preventTap() }

  const { graph, label: itemKey, item, isSelectionGroup, showContext } = this.props

  // Get mouse position
  const x = event.x || event.clientX || 0
  const y = event.y || event.clientY || 0

  // App.showContext
  showContext({
    element: this,
    type: (isSelectionGroup ? 'selection' : 'group'),
    x,
    y,
    graph,
    itemKey,
    item
  })
}
