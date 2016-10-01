import { findDOMNode } from 'react-dom'

export default function showContext(event) {
  const { isExport, isIn, graph, label: itemKey, port: item, showContext } = this.props

  // const { label: labelRef } = this.refs

  // Don't show port menu on export node port
  if (isExport) {
    return
  }

  // Click on label, pass context menu to node
  /* TODO: restore whatever this is trying to prevent but without refs.
  if (event && (event.target === findDOMNode(labelRef))) {
    return
  }
  */

  // Don't show native context menu
  event.preventDefault()

  // Don't tap graph on hold event
  event.stopPropagation()
  if (event.preventTap) { event.preventTap() }

  // Get mouse position
  const x = event.x || event.clientX || 0
  const y = event.y || event.clientY || 0

  // App.showContext
  showContext({
    element: this,
    type: (isIn ? 'nodeInport' : 'nodeOutport'),
    x,
    y,
    graph,
    itemKey,
    item
  })
}
