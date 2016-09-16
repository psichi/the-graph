export default function createInportChildren (graph, options, countIdx, index) {
  const {portProperties, nodeProperties, portConstraints} = options

  const inports = graph.inports
  const inportsKeys = Object.keys(inports)

  return inportsKeys.map((key) => {
    const inport = inports[key]
    const tempId = 'inport:::' + key

    // Inports just has only one output port
    const uniquePort = {
      id: inport.port,
      width: portProperties.width,
      height: portProperties.height,
      properties: {
        'de.cau.cs.kieler.portSide': portProperties.outportSide
      }
    }

    const kChild = {
      id: tempId,
      labels: [{text: key}],
      width: nodeProperties.width,
      height: nodeProperties.height,
      ports: [uniquePort],
      properties: {
        'portConstraints': portConstraints,
        'de.cau.cs.kieler.klay.layered.layerConstraint': 'FIRST_SEPARATE'
      }
    }

    index[tempId] = countIdx++

    return kChild
  })
}

