import cleanArray from './utils/cleanArray'
import {
  createInportChildren,
  createInportEdges,
  createOutportEdges,
  createNodeChildren,
  createOutportChildren,
  createNodeEdges,
  createGroupChildren
} from './klayNoflo/index'

// import KlayWorker from 'worker?!klayjs/klay.js'

const defaultOptions = {
  'intCoordinates': true,
  'algorithm': 'de.cau.cs.kieler.klay.layered',
  'layoutHierarchy': true,
  'spacing': 20,
  'borderSpacing': 20,
  'edgeSpacingFactor': 0.2,
  'inLayerSpacingFactor': 2.0,
  'nodePlace': 'BRANDES_KOEPF',
  'nodeLayering': 'NETWORK_SIMPLEX',
  'edgeRouting': 'POLYLINE',
  'crossMin': 'LAYER_SWEEP',
  'direction': 'RIGHT'
}

export default class KlayNoflo {
  worker = null

  constructor(params) {
    this.init(params)
  }

  static create(params) {
    return new KlayNoflo(params)
  }

  // Initialize the layouter as a WebWorker
  init(params) {
    // Set up some properties
    let { onSuccess, onError, workerScript } = params

    if (!onSuccess) {
      onSuccess = console.log
    }

    if (!onError) {
      onError = console.error
    }

    if ('KLAY_CONFIG' in window && 'workerScript' in window.KLAY_CONFIG) {
      workerScript = window.KLAY_CONFIG.workerScript
    } else if (!workerScript) {
      workerScript = '../../node_modules/klayjs/klay.js'
    }

    // Start the WebWorker
    this.worker = new Worker(workerScript)

    // Register a listener to default WebWorker event, calling
    // 'callback' when layout succeeds
    this.worker.addEventListener('message', (e) => {
      // test for error
      if (e.data) {
        return onSuccess(e.data)
      }

      onError(e)
    }, false)
  }

  destroy() {
    this.worker.terminate()
  }

  // Layout a given graph, the result will be sent by the WebWorker
  // when done and will be made accessible by the callback defined
  // in init
  layout(params) {
    const { portInfo } = params
    let { graph, options, direction } = params

    if (!graph) {
      return
    }

    if (!options) {
      options = defaultOptions
    }

    if (!direction) {
      direction = 'RIGHT'
    }
    // If portInfo is a parameter, encode the graph as KGraph first
    if (portInfo) {
      graph = this.nofloToKieler(graph, portInfo, direction)
    }

    this.worker.postMessage({
      graph,
      options
    })
  }

  // Default direction is left to right
  nofloToKieler(graph, portInfo, direction = 'RIGHT') {
    // Default port and node properties
    const portProperties = {
      inportSide: 'WEST',
      outportSide: 'EAST',
      width: 10,
      height: 10
    }

    if (direction === 'DOWN') {
      portProperties.inportSide = 'NORTH'
      portProperties.outportSide = 'SOUTH'
    }

    // Start KGraph building
    const kGraph = {
      id: graph.name,
      children: [],
      edges: []
    }

    kGraph.edges = [
      createNodeEdges,
      createInportEdges,
      createOutportEdges
    ].reduce((edges, func) => {
      return edges.concat(func(graph, edges.length))
    }, [])

    // Encode nodes
    const idx = {}

    const options = {
      portInfo,
      portProperties,
      nodeProperties: {
        width: 72,
        height: 72
      },
      portConstraints: 'FIXED_POS'
    }

    kGraph.children = [
      createNodeChildren,
      createInportChildren,
      createOutportChildren,
      createGroupChildren(kGraph)
    ].reduce((collection, func) => {
      return collection.concat(func(graph, options, collection.length, idx, collection)) // collection is children build so far
    }, [])

    // Remove the nodes and edges from the graph, just preserve them
    // inside the subgraph/group
    kGraph.children = cleanArray(kGraph.children)
    kGraph.edges = cleanArray(kGraph.edges)

    return kGraph
  }
}

