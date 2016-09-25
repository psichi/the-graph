import {findDOMNode} from 'react-dom'

export default function onTrackStart(event) {
  event.preventTap()

  const domNode = findDOMNode(this)

  domNode.addEventListener('track', this.onTrack)
  domNode.addEventListener('trackend', this.onTrackEnd)
}
