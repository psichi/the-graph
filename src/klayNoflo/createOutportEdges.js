export default function createOutportEdges(graph, currentEdge) {
  const outports = graph.outports
  const outportsKeys = Object.keys(outports)
  let edgeIndex = currentEdge

  return outportsKeys.map((name) => {
    const outport = outports[name]
    const source = outport.process
    const sourcePort = `${source}_${outport.port}`
    const target = `${outport}:::${name}`
    const targetPort = `${target}_${name}`
    const outportEdge = {
      id: `e${edgeIndex}`,
      source,
      sourcePort,
      target,
      targetPort
    }

    edgeIndex += 1

    return outportEdge
  })
}

