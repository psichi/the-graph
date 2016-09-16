export default function createOutportEdges (graph, currentEdge) {
  const outports = graph.outports
  const outportsKeys = Object.keys(outports)

  return outportsKeys.map((name) => {
    const outport = outports[name]
    const source = outport.process
    const sourcePort = source + '_' + outport.port
    const target = 'outport:::' + name
    const targetPort = target + '_' + name
    const outportEdge = {
      id: 'e' + currentEdge++,
      source,
      sourcePort,
      target,
      targetPort
    }
    return outportEdge
  })
}

