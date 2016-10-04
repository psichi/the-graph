import Config from '../Config'
import { GraphEdge } from '../factories/graph'

export default function createEdges(graph) {
  const { app, onEdgeSelection, showContext } = this.props

  return graph.edges.map((edge) => {
    const source = graph.getNode(edge.from.node)
    const target = graph.getNode(edge.to.node)

    if (!source || !target) {
      return
    }

    let route = 0

    if (edge.metadata && edge.metadata.route) {
      route = edge.metadata.route
    }

    // Initial ports from edges, and give port top/last edge color
    /*
    const sourcePort = this.getNodeOutport(graph, edge.from.node, edge.from.port, route, source.component)
    const targetPort = this.getNodeInport(graph, edge.to.node, edge.to.port, route, target.component)
    */

    const label = `${source.metadata.label}() ${
      edge.from.port.toUpperCase()
      }${edge.from.hasOwnProperty('index') ? `[${edge.from.index}]` : ''} -> ${
      edge.to.port.toUpperCase()
      }${edge.to.hasOwnProperty('index') ? `[${edge.to.index}]` : ''} ${
      target.metadata.label}()`

    const key = `${edge.from.node}() ${
      edge.from.port.toUpperCase()
      }${edge.from.hasOwnProperty('index') ? `[${edge.from.index}]` : ''} -> ${
      edge.to.port.toUpperCase()
      }${edge.to.hasOwnProperty('index') ? `[${edge.to.index}]` : ''} ${
      edge.to.node}()`

    const edgeOptions = {
      ...Config.graph.edge,
      key,
      app,
      edge,
      graph,
      label,
      route,
      onEdgeSelection,
      showContext,
      edgeID: key,
      getPositions: () => {
        const left = this.portInfo[edge.from.node].outports[edge.from.port]
        const right = this.portInfo[edge.to.node].inports[edge.to.port]

        const result = {
          sX: source.metadata.x + source.metadata.width,
          sY: source.metadata.y + left.y,
          tX: target.metadata.x,
          tY: target.metadata.y + right.y
        }

        return result
      },
      /*
      sX: source.metadata.x + source.metadata.width,
      sY: source.metadata.y + sourcePort.y, // <<< problem if I move positioning to Node instead of graph.
      tX: target.metadata.x,
      tY: target.metadata.y + targetPort.y,
      */
      selected: (this.state.selectedEdges.indexOf(edge) !== -1),
      animated: (this.state.animatedEdges.indexOf(edge) !== -1)
    }

    return GraphEdge(edgeOptions)
  })
}
