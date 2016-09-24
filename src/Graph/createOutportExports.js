import Config from '../Config'
import { GraphNode, GraphEdge } from '../factories/graph'

export default function createOutportExports(graph) {
  const { app, showContext } = this.props

  const edges = Object.keys(graph.outports).map((key) => {
    const outport = graph.outports[key]
    // Export info
    const label = key
    const nodeKey = outport.process
    const portKey = outport.port

    if (!outport.metadata) {
      outport.metadata = { x: 0, y: 0 }
    }

    const metadata = outport.metadata

    if (!metadata.x) { metadata.x = 0 }
    if (!metadata.y) { metadata.y = 0 }
    if (!metadata.width) { metadata.width = Config.base.config.nodeWidth }
    if (!metadata.height) { metadata.height = Config.base.config.nodeHeight }

    // Private port info
    const portInfo = this.portInfo[nodeKey]

    if (!portInfo) {
      console.warn(`Node ${nodeKey} not found for graph outport ${label}`)
      return
    }

    const privatePort = portInfo.outports[portKey]

    if (!privatePort) {
      console.warn(`Port ${nodeKey}.${portKey} not found for graph outport ${label}`)
      return
    }
    // Private node
    const privateNode = graph.getNode(nodeKey)

    if (!privateNode) {
      console.warn(`Node ${nodeKey} not found for graph outport ${label}`)
      return
    }

    // Node view
    const expNode = {
      ...Config.graph.outportNode,
      key: `outport.node.${key}`,
      export: outport,
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
      ports: this.getGraphOutport(key),
      isIn: false,
      icon: (metadata.icon ? metadata.icon : 'sign-out'),
      showContext
    }

    // Edge view
    const expEdge = {
      ...Config.graph.outportEdge,
      key: `outport.edge.${key}`,
      export: outport,
      exportKey: key,
      graph,
      app,
      edge: {},
      route: (metadata.route ? metadata.route : 4),
      isIn: false,
      label: `${privateNode.metadata.label} ${portKey.toUpperCase()} -> ${label.toUpperCase()} export out`,
      sX: privateNode.metadata.x + privatePort.x,
      sY: privateNode.metadata.y + privatePort.y,
      tX: expNode.x,
      tY: expNode.y + Config.base.config.nodeHeight / 2,
      showContext
    }

    edges.unshift(GraphEdge(expEdge))

    return GraphNode(expNode)
  })

  return edges
}
