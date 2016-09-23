export default function createNodeEdges(graph, currentEdge) {
  let edgeIndex = currentEdge

  return graph.edges.map((edge) => {
    if (edge.data !== undefined) {
      return
    }
    const source = edge.from.node
    const sourcePort = edge.from.port
    const target = edge.to.node
    const targetPort = edge.to.port

    edgeIndex += 1

    const nodeEdge = {
      id: `e${edgeIndex}`,
      source,
      sourcePort: source + '_' + sourcePort,
      target,
      targetPort: target + '_' + targetPort
    }

    return nodeEdge
  })
}
