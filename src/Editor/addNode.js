export default function addNode(id, component, metadata) {
  if (!this.graph) { return }
  this.graph.addNode(id, component, metadata)
}
