import Config from '../Config'
import { GraphIIP } from '../factories/graph'

export default function createIIPs(graph) {
  return graph.initializers.map((iip) => {
    const target = graph.getNode(iip.to.node)

    if (!target) { return }

    const targetPort = this.getNodeInport(graph, iip.to.node, iip.to.port, 0, target.component)
    const x = target.metadata.x
    const y = target.metadata.y + targetPort.y

    const data = iip.from.data
    const type = typeof data
    const label = data === true || data === false || type === 'number' || type === 'string' ? data : type

    const iipOptions = {
      ...Config.graph.iip,
      graph,
      label,
      x,
      y
    }

    return GraphIIP(iipOptions)
  })
}
