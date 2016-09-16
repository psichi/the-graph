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

export default class KlayNoflo {
  // var worker
  defaultOptions = {
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

  worker = null

  constructor (params) {
    this.init(params)
  }

  static create (params) {
    return new KlayNoflo(params)
  }

  // Initialize the layouter as a WebWorker
  init (params) {
    // Set up some properties
    let onSuccess
    let onError
    let workerScript

    if ('onSuccess' in params) {
      onSuccess = params.onSuccess
    } else {
      onSuccess = console.log
    }

    if ('onError' in params) {
      onError = params.onError
    } else {
      onError = console.error
    }

    if ('KLAY_CONFIG' in window && 'workerScript' in window.KLAY_CONFIG) {
      workerScript = window.KLAY_CONFIG.workerScript
    } else if ('workerScript' in params) {
      workerScript = params.workerScript
    } else {
      workerScript = '../../node_modules/klayjs/klay.js'
    }
    // Start the WebWorker
    this.worker = new Worker(workerScript)
    // Register a listener to default WebWorker event, calling
    // 'callback' when layout succeeds
    this.worker.addEventListener('message', function (e) {
      // test for error
      if (e.data) {
        return onSuccess(e.data)
      }

      onError(e)
    }, false)
  }

  destroy () {
    this.worker.terminate()
  }

  // Layout a given graph, the result will be sent by the WebWorker
  // when done and will be made accessible by the callback defined
  // in init
  layout (params) {
    var graph, options, portInfo, direction, encodedGraph

    if ('graph' in params) {
      graph = params.graph
    } else {
      return
    }
    if ('options' in params) {
      options = params.options
    } else {
      options = defaultOptions
    }
    if ('direction' in params) {
      direction = params.direction
    } else {
      direction = 'RIGHT'
    }
    // If portInfo is a parameter, encode the graph as KGraph first
    if ('portInfo' in params) {
      portInfo = params.portInfo
      encodedGraph = this.nofloToKieler(graph, portInfo, direction)
    } else {
      encodedGraph = graph
    }

    this.worker.postMessage({
      'graph': encodedGraph,
      'options': options
    })
  }

  nofloToKieler (graph, portInfo, direction) {
    // Default direction is left to right
    direction = direction || 'RIGHT'

    const portConstraints = 'FIXED_POS'

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

    const nodeProperties = {
      width: 72,
      height: 72
    }

    // Start KGraph building
    const kGraph = {
      id: graph.name,
      children: [],
      edges: []
    }

    // Encode nodes
    const idx = {}

    const options = {
      portInfo,
      portProperties,
      nodeProperties,
      portConstraints
    }

    kGraph.edges = [
      createNodeEdges,
      createInportEdges,
      createOutportEdges
    ].reduce((edges, func) => {
      return edges.concat(func(graph, edges.length))
    }, [])

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

