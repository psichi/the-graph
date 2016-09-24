export default function getNodeInport(graph, processName, portName, route, componentName) {
  const ports = this.getPorts(graph, processName, componentName)

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
