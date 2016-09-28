export default function getNodeOutport(graph, processName, portName, route, componentName) {
  const ports = this.getPorts(graph, processName, componentName)

  // this check should not be necessary.
  // if this is required, it should already receive it this way
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

