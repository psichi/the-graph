export default function onTrack(event) {
  // Don't fire on graph
  // event.stopPropagation()

  // this should not need graph.
  // we send out, and then the graph is updated.
  const { graph, exportKey, isIn, node, nodeID, onTrack, scale } = this.props
  const _export = this.props.export

  /*
   const deltaX = Math.round(event.ddx / scale)
   const deltaY = Math.round(event.ddy / scale)
   */

  console.log('THE SCALE', scale)

  const deltaX = Math.round(event.movementX / scale)
  const deltaY = Math.round(event.movementY / scale)

  // Fires a change event on noflo graph, which triggers redraw
  let newPos

  if (_export && _export.metadata) {
    newPos = {
      x: _export.metadata.x + deltaX,
      y: _export.metadata.y + deltaY
    }

    /*
     if (isIn) {
     graph.setInportMetadata(exportKey, newPos)
     } else {
     graph.setOutportMetadata(exportKey, newPos)
     }
     */
  } else {
    newPos = {
      x: node.metadata.x + deltaX,
      y: node.metadata.y + deltaY
    }
  }

  // new
  if (onTrack) {
    onTrack({
      exportKey,
      isIn,
      node,
      nodeID,
      x: newPos.x,
      y: newPos.y,
      export: _export,
      scale
    })
  }

  // old
  if (graph) {
    if (_export && _export.metadata) {
      const newPos = {
        x: _export.metadata.x + deltaX,
        y: _export.metadata.y + deltaY
      }

      if (isIn) {
        graph.setInportMetadata(exportKey, newPos)
      } else {
        graph.setOutportMetadata(exportKey, newPos)
      }
    } else {
      graph.setNodeMetadata(nodeID, {
        x: node.metadata.x + deltaX,
        y: node.metadata.y + deltaY
      })
    }
  }
}
