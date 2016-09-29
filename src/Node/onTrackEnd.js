export default function onTrackEnd(event) {
  // Don't fire on graph
  // event.stopPropagation()

  const { exportKey, graph, isIn, node, nodeID, onTrackEnd } = this.props
  const _export = this.props.export

  /*
   const domNode = findDOMNode(this)
   domNode.removeEventListener('track', this.onTrack)
   domNode.removeEventListener('trackend', this.onTrackEnd)
   */

  // Snap to grid
  const snapToGrid = true
  const snap = Config.node.snap / 2

  if (onTrackEnd) {
    onTrackEnd({
      exportKey,
      isIn,
      node,
      nodeID,
      export: _export
    })
  }

  // move elsewhere
  if (graph) {
    if (snapToGrid) {
      if (_export && _export.metadata) {
        const newPos = {
          x: Math.round(_export.metadata.x / snap) * snap,
          y: Math.round(_export.metadata.y / snap) * snap
        }

        if (isIn) {
          graph.setInportMetadata(exportKey, newPos)
        } else {
          graph.setOutportMetadata(exportKey, newPos)
        }
      } else {
        graph.setNodeMetadata(nodeID, {
          x: Math.round(node.metadata.x / snap) * snap,
          y: Math.round(node.metadata.y / snap) * snap
        })
      }
    }

    // Moving a node should only be a single transaction
    if (_export && _export.metadata) {
      graph.endTransaction('moveexport')
    } else {
      graph.endTransaction('movenode')
    }
  }
}
