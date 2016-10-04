/**
 *
 * const currentLib = Library::getInstance(library)
 *
 * Goal is to call this from each component which receives the library.
 *
 * And only re-process if the library is actually different.
 * Biggest constraint I give myself is not wanting to rely on redux.
 *
 * The hash is wrong it's processName = info
 * Where the processName actually does not matter
 *
 * Current problem:
 *
 * Layout needs to have the portInfo but it's not loaded yet.
 *
 * Yet the way portInfo is build it's building several different
 * info's of which some is needed by Graph and some by klayjs.
 *
 */
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

  // take a graph and build it's info, not sure if correct.
  // processNames are only unique per graph.
  // what I want is a function which takes a graph and returns it's port info.
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

  // getPorts(graph, processName, componentName) {
  // node surely carries the processName,
  // not sure what node looks like.
  // node.id is the process name.
  // the port positions are calculated here base on the node.
  // also this does not need to be recalculated
  // getPorts(node, processName, componentName) {

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
    /*
     const node = graph.getNode(processName)
     */

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
          /*
           return {
           inports,
           outports
           }
           */
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

