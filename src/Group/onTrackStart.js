import { findDOMNode } from 'react-dom'

export default function onTrackStart(event) {
  // Don't drag graph
  event.stopPropagation()

  const { graph, isSelectionGroup } = this.props
  const { box, label } = this.refs

  if (isSelectionGroup) {
    const boxEl = findDOMNode(box)

    boxEl.addEventListener('track', this.onTrack)
    boxEl.addEventListener('trackend', this.onTrackEnd)
  } else {
    const labelEl = findDOMNode(label)

    labelEl.addEventListener('track', this.onTrack)
    labelEl.addEventListener('trackend', this.onTrackEnd)
  }

  graph.startTransaction('movegroup')
}
