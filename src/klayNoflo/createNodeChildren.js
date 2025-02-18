export default function createNodeChildren(graph, options, countIdx, index) {
  const { portInfo, portProperties, nodeProperties, portConstraints } = options
  const { nodes } = graph
  let countIndex = countIdx

  return nodes.map((node) => {
    const inPorts = portInfo[node.id].inports
    const inPortsKeys = Object.keys(inPorts)
    const inPortsTemp = inPortsKeys.map(key => ({
      id: `${node.id}_${key}`,
      width: portProperties.width,
      height: portProperties.height,
      x: portInfo[node.id].inports[key].x - portProperties.width,
      y: portInfo[node.id].inports[key].y
    }))
    const outPorts = portInfo[node.id].outports
    const outPortsKeys = Object.keys(outPorts)
    const outPortsTemp = outPortsKeys.map(key => ({
      id: `${node.id}_${key}`,
      width: portProperties.width,
      height: portProperties.height,
      x: portInfo[node.id].outports[key].x,
      y: portInfo[node.id].outports[key].y
    }))

    const kChild = {
      id: node.id,
      labels: [{ text: node.metadata.label || 'kChild no label' }],
      width: nodeProperties.width,
      height: nodeProperties.height,
      ports: inPortsTemp.concat(outPortsTemp),
      properties: {
        portConstraints
      }
    }

    index[node.id] = countIndex

    countIndex += 1

    return kChild
  })
}
