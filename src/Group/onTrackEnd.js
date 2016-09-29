import { findDOMNode } from 'react-dom'

export default function onTrackEnd(event) {
  // Don't fire on graph
  event.stopPropagation()

  // Don't tap graph (deselect)
  event.preventTap()

  const { graph, isSelectionGroup, triggerMoveGroup, item: { nodes } } = this.props
  const { box, label } = this.refs

  // Snap to grid
  triggerMoveGroup(nodes)

  if (isSelectionGroup) {
    const boxEl = findDOMNode(box)

    boxEl.removeEventListener('track', this.onTrack)
    boxEl.removeEventListener('trackend', this.onTrackEnd)
  } else {
    const labelEl = findDOMNode(label)

    labelEl.removeEventListener('track', this.onTrack)
    labelEl.removeEventListener('trackend', this.onTrackEnd)
  }

  graph.endTransaction('movegroup')
}
