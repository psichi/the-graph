import Config from '../Config'
import { GraphNode, GraphEdge } from '../factories/graph'

export default function createInportExports(graph) {
  const { app, showContext } = this.props

  const edges = Object.keys(graph.inports).map((key) => {
    const inport = graph.inports[key]
    // Export info
    const label = key
    const nodeKey = inport.process
    const portKey = inport.port

    if (!inport.metadata) {
      inport.metadata = { x: 0, y: 0 }
    }

    const metadata = inport.metadata

    if (!metadata.x) { metadata.x = 0 }
    if (!metadata.y) { metadata.y = 0 }
    if (!metadata.width) { metadata.width = Config.base.config.nodeWidth }
    if (!metadata.height) { metadata.height = Config.base.config.nodeHeight }

    // Private port info
    const portInfo = this.portInfo[nodeKey]
    if (!portInfo) {
      console.warn(`Node ${nodeKey} not found for graph inport ${label}`)
      return
    }

    const privatePort = portInfo.inports[portKey]
    if (!privatePort) {
      console.warn(`Port ${nodeKey}.${portKey} not found for graph inport ${label}`)
      return
    }

    // Private node
    const privateNode = graph.getNode(nodeKey)
    if (!privateNode) {
      console.warn(`Node ${nodeKey} not found for graph inport ${label}`)
      return
    }
    // Node view
    const expNode = {
      ...Config.graph.inportNode,
      key: `inport.node.${key}`,
      export: inport,
      exportKey: key,
      x: metadata.x,
      y: metadata.y,
      width: metadata.width,
      height: metadata.height,
      label,
      app,
      graphView: this,
      graph,
      node: {},
      ports: this.getGraphInport(key),
      isIn: true,
      icon: (metadata.icon ? metadata.icon : 'sign-in'),
      showContext
    }

    // Edge view
    const expEdge = {
      ...Config.graph.inportEdge,
      key: `inport.edge.${key}`,
      export: inport,
      exportKey: key,
      graph,
      app,
      edge: {},
      route: (metadata.route ? metadata.route : 2),
      isIn: true,
      label: `export in ${label.toUpperCase()} -> ${portKey.toUpperCase()} ${privateNode.metadata.label}`,
      sX: expNode.x + Config.base.config.nodeWidth,
      sY: expNode.y + Config.base.config.nodeHeight / 2,
      tX: privateNode.metadata.x + privatePort.x,
      tY: privateNode.metadata.y + privatePort.y,
      showContext
    }

    edges.unshift(GraphEdge(expEdge))

    return GraphNode(expNode)
  })

  return edges
}
