export default function edgeStart(event) {
  const { graph } = this.refs

  // Listened from PortMenu.edgeStart() and Port.edgeStart()
  graph.edgeStart(event)

  this.hideContext()
}
