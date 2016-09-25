export default function applyAutolayout(layoutedKGraph) {
  const { graph, snap } = this.props

  if (!snap) {
    return
  }

  if (layoutedKGraph.stacktrace) {
    throw Error(layoutedKGraph.text)
  }

  graph.startTransaction('autolayout')
  // Update original graph nodes with the new coordinates from KIELER graph
  const children = layoutedKGraph.children.slice()
  let i
  let len
  for (i = 0, len = children.length; i < len; i++) {
    const klayNode = children[i]
    const nofloNode = graph.getNode(klayNode.id)

    // Encode nodes inside groups
    if (klayNode.children) {
      let idx
      const klayChildren = klayNode.children

      for (idx in klayChildren) {
        const klayChild = klayChildren[idx]
        if (klayChild.id) {
          graph.setNodeMetadata(klayChild.id, {
            x: Math.round((klayNode.x + klayChild.x) / snap) * snap,
            y: Math.round((klayNode.y + klayChild.y) / snap) * snap
          })
        }
      }
    }

    // Encode nodes outside groups
    if (nofloNode) {
      graph.setNodeMetadata(klayNode.id, {
        x: Math.round(klayNode.x / snap) * snap,
        y: Math.round(klayNode.y / snap) * snap
      })
    } else {
      // Find inport or outport
      const idSplit = klayNode.id.split(':::')
      const expDirection = idSplit[0]
      const expKey = idSplit[1]
      if (expDirection === 'inport' && graph.inports[expKey]) {
        graph.setInportMetadata(expKey, {
          x: Math.round(klayNode.x / snap) * snap,
          y: Math.round(klayNode.y / snap) * snap
        })
      } else if (expDirection === 'outport' && graph.outports[expKey]) {
        graph.setOutportMetadata(expKey, {
          x: Math.round(klayNode.x / snap) * snap,
          y: Math.round(klayNode.y / snap) * snap
        })
      }
    }
  }

  graph.endTransaction('autolayout')

  // Fit to window
  this.triggerFit()
}
