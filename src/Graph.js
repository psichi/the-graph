import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {FakeMouse} from './mixins'
import {findMinMax} from './utils'
import Config from './Config'
import {
  GraphNode,
  GraphEdge,
  GraphIIP,
  GraphGroup,
  GraphEdgesGroup,
  GraphEdgePreview,
  GraphIIPGroup,
  GraphNodesGroup,
  GraphInportsGroup,
  GraphGroupsGroup,
  GraphContainerGroup
} from './factories/graph'

// Graph view
export default class TheGraphGraph extends Component {
  mixins = [FakeMouse]
  edgePreview = null
  portInfo = {}
  graphOutports = {}
  graphInports = {}
  updatedIcons = {}
  dirty = false
  libraryDirty = false

  static propTypes = {
    graph: PropTypes.object.isRequired,
    scale: PropTypes.number,
    app: PropTypes.object,  // << see what this is used for
    library: PropTypes.object,
    onNodeSelection: PropTypes.func,
    onEdgeSelection: PropTypes.func,
    showContext: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)

    const {graph, offsetX, offsetY} = this.props

    this.state = {
      graph,
      offsetX,
      offsetY,
      displaySelectionGroup: true,
      edgePreview: null,
      edgePreviewX: 0,
      edgePreviewY: 0,
      forceSelection: false,
      selectedNodes: [],
      errorNodes: [],
      selectedEdges: [],
      animatedEdges: []
    }

    this.triggerRender = this.triggerRender.bind(this)
    this.resetPortRoute = this.resetPortRoute.bind(this)
    this.markDirty = this.markDirty.bind(this)
    this.renderPreviewEdge = this.renderPreviewEdge.bind(this)
    this.cancelPreviewEdge = this.cancelPreviewEdge.bind(this)
    // this.removeNode = this.removeNode.bind(this)
  }

  componentDidMount () {
    // To change port colors
    this.props.graph.on('addEdge', this.resetPortRoute)
    this.props.graph.on('changeEdge', this.resetPortRoute)
    this.props.graph.on('removeEdge', this.resetPortRoute)
    this.props.graph.on('removeInitial', this.resetPortRoute)

    // Listen to noflo graph object's events
    this.props.graph.on('changeNode', this.markDirty)
    this.props.graph.on('changeInport', this.markDirty)
    this.props.graph.on('changeOutport', this.markDirty)
    this.props.graph.on('endTransaction', this.markDirty)

    // not sure where removeNode should come from, probably was always undefined.
    // findDOMNode(this).addEventListener('the-graph-node-remove', this.removeNode);
  }

  edgeStart (event) {
    // Forwarded from App.edgeStart()
    const {edgePreview} = this.state
    const {app} = this.props
    const {detail: eventDetail} = event

    // Port that triggered this
    const {port} = eventDetail

    // Complete edge if this is the second tap and ports are compatible
    if (edgePreview && edgePreview.isIn !== eventDetail.isIn) {
      // TODO also check compatible types
      const halfEdge = edgePreview

      if (eventDetail.isIn) {
        halfEdge.to = port
      } else {
        halfEdge.from = port
      }

      this.addEdge(halfEdge)
      this.cancelPreviewEdge()

      return
    }

    let edge

    if (eventDetail.isIn) {
      edge = { to: port }
    } else {
      edge = { from: port }
    }

    edge.isIn = eventDetail.isIn
    edge.metadata = { route: eventDetail.route }
    edge.type = eventDetail.port.type

    const appDomNode = findDOMNode(app)

    appDomNode.addEventListener('mousemove', this.renderPreviewEdge)
    appDomNode.addEventListener('track', this.renderPreviewEdge)
    // TODO tap to add new node here
    appDomNode.addEventListener('tap', this.cancelPreviewEdge)

    this.setState({edgePreview: edge})
  }

  cancelPreviewEdge (event) {
    const {edgePreview} = this.state
    const {app} = this.props
    const appDomNode = findDOMNode(app)

    appDomNode.removeEventListener('mousemove', this.renderPreviewEdge)
    appDomNode.removeEventListener('track', this.renderPreviewEdge)
    appDomNode.removeEventListener('tap', this.cancelPreviewEdge)

    if (edgePreview) {
      this.setState({edgePreview: null})
      this.markDirty()
    }
  }

  renderPreviewEdge (event) {
    const {app: {state: {offsetX, offsetY, scale, x: appX, y: appY} } } = this.props

    let x = event.x || event.clientX || 0
    let y = event.y || event.clientY || 0

    x -= offsetX || 0
    y -= offsetY || 0

    this.setState({
      edgePreviewX: (x - appX) / scale,
      edgePreviewY: (y - appY) / scale
    })

    this.markDirty()
  }

  addEdge (edge) {
    this.state.graph.addEdge(edge.from.process, edge.from.port, edge.to.process, edge.to.port, edge.metadata)
  }

  moveGroup (nodes, dx, dy) {
    const {graph} = this.state

    // Move each group member
    const len = nodes.length

    let i

    for (i = 0; i < len; i++) {
      const node = graph.getNode(nodes[i])

      if (!node) { continue }

      if (dx !== undefined) {
        // Move by delta
        graph.setNodeMetadata(node.id, {
          x: node.metadata.x + dx,
          y: node.metadata.y + dy
        })
      } else {
        // Snap to grid
        const snap = Config.base.nodeHeight / 2
        graph.setNodeMetadata(node.id, {
          x: Math.round(node.metadata.x / snap) * snap,
          y: Math.round(node.metadata.y / snap) * snap
        })
      }
    }
  }

  getComponentInfo (componentName) {
    return this.props.library[componentName]
  }

  getPorts (graph, processName, componentName) {
    let ports
    const node = graph.getNode(processName)

    ports = this.portInfo[processName]

    if (!ports) {
      const inports = {}
      const outports = {}

      if (componentName && this.props.library) {
        // Copy ports from library object
        const component = this.getComponentInfo(componentName)

        if (!component) {
          return {
            inports: inports,
            outports: outports
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
        inports: inports,
        outports: outports
      }

      this.portInfo[processName] = ports
    }

    return ports
  }

  getNodeOutport (graph, processName, portName, route, componentName) {
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

  getNodeInport (graph, processName, portName, route, componentName) {
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

  resetPortRoute (event) {
    // Trigger nodes with changed ports to rerender
    if (event.from && event.from.node) {
      const fromNode = this.portInfo[event.from.node]

      if (fromNode) {
        fromNode.dirty = true

        const outport = fromNode.outports[event.from.port]

        if (outport) {
          outport.route = null
        }
      }
    }
    if (event.to && event.to.node) {
      const toNode = this.portInfo[event.to.node]

      if (toNode) {
        toNode.dirty = true

        const inport = toNode.inports[event.to.port]

        if (inport) {
          inport.route = null
        }
      }
    }
  }

  getGraphOutport (key) {
    let exp

    exp = this.graphOutports[key]

    if (!exp) {
      exp = {inports: {}, outports: {}}
      exp.inports[key] = {
        label: key,
        type: 'all',
        route: 5,
        x: 0,
        y: Config.base.config.nodeHeight / 2
      }
      this.graphOutports[key] = exp
    }

    return exp
  }
  getGraphInport (key) {
    let exp = this.graphInports[key]

    if (!exp) {
      exp = {inports: {}, outports: {}}
      exp.outports[key] = {
        label: key,
        type: 'all',
        route: 2,
        x: Config.base.config.nodeWidth,
        y: Config.base.config.nodeHeight / 2
      }
      this.graphInports[key] = exp
    }
    return exp
  }
  setSelectedNodes (selectedNodes) {
    this.setState({
      selectedNodes
    })
    this.markDirty()
  }
  setErrorNodes (errorNodes) {
    this.setState({
      errorNodes
    })
    this.markDirty()
  }
  setSelectedEdges (selectedEdges) {
    this.setState({
      selectedEdges
    })
    this.markDirty()
  }
  setAnimatedEdges (animatedEdges) {
    this.setState({
      animatedEdges
    })
    this.markDirty()
  }
  updateIcon (nodeId, icon) {
    this.updatedIcons[nodeId] = icon
    this.markDirty()
  }
  markDirty (event) {
    if (event && event.libraryDirty) {
      this.libraryDirty = true
    }
    window.requestAnimationFrame(this.triggerRender)
  }

  triggerRender (time) {
    console.log('TRIGGER', this)
    /*
     if (!this.isMounted()) {
     return;
     }
     */
    if (this.dirty) {
      return
    }
    this.dirty = true
    this.forceUpdate()
  }

  shouldComponentUpdate () {
    // If ports change or nodes move, then edges need to rerender, so we do the whole graph
    return this.dirty
  }

  createNodes (graph, selectedIds, highlightPort) {
    const {app, onNodeSelection, showContext} = this.props

    return graph.nodes.map((node) => {
      const componentInfo = this.getComponentInfo(node.component)
      const key = node.id

      if (!node.metadata) {
        node.metadata = {}
      }

      if (node.metadata.x === undefined) {
        node.metadata.x = 0
      }

      if (node.metadata.y === undefined) {
        node.metadata.y = 0
      }

      if (node.metadata.width === undefined) {
        node.metadata.width = Config.base.config.nodeWidth
      }

      node.metadata.height = Config.base.config.nodeHeight

      if (Config.base.config.autoSizeNode && componentInfo) {
        // Adjust node height based on number of ports.
        const portCount = Math.max(componentInfo.inports.length, componentInfo.outports.length)
        if (portCount > Config.base.config.maxPortCount) {
          const diff = portCount - Config.base.config.maxPortCount
          node.metadata.height = Config.base.config.nodeHeight + (diff * Config.base.config.nodeHeightIncrement)
        }
      }
      if (!node.metadata.label || node.metadata.label === '') {
        node.metadata.label = key
      }

      let icon
      let iconsvg

      icon = 'cog'
      iconsvg = ''

      if (this.updatedIcons[key]) {
        icon = this.updatedIcons[key]
      } else if (componentInfo && componentInfo.icon) {
        icon = componentInfo.icon
      } else if (componentInfo && componentInfo.iconsvg) {
        iconsvg = componentInfo.iconsvg
      }
      const selected = (this.state.selectedNodes[key] === true)
      if (selected) {
        selectedIds.push(key)
      }

      const nodeOptions = {
        ...Config.node,
        app,
        key,
        node,
        icon,
        graph,
        iconsvg,
        selected,
        showContext,
        onNodeSelection,
        highlightPort,
        nodeID: key,
        x: node.metadata.x,
        y: node.metadata.y,
        label: node.metadata.label,
        sublabel: node.metadata.sublabel || node.component,
        width: node.metadata.width,
        height: node.metadata.height,
        graphView: this,
        ports: this.getPorts(graph, key, node.component),
        error: (this.state.errorNodes[key] === true)
      }

      return GraphNode(nodeOptions)
    })
  }

  createEdges (graph) {
    const {app, onEdgeSelection, showContext} = this.props

    return graph.edges.map((edge) => {
      const source = graph.getNode(edge.from.node)
      const target = graph.getNode(edge.to.node)

      if (!source || !target) {
        return
      }

      let route = 0

      if (edge.metadata && edge.metadata.route) {
        route = edge.metadata.route
      }

      // Initial ports from edges, and give port top/last edge color
      const sourcePort = this.getNodeOutport(graph, edge.from.node, edge.from.port, route, source.component)
      const targetPort = this.getNodeInport(graph, edge.to.node, edge.to.port, route, target.component)

      const label = source.metadata.label + '() ' +
        edge.from.port.toUpperCase() +
        (edge.from.hasOwnProperty('index') ? '[' + edge.from.index + ']' : '') + ' -> ' +
        edge.to.port.toUpperCase() +
        (edge.to.hasOwnProperty('index') ? '[' + edge.to.index + ']' : '') + ' ' +
        target.metadata.label + '()'

      const key = edge.from.node + '() ' +
        edge.from.port.toUpperCase() +
        (edge.from.hasOwnProperty('index') ? '[' + edge.from.index + ']' : '') + ' -> ' +
        edge.to.port.toUpperCase() +
        (edge.to.hasOwnProperty('index') ? '[' + edge.to.index + ']' : '') + ' ' +
        edge.to.node + '()'

      const edgeOptions = {
        ...Config.graph.edge,
        key,
        app,
        edge,
        graph,
        label,
        route,
        onEdgeSelection,
        showContext,
        edgeID: key,
        sX: source.metadata.x + source.metadata.width,
        sY: source.metadata.y + sourcePort.y,
        tX: target.metadata.x,
        tY: target.metadata.y + targetPort.y,
        selected: (this.state.selectedEdges.indexOf(edge) !== -1),
        animated: (this.state.animatedEdges.indexOf(edge) !== -1)
      }

      return GraphEdge(edgeOptions)
    })
  }

  createIIPs (graph) {
    return graph.initializers.map((iip) => {
      const target = graph.getNode(iip.to.node)

      if (!target) { return }

      const targetPort = this.getNodeInport(graph, iip.to.node, iip.to.port, 0, target.component)
      const x = target.metadata.x
      const y = target.metadata.y + targetPort.y

      const data = iip.from.data
      const type = typeof data
      const label = data === true || data === false || type === 'number' || type === 'string' ? data : type

      const iipOptions = {
        ...Config.graph.iip,
        graph,
        label,
        x,
        y
      }

      return GraphIIP(iipOptions)
    })
  }

  createInportExports (graph) {
    const {app, showContext} = this.props

    const edges = Object.keys(graph.inports).map((key) => {
      const inport = graph.inports[key]
      // Export info
      const label = key
      const nodeKey = inport.process
      const portKey = inport.port

      if (!inport.metadata) {
        inport.metadata = {x: 0, y: 0}
      }

      const metadata = inport.metadata

      if (!metadata.x) { metadata.x = 0 }
      if (!metadata.y) { metadata.y = 0 }
      if (!metadata.width) { metadata.width = Config.base.config.nodeWidth }
      if (!metadata.height) { metadata.height = Config.base.config.nodeHeight }

      // Private port info
      const portInfo = this.portInfo[nodeKey]
      if (!portInfo) {
        console.warn('Node ' + nodeKey + ' not found for graph inport ' + label)
        return
      }

      const privatePort = portInfo.inports[portKey]
      if (!privatePort) {
        console.warn('Port ' + nodeKey + '.' + portKey + ' not found for graph inport ' + label)
        return
      }

      // Private node
      const privateNode = graph.getNode(nodeKey)
      if (!privateNode) {
        console.warn('Node ' + nodeKey + ' not found for graph inport ' + label)
        return
      }
      // Node view
      const expNode = {
        ...Config.graph.inportNode,
        key: 'inport.node.' + key,
        export: inport,
        exportKey: key,
        x: metadata.x,
        y: metadata.y,
        width: metadata.width,
        height: metadata.height,
        label,
        app,
        graphView: this,
        graph,
        node: {},
        ports: this.getGraphInport(key),
        isIn: true,
        icon: (metadata.icon ? metadata.icon : 'sign-in'),
        showContext
      }

      // Edge view
      const expEdge = {
        ...Config.graph.inportEdge,
        key: 'inport.edge.' + key,
        export: inport,
        exportKey: key,
        graph,
        app,
        edge: {},
        route: (metadata.route ? metadata.route : 2),
        isIn: true,
        label: 'export in ' + label.toUpperCase() + ' -> ' + portKey.toUpperCase() + ' ' + privateNode.metadata.label,
        sX: expNode.x + Config.base.config.nodeWidth,
        sY: expNode.y + Config.base.config.nodeHeight / 2,
        tX: privateNode.metadata.x + privatePort.x,
        tY: privateNode.metadata.y + privatePort.y,
        showContext
      }

      edges.unshift(GraphEdge(expEdge))

      return GraphNode(expNode)
    })

    return edges
  }

  createOutportExports (graph) {
    const {app, showContext} = this.props

    const edges = Object.keys(graph.outports).map((key) => {
      const outport = graph.outports[key]
      // Export info
      const label = key
      const nodeKey = outport.process
      const portKey = outport.port

      if (!outport.metadata) {
        outport.metadata = {x: 0, y: 0}
      }

      const metadata = outport.metadata

      if (!metadata.x) { metadata.x = 0 }
      if (!metadata.y) { metadata.y = 0 }
      if (!metadata.width) { metadata.width = Config.base.config.nodeWidth }
      if (!metadata.height) { metadata.height = Config.base.config.nodeHeight }

      // Private port info
      const portInfo = this.portInfo[nodeKey]

      if (!portInfo) {
        console.warn('Node ' + nodeKey + ' not found for graph outport ' + label)
        return
      }

      const privatePort = portInfo.outports[portKey]

      if (!privatePort) {
        console.warn('Port ' + nodeKey + '.' + portKey + ' not found for graph outport ' + label)
        return
      }
      // Private node
      const privateNode = graph.getNode(nodeKey)

      if (!privateNode) {
        console.warn('Node ' + nodeKey + ' not found for graph outport ' + label)
        return
      }

      // Node view
      const expNode = {
        ...Config.graph.outportNode,
        key: 'outport.node.' + key,
        export: outport,
        exportKey: key,
        x: metadata.x,
        y: metadata.y,
        width: metadata.width,
        height: metadata.height,
        label,
        app,
        graphView: this,
        graph,
        node: {},
        ports: this.getGraphOutport(key),
        isIn: false,
        icon: (metadata.icon ? metadata.icon : 'sign-out'),
        showContext
      }

      // Edge view
      var expEdge = {
        ...Config.graph.outportEdge,
        key: 'outport.edge.' + key,
        export: outport,
        exportKey: key,
        graph,
        app,
        edge: {},
        route: (metadata.route ? metadata.route : 4),
        isIn: false,
        label: privateNode.metadata.label + ' ' + portKey.toUpperCase() + ' -> ' + label.toUpperCase() + ' export out',
        sX: privateNode.metadata.x + privatePort.x,
        sY: privateNode.metadata.y + privatePort.y,
        tX: expNode.x,
        tY: expNode.y + Config.base.config.nodeHeight / 2,
        showContext
      }

      edges.unshift(GraphEdge(expEdge))

      return GraphNode(expNode)
    })

    return edges
  }

  createGroups (graph) {
    const {app, scale, showContext} = this.props

    return graph.groups.map((group) => {
      if (group.nodes.length < 1) {
        return
      }

      const limits = findMinMax(graph, group.nodes)

      if (!limits) {
        return
      }

      const groupOptions = {
        ...Config.graph.nodeGroup,
        app,
        graph,
        scale,
        showContext,
        key: 'group.' + group.name,
        item: group,
        minX: limits.minX,
        minY: limits.minY,
        maxX: limits.maxX,
        maxY: limits.maxY,
        label: group.name,
        nodes: group.nodes,
        description: group.metadata.description,
        color: group.metadata.color,
        triggerMoveGroup: this.moveGroup
      }

      return GraphGroup(groupOptions)
    })
  }

  render () {
    this.dirty = false

    const {
      forceSelection,
      graph,
      edgePreview: currentEdgePreview,
      displaySelectionGroup,
      edgePreviewX,
      edgePreviewY
    } = this.state

    const {app, scale, showContext} = this.props
    const selectedIds = []

    // Reset ports if library has changed
    if (this.libraryDirty) {
      this.libraryDirty = false
      this.portInfo = {}
    }

    // Highlight compatible ports
    let highlightPort

    highlightPort = null
    if (currentEdgePreview && currentEdgePreview.type) {
      highlightPort = {
        type: currentEdgePreview.type,
        isIn: !currentEdgePreview.isIn
      }
    }

    // Nodes
    const nodes = this.createNodes(graph, selectedIds, highlightPort)

    // Edges
    const edges = this.createEdges(graph)

    // IIPs
    const iips = this.createIIPs(graph)

    // Inport exports
    const inports = this.createInportExports(graph)

    // Outport exports
    const outports = this.createOutportExports(graph)

    // Groups
    const groups = this.createGroups(graph)

    // Selection pseudo-group
    if (displaySelectionGroup && selectedIds.length >= 2) {
      const limits = findMinMax(graph, selectedIds)
      if (limits) {
        const pseudoGroup = {
          name: 'selection',
          nodes: selectedIds,
          metadata: {color: 1}
        }

        const selectionGroupOptions = {
          ...Config.graph.selectionGroup,
          graph,
          app,
          item: pseudoGroup,
          minX: limits.minX,
          minY: limits.minY,
          maxX: limits.maxX,
          maxY: limits.maxY,
          scale,
          color: pseudoGroup.metadata.color,
          triggerMoveGroup: this.moveGroup,
          showContext
        }

        const selectionGroup = GraphGroup(selectionGroupOptions)

        groups.push(selectionGroup)
      }
    }

    // Edge preview
    const edgePreview = this.state.edgePreview

    if (edgePreview) {
      let edgePreviewOptions

      if (edgePreview.from) {
        const source = graph.getNode(edgePreview.from.process)
        const sourcePort = this.getNodeOutport(graph, edgePreview.from.process, edgePreview.from.port)

        edgePreviewOptions = {
          ...Config.graph.edgePreview,
          sX: source.metadata.x + source.metadata.width,
          sY: source.metadata.y + sourcePort.y,
          tX: edgePreviewX,
          tY: edgePreviewY,
          route: edgePreview.metadata.route
        }
      } else {
        const target = graph.getNode(edgePreview.to.process)
        const targetPort = this.getNodeInport(graph, edgePreview.to.process, edgePreview.to.port)

        edgePreviewOptions = {
          ...Config.graph.edgePreview,
          sX: edgePreviewX,
          sY: edgePreviewY,
          tX: target.metadata.x,
          tY: target.metadata.y + targetPort.y,
          route: edgePreview.metadata.route
        }
      }

      const edgePreviewView = GraphEdgePreview(edgePreviewOptions)

      edges.push(edgePreviewView)
    }

    const groupsOptions = Config.graph.groupsGroup
    const edgesOptions = Config.graph.edgesGroup
    const iipsOptions = Config.graph.iipsGroup
    const nodesOptions = Config.graph.nodesGroup
    const inportsOptions = Config.graph.inportsGroup
    const outportsOptions = Config.graph.outportsGroup

    const selectedClass = (forceSelection || selectedIds.length > 0) ? ' selection' : ''
    const containerOptions = {
      ...Config.graph.container,
      className: 'graph' + selectedClass
    }

    return (
      <GraphContainerGroup {...containerOptions}>
        <GraphGroupsGroup {...groupsOptions}>
          {groups}
        </GraphGroupsGroup>
        <GraphEdgesGroup {...edgesOptions}>
          {edges}
        </GraphEdgesGroup>
        <GraphIIPGroup {...iipsOptions}>
          {iips}
        </GraphIIPGroup>
        <GraphNodesGroup {...nodesOptions}>
          {nodes}
        </GraphNodesGroup>
        <GraphInportsGroup {...inportsOptions}>
          {inports}
        </GraphInportsGroup>
        <GraphGroupsGroup {...outportsOptions}>
          {outports}
        </GraphGroupsGroup>
      </GraphContainerGroup>
    )
  }
}
