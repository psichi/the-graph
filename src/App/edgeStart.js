// should be 'forwarded' through props, not like this.
// disabled is now directly going to graph, context is not handled yet.
export default function edgeStart(event) {
  const { graph } = this.refs

  // Listened from PortMenu.edgeStart() and Port.edgeStart()
  graph.edgeStart(event)

  this.hideContext()
}
