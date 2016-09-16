export default function createNodeEdges (graph, currentEdge) {
  return graph.edges.map((edge) => {
    if (edge.data !== undefined) {
      return
    }
    const source = edge.from.node
    const sourcePort = edge.from.port
    const target = edge.to.node
    const targetPort = edge.to.port

    return {
      id: 'e' + currentEdge++,
      source: source,
      sourcePort: source + '_' + sourcePort,
      target: target,
      targetPort: target + '_' + targetPort
    }
  })
}
