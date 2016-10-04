import Config from '../Config'
import { positionPorts } from '../utils/'

let currentLibrary = null

export default class ComponentLibrary {
  constructor (library) {
    this.library = library
    this.portInfo = {}
  }

  static getInstance (library, forceUpdate) {
    if (!currentLibrary || forceUpdate) {
      currentLibrary = new ComponentLibrary(library)
    }

    return currentLibrary
  }

  getComponentInfo (componentName) {
    return this.library[componentName]
  }

  buildPortInfo (graph, refresh = false) {
    // iterate all nodes
    graph.nodes.forEach((node) => {
      const processName = node.id

      if (!this.portInfo[processName] || refresh) {
        const componentName = node.component
        const metadata = node
        const dimensions = [metadata.width, metadata.height]

        this.portInfo[processName] = this.getPorts(processName, componentName, dimensions)
      }
    })

    return this.portInfo
  }

  /**
   * Note that portInfo is how kieler's klayjs expects it.
   * And it expects it from the entire graph.
   *
   * @param processName
   * @param componentName
   * @param dimensions
   * @param dimensions.width
   * @param dimensions.height
   * @returns {*}
   */
  getPorts(processName, componentName, dimensions) {
    let ports

    ports = this.portInfo[processName]

    if (!ports) {
      let inports
      let outports

      if (componentName && this.library) {
        // Copy ports from library object
        const component = this.getComponentInfo(componentName)

        const nodeDimensions = {
          width: dimensions.width || Config.base.config.nodeWidth,
          height: dimensions.height || Config.base.config.nodeHeight,
        }

        if (!component) {
          throw Error(`no such component ${componentName}`)
        }

        inports = positionPorts(component.inports, {
          x: 0,
          height: nodeDimensions.height,
        })

        outports = positionPorts(component.outports, {
          x: nodeDimensions.width,
          height: nodeDimensions.height
        })
      }

      ports = {
        inports,
        outports
      }

      this.portInfo[processName] = ports
    }

    return ports
  }
}

