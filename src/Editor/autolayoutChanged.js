export default function autolayoutChanged() {
  if (!this.graph) { return }
  // Only listen to changes that affect layout
  if (this.autolayout) {
    this.graph.on('addNode', this.triggerAutolayou)
    this.graph.on('removeNode', this.triggerAutolayout)
    this.graph.on('addInport', this.triggerAutolayout)
    this.graph.on('removeInport', this.triggerAutolayout)
    this.graph.on('addOutport', this.triggerAutolayout)
    this.graph.on('removeOutport', this.triggerAutolayout)
    this.graph.on('addEdge', this.triggerAutolayout)
    this.graph.on('removeEdge', this.triggerAutolayout)
  } else {
    this.graph.removeListener('addNode', this.triggerAutolayout)
    this.graph.removeListener('removeNode', this.triggerAutolayout)
    this.graph.removeListener('addInport', this.triggerAutolayout)
    this.graph.removeListener('removeInport', this.triggerAutolayout)
    this.graph.removeListener('addOutport', this.triggerAutolayout)
    this.graph.removeListener('removeOutport', this.triggerAutolayout)
    this.graph.removeListener('addEdge', this.triggerAutolayout)
    this.graph.removeListener('removeEdge', this.triggerAutolayout)
  }
}
