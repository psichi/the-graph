const layerConstraint = 'de.cau.cs.kieler.klay.layered.layerConstraint'
const portSide = 'de.cau.cs.kieler.portSide'

export default function createOutportChildren(graph, options, countIdx, index) {
  const { portProperties, nodeProperties, portConstraints } = options

  const outports = graph.outports
  const outportsKeys = Object.keys(outports)

  let countIndex = countIdx

  return outportsKeys.map((key) => {
    const outport = outports[key]
    const tempId = `outport:::${key}`
    // Outports just has only one input port
    const uniquePort = {
      id: outport.port,
      width: portProperties.width,
      height: portProperties.height,
      properties: {
        [portSide]: portProperties.inportSide
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
        [layerConstraint]: 'LAST_SEPARATE'
      }
    }

    index[tempId] = countIndex

    countIndex += 1

    return kChild
  })
}
