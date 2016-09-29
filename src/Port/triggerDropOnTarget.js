export default function triggerDropOnTarget(event) {
  // If dropped on a child element will bubble up to port

  // if (!event.relatedTarget) { return }
  if (!event.target) { return }

  if (this.props.onEdgeDrop) {
    this.props.onEdgeDrop({
      type: 'Edge/DROP',
      payload: null
    })
  }

  const dropEvent = new CustomEvent('the-graph-edge-drop', {
    detail: null,
    bubbles: true
  })

  // event.relatedTarget.dispatchEvent(dropEvent)
  event.target.dispatchEvent(dropEvent)
}
