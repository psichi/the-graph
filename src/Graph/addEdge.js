export default function addEdge(edge) {
  this.state.graph.addEdge(edge.from.process, edge.from.port, edge.to.process, edge.to.port, edge.metadata)
}
