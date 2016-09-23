export default function createInportEdges(graph, currentEdge) {
  const { inports } = graph
  const inportsKeys = Object.keys(inports)
  let edgeIndex = currentEdge

  return inportsKeys.map((name) => {
    const inport = inports[name]
    const target = inport.process
    const targetPort = `${target}_${inport.port}`
    const source = `inport:::${name}`
    const sourcePort = `${source}_${name}`
    const inportEdge = {
      id: `e${edgeIndex}`,
      source,
      sourcePort,
      target,
      targetPort
    }

    edgeIndex += 1

    return inportEdge
  })
}
