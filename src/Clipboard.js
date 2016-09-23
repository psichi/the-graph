/**
 * Created by mpricope on 05.09.14.
 */

import cloneObject from './utils/cloneObject'
import makeNewId from './utils/makeNewId'

const Clipboard = {}
let clipboardContent = {}

Clipboard.copy = function (graph, keys) {
  // Duplicate all the nodes before putting them in clipboard
  // this will make this work also with cut/Paste and once we
  // decide if/how we will implement cross-document copy&paste will work there too
  clipboardContent = { nodes: [], edges: [] }
  const map = {}
  let i, len
  for (i = 0, len = keys.length; i < len; i++) {
    const node = graph.getNode(keys[i])
    const newNode = cloneObject(node)
    newNode.id = makeNewId(node.component)
    clipboardContent.nodes.push(newNode)
    map[node.id] = newNode.id
  }
  for (i = 0, len = graph.edges.length; i < len; i++) {
    const edge = graph.edges[i]
    const fromNode = edge.from.node
    const toNode = edge.to.node
    if (map.hasOwnProperty(fromNode) && map.hasOwnProperty(toNode)) {
      const newEdge = cloneObject(edge)
      newEdge.from.node = map[fromNode]
      newEdge.to.node = map[toNode]
      clipboardContent.edges.push(newEdge)
    }
  }
}

Clipboard.paste = function (graph) {
  const map = {}
  const pasted = { nodes: [], edges: [] }
  let i, len
  for (i = 0, len = clipboardContent.nodes.length; i < len; i++) {
    const node = clipboardContent.nodes[i]
    const meta = cloneObject(node.metadata)
    meta.x += 36
    meta.y += 36
    const newNode = graph.addNode(makeNewId(node.component), node.component, meta)
    map[node.id] = newNode.id
    pasted.nodes.push(newNode)
  }
  for (i = 0, len = clipboardContent.edges.length; i < len; i++) {
    const edge = clipboardContent.edges[i]
    const newEdgeMeta = cloneObject(edge.metadata)
    let newEdge
    if (edge.from.hasOwnProperty('index') || edge.to.hasOwnProperty('index')) {
      // One or both ports are addressable
      const fromIndex = edge.from.index || null
      const toIndex = edge.to.index || null
      newEdge = graph.addEdgeIndex(map[edge.from.node], edge.from.port, fromIndex, map[edge.to.node], edge.to.port, toIndex, newEdgeMeta)
    } else {
      newEdge = graph.addEdge(map[edge.from.node], edge.from.port, map[edge.to.node], edge.to.port, newEdgeMeta)
    }
    pasted.edges.push(newEdge)
  }
  return pasted
}

export default Clipboard
