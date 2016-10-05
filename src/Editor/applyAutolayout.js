import { KGraph } from '../types'

export default function applyAutolayout(kGraph: KGraph) {
  this.graph.startTransaction('autolayout')

  // Update original graph nodes with the new coordinates from KIELER graph
  const children = kGraph.children.slice()

  let i, len
  for (i = 0, len = children.length; i < len; i++) {
    const klayNode = children[i]
    const nofloNode = this.graph.getNode(klayNode.id)

    // Encode nodes inside groups
    if (klayNode.children) {
      const klayChildren = klayNode.children
      let idx
      for (idx in klayChildren) {
        const klayChild = klayChildren[idx]
        if (klayChild.id) {
          this.graph.setNodeMetadata(klayChild.id, {
            x: Math.round((klayNode.x + klayChild.x) / this.snap) * this.snap,
            y: Math.round((klayNode.y + klayChild.y) / this.snap) * this.snap
          })
        }
      }
    }

    // Encode nodes outside groups
    if (nofloNode) {
      this.graph.setNodeMetadata(klayNode.id, {
        x: Math.round(klayNode.x / this.snap) * this.snap,
        y: Math.round(klayNode.y / this.snap) * this.snap
      })
    } else {
      // Find inport or outport
      const idSplit = klayNode.id.split(':::')
      const expDirection = idSplit[0]
      const expKey = idSplit[1]
      if (expDirection === 'inport' && this.graph.inports[expKey]) {
        this.graph.setInportMetadata(expKey, {
          x: Math.round(klayNode.x / this.snap) * this.snap,
          y: Math.round(klayNode.y / this.snap) * this.snap
        })
      } else if (expDirection === 'outport' && this.graph.outports[expKey]) {
        this.graph.setOutportMetadata(expKey, {
          x: Math.round(klayNode.x / this.snap) * this.snap,
          y: Math.round(klayNode.y / this.snap) * this.snap
        })
      }
    }
  }

  this.graph.endTransaction('autolayout')

  // Fit to window
  this.triggerFit()
}
