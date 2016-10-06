import type { NofloGraph } from '../types'

export default function getNodeInport(
  graph: NofloGraph,
  processName: string,
  portName: string,
  route: ?number,
  componentName: ?string
) {
  const ports = this.getPorts(graph, processName, componentName)

  // this check should not be necessary.
  // if this is required, it should already receive it this way
  if (!ports.inports[portName]) {
    ports.inports[portName] = {
      label: portName,
      x: 0,
      y: Config.base.config.nodeHeight / 2
    }

    this.dirty = true
  }

  const port = ports.inports[portName]

  // Port will have top edge's color
  if (route !== undefined) {
    port.route = route
  }

  return port
}
