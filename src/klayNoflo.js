// temporary copy & paste include in able to require
// Probably useful to always start this, regardless of what component is used.
// e.g. if only a node is rendered klayjs is also available
// then just calculate using an graph with just one unattached node.
// which will make klayjs a service, perhaps use redux for this.
// or else a mixin, which is used by node & graph & app
// if something does not have position call kieler first
// or perhaps fallback on something
// you should be able to require a node and the ports should be setup correctly.
// simple require could probably be enough.
import cleanArray from './cleanArray'

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

  create (params) {
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
    this.worker.destroy()
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
    var kGraph = {
      id: graph.name,
      children: [],
      edges: []
    }

    // Encode nodes
    let countIdx
    const {nodes} = graph
    const idx = {}

    countIdx = 0

    const nodeChildren = nodes.map((node) => {
      const {inPorts} = portInfo[node.id]
      const inPortsKeys = Object.keys(inPorts)
      const inPortsTemp = inPortsKeys.map((key) => {
        return {
          id: node.id + '_' + key,
          width: portProperties.width,
          height: portProperties.height,
          x: portInfo[node.id].inports[key].x - portProperties.width,
          y: portInfo[node.id].inports[key].y
        }
      })
      const {outPorts} = portInfo[node.id]
      const outPortsKeys = Object.keys(outPorts)
      const outPortsTemp = outPortsKeys.map((key) => {
        return {
          id: node.id + '_' + key,
          width: portProperties.width,
          height: portProperties.height,
          x: portInfo[node.id].outports[key].x,
          y: portInfo[node.id].outports[key].y
        }
      })

      const kChild = {
        id: node.id,
        labels: [{text: node.metadata.label || 'kChild no label'}],
        width: nodeProperties.width,
        height: nodeProperties.height,
        ports: inPortsTemp.concat(outPortsTemp),
        properties: {
          'portConstraints': portConstraints
        }
      }
      idx[node.id] = countIdx++

      return kChild
    })

    // Graph i/o to kGraph nodes
    var inports = graph.inports
    var inportsKeys = Object.keys(inports)
    var inportChildren = inportsKeys.map(function (key) {
      var inport = inports[key]
      var tempId = 'inport:::' + key
      // Inports just has only one output port
      var uniquePort = {
        id: inport.port,
        width: portProperties.width,
        height: portProperties.height,
        properties: {
          'de.cau.cs.kieler.portSide': portProperties.outportSide
        }
      }

      var kChild = {
        id: tempId,
        labels: [{text: key}],
        width: nodeProperties.width,
        height: nodeProperties.height,
        ports: [uniquePort],
        properties: {
          'portConstraints': portConstraints,
          'de.cau.cs.kieler.klay.layered.layerConstraint': 'FIRST_SEPARATE'
        }
      }
      idx[tempId] = countIdx++
      return kChild
    })
    var outports = graph.outports
    var outportsKeys = Object.keys(outports)
    var outportChildren = outportsKeys.map(function (key) {
      var outport = outports[key]
      var tempId = 'outport:::' + key
      // Outports just has only one input port
      var uniquePort = {
        id: outport.port,
        width: portProperties.width,
        height: portProperties.height,
        properties: {
          'de.cau.cs.kieler.portSide': portProperties.inportSide
        }
      }

      var kChild = {
        id: tempId,
        labels: [{text: key}],
        width: nodeProperties.width,
        height: nodeProperties.height,
        ports: [uniquePort],
        properties: {
          'portConstraints': portConstraints,
          'de.cau.cs.kieler.klay.layered.layerConstraint': 'LAST_SEPARATE'
        }
      }
      idx[tempId] = countIdx++
      return kChild
    })

    // Combine nodes, inports, outports to one array
    kGraph.children = nodeChildren.concat(inportChildren, outportChildren)

    // Encode edges (together with ports on both edges and already
    // encoded nodes)
    var currentEdge = 0
    var edges = graph.edges
    edges.map(function (edge) {
      if (edge.data !== undefined) {
        return
      }
      var source = edge.from.node
      var sourcePort = edge.from.port
      var target = edge.to.node
      var targetPort = edge.to.port
      kGraph.edges.push({
        id: 'e' + currentEdge++,
        source: source,
        sourcePort: source + '_' + sourcePort,
        target: target,
        targetPort: target + '_' + targetPort
      })
    })

    // Graph i/o to kGraph edges
    var inportEdges = inportsKeys.map(function (key) {
      var inport = inports[key]
      var source = 'inport:::' + key
      var sourcePort = key
      var target = inport.process
      var targetPort = inport.port
      var inportEdge = {
        id: 'e' + currentEdge++,
        source: source,
        sourcePort: source + '_' + sourcePort,
        target: target,
        targetPort: target + '_' + targetPort
      }
      return inportEdge
    })
    var outportEdges = outportsKeys.map(function (key) {
      var outport = outports[key]
      var source = outport.process
      var sourcePort = outport.port
      var target = 'outport:::' + key
      var targetPort = key
      var outportEdge = {
        id: 'e' + currentEdge++,
        source: source,
        sourcePort: source + '_' + sourcePort,
        target: target,
        targetPort: target + '_' + targetPort
      }
      return outportEdge
    })

    // Combine edges, inports, outports to one array
    kGraph.edges = kGraph.edges.concat(inportEdges, outportEdges)

    // Encode groups
    var groups = graph.groups
    var countGroups = 0
    // Mark the nodes already in groups to avoid the same node in many groups
    var nodesInGroups = []
    groups.map(function (group) {
      // Create a node to use as a subgraph
      var node = {
        id: 'group' + countGroups++,
        children: [],
        edges: []
      }
      // Build the node/subgraph
      group.nodes.map(function (n) {
        var nodeT = kGraph.children[idx[n]]
        if (nodeT === null) {
          return
        }
        if (nodesInGroups.indexOf(nodeT) >= 0) {
          return
        }
        nodesInGroups.push(nodeT)
        node.children.push(nodeT)
        node.edges.push(kGraph.edges.filter(function (edge) {
          if (edge) {
            if ((edge.source === n) || (edge.target === n)) {
              return edge
            }
          }
        })[0])
        node.edges = cleanArray(node.edges)

        // Mark nodes inside the group to be removed from the graph
        kGraph.children[idx[n]] = null
      })
      // Mark edges too
      node.edges.map(function (edge) {
        if (edge) {
          kGraph.edges[parseInt(edge.id.substr(1), 10)] = null
        }
      })
      // Add node/subgraph to the graph
      kGraph.children.push(node)
    })

    // Remove the nodes and edges from the graph, just preserve them
    // inside the subgraph/group
    kGraph.children = cleanArray(kGraph.children)
    kGraph.edges = cleanArray(kGraph.edges)

    return kGraph
  }
}

