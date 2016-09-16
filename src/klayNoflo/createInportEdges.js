export default function createInportEdges (graph, currentEdge) {
  const {inports} = graph
  const inportsKeys = Object.keys(inports)

  return inportsKeys.map((name) => {
    const inport = inports[name]
    const target = inport.process
    const targetPort = target + '_' + inport.port
    const source = 'inport:::' + name
    const sourcePort = source + '_' + name
    const inportEdge = {
      id: 'e' + currentEdge++,
      source,
      sourcePort,
      target,
      targetPort
    }
    return inportEdge
  })
}
