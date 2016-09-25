export default function getNodeOutport(graph, processName, portName, route, componentName) {
  const ports = this.getPorts(graph, processName, componentName)

  if (!ports.outports[portName]) {
    ports.outports[portName] = {
      label: portName,
      x: Config.base.config.nodeWidth,
      y: Config.base.config.nodeHeight / 2
    }

    this.dirty = true
  }

  const port = ports.outports[portName]

  // Port will have top edge's color
  if (route !== undefined) {
    port.route = route
  }

  return port
}

