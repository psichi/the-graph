export default function renderGraph() {
  // not sure if this is the best place yet.
  this.refs.graph.markDirty()

  this.triggerAutolayout()
}
