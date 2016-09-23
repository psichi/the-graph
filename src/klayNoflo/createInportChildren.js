const portSide = 'de.cau.cs.kieler.portSide'
const layerConstraint = 'de.cau.cs.kieler.klay.layered.layerConstraint'

export default function createInportChildren(graph, options, countIdx, index) {
  const { portProperties, nodeProperties, portConstraints } = options

  const inports = graph.inports
  const inportsKeys = Object.keys(inports)
  let countIndex = countIdx

  return inportsKeys.map((key) => {
    const inport = inports[key]
    const tempId = `inport:::${key}`

    // Inports just has only one output port
    const uniquePort = {
      id: inport.port,
      width: portProperties.width,
      height: portProperties.height,
      properties: {
        [portSide]: portProperties.outportSide
      }
    }

    const kChild = {
      id: tempId,
      labels: [{ text: key }],
      width: nodeProperties.width,
      height: nodeProperties.height,
      ports: [uniquePort],
      properties: {
        portConstraints,
        [layerConstraint]: 'FIRST_SEPARATE'
      }
    }

    index[tempId] = countIndex

    countIndex += 1

    return kChild
  })
}

