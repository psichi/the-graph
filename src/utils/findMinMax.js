export default function findMinMax (graph, nodes) {
  let inports
  let outports

  if (nodes === undefined) {
    nodes = graph.nodes.map(function (node) {
      return node.id
    })
    // Only look at exports when calculating the whole graph
    inports = graph.inports
    outports = graph.outports
  }

  if (nodes.length < 1) {
    return undefined
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  // Loop through nodes
  let len = nodes.length

  let i
  for (i = 0; i < len; i++) {
    const key = nodes[i]
    const node = graph.getNode(key)

    if (!node || !node.metadata) {
      continue
    }

    if (node.metadata.x < minX) { minX = node.metadata.x }
    if (node.metadata.y < minY) { minY = node.metadata.y }

    const x = node.metadata.x + node.metadata.width
    const y = node.metadata.y + node.metadata.height

    if (x > maxX) { maxX = x }
    if (y > maxY) { maxY = y }
  }
  // Loop through exports
  let exp
  if (inports) {
    const keys = Object.keys(inports)
    const len = keys.length
    for (i = 0; i < len; i++) {
      exp = inports[keys[i]]
      if (!exp.metadata) { continue }
      if (exp.metadata.x < minX) { minX = exp.metadata.x }
      if (exp.metadata.y < minY) { minY = exp.metadata.y }
      if (exp.metadata.x > maxX) { maxX = exp.metadata.x }
      if (exp.metadata.y > maxY) { maxY = exp.metadata.y }
    }
  }
  if (outports) {
    const keys = Object.keys(outports)
    const len = keys.length
    for (i = 0; i < len; i++) {
      exp = outports[keys[i]]
      if (!exp.metadata) { continue }
      if (exp.metadata.x < minX) { minX = exp.metadata.x }
      if (exp.metadata.y < minY) { minY = exp.metadata.y }
      if (exp.metadata.x > maxX) { maxX = exp.metadata.x }
      if (exp.metadata.y > maxY) { maxY = exp.metadata.y }
    }
  }

  if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
    return null
  }
  return {
    minX,
    minY,
    maxX,
    maxY
  }
}
