import type { NofloGraph } from '../types'

export default function getPorts(
  graph: NofloGraph,
  processName: string,
  componentName: string
) {
  let ports
  const { library } = this.props
  const node = graph.getNode(processName)

  ports = this.portInfo[processName]

  if (!ports) {
    const inports = {}
    const outports = {}

    if (componentName && library) {
      // Copy ports from library object
      const component = this.getComponentInfo(componentName)

      if (!component) {
        return {
          inports,
          outports
        }
      }

      let i, port, len

      for (i = 0, len = component.outports.length; i < len; i++) {
        port = component.outports[i]
        if (!port.name) { continue }
        outports[port.name] = {
          label: port.name,
          type: port.type,
          x: node.metadata.width,
          y: node.metadata.height / (len + 1) * (i + 1)
        }
      }

      for (i = 0, len = component.inports.length; i < len; i++) {
        port = component.inports[i]

        if (!port.name) { continue }

        inports[port.name] = {
          label: port.name,
          type: port.type,
          x: 0,
          y: node.metadata.height / (len + 1) * (i + 1)
        }
      }
    }

    ports = {
      inports,
      outports
    }

    this.portInfo[processName] = ports
  }

  return ports
}
