export default function addNode(id: string, component: string, metadata: Object) {
  if (!this.graph) { return }

  this.graph.addNode(id, component, metadata)
}
