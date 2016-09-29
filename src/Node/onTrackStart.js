export default function onTrackStart(event) {
  // Don't drag graph
  // event.stopPropagation()

  // Don't change selection
  // event.preventTap()

  const { app, graph, onTrackStart } = this.props
  const _export = this.props.export

  // Don't drag under menu
  if (app && app.menuShown) { return }

  // Don't drag while pinching
  if (app && app.pinching) { return }

  /*
   const domNode = findDOMNode(this)
   domNode.addEventListener('track', this.onTrack)
   domNode.addEventListener('trackend', this.onTrackEnd)
   */

  if (onTrackStart) {
    // should probably not be the entire event
    onTrackStart(event)
  }

  // Should be done by whatever is going to handle us
  // Moving a node should only be a single transaction
  if (graph) {
    if (_export) {
      graph.startTransaction('moveexport')
    } else {
      graph.startTransaction('movenode')
    }
  }
}
