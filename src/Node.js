import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {buildLabelRectOptions, merge} from './utils'
import Config from './Config'
import {Tooltip} from './mixins'
import Menu from './Menu'
import NodeMenuPorts from './NodeMenuPorts'
import NodeMenu from './NodeMenu'
import {
  NodeBorderRect,
  NodeGroup,
  NodeBackgroundRect,
  NodeIconSVG,
  NodeIconText,
  NodeInnerRect,
  NodeInportsGroup,
  NodeLabelGroup,
  NodeLabelRect,
  NodeLabelText,
  NodeOutportsGroup,
  NodePort,
  NodeSublabelGroup,
  NodeSublabelRect,
  NodeSublabelText
} from './factories/node'

// Node view
export default class TheGraphNode extends Component {
  mixins = [
    Tooltip
  ]

  static propTypes = {
    app: PropTypes.object.isRequired,
    graph: PropTypes.object.isRequired,
    'export': PropTypes.object,
    exportKey: PropTypes.string,
    highlightPort: PropTypes.bool,
    isIn: PropTypes.bool,
    iconsvg: PropTypes.string,
    node: PropTypes.object.isRequired,
    nodeID: PropTypes.string.isRequired,
    onNodeSelection: PropTypes.func,
    ports: PropTypes.object.isRequired,
    showContext: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
    height: PropTypes.number,
    width: PropTypes.number,
    graphView: PropTypes.any,
    icon: PropTypes.string,
    label: PropTypes.string,
    sublabel: PropTypes.string,
    selected: PropTypes.bool,
    error: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)

    this.onTrackStart = this.onTrackStart.bind(this)
    this.onNodeSelection = this.onNodeSelection.bind(this)
    this.showContext = this.showContext.bind(this)
    this.onTrack = this.onTrack.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
  }

  componentDidMount () {
    const domNode = findDOMNode(this)

    // Dragging
    domNode.addEventListener('trackstart', this.onTrackStart)

    // Tap to select
    if (this.props.onNodeSelection) {
      domNode.addEventListener('tap', this.onNodeSelection, true)
    }

    // Context menu
    if (this.props.showContext) {
      findDOMNode(this).addEventListener('contextmenu', this.showContext)
      findDOMNode(this).addEventListener('hold', this.showContext)
    }
  }

  onNodeSelection (event) {
    // Don't tap app (unselect)
    event.stopPropagation()

    throw Error('FIX ME')
    var toggle = (TheGraph.metaKeyPressed || event.pointerType === 'touch')
    this.props.onNodeSelection(this.props.nodeID, this.props.node, toggle)
  }

  onTrackStart (event) {
    // Don't drag graph
    event.stopPropagation()

    // Don't change selection
    event.preventTap()

    // Don't drag under menu
    if (this.props.app.menuShown) { return }

    // Don't drag while pinching
    if (this.props.app.pinching) { return }

    var domNode = findDOMNode(this)
    domNode.addEventListener('track', this.onTrack)
    domNode.addEventListener('trackend', this.onTrackEnd)

    // Moving a node should only be a single transaction
    if (this.props.export) {
      this.props.graph.startTransaction('moveexport')
    } else {
      this.props.graph.startTransaction('movenode')
    }
  }

  onTrack (event) {
    // Don't fire on graph
    event.stopPropagation()

    var scale = this.props.app.state.scale
    var deltaX = Math.round(event.ddx / scale)
    var deltaY = Math.round(event.ddy / scale)

    // Fires a change event on noflo graph, which triggers redraw
    if (this.props.export) {
      var newPos = {
        x: this.props.export.metadata.x + deltaX,
        y: this.props.export.metadata.y + deltaY
      }
      if (this.props.isIn) {
        this.props.graph.setInportMetadata(this.props.exportKey, newPos)
      } else {
        this.props.graph.setOutportMetadata(this.props.exportKey, newPos)
      }
    } else {
      this.props.graph.setNodeMetadata(this.props.nodeID, {
        x: this.props.node.metadata.x + deltaX,
        y: this.props.node.metadata.y + deltaY
      })
    }
  }

  onTrackEnd (event) {
    // Don't fire on graph
    event.stopPropagation()

    const domNode = findDOMNode(this)
    domNode.removeEventListener('track', this.onTrack)
    domNode.removeEventListener('trackend', this.onTrackEnd)

    // Snap to grid
    var snapToGrid = true
    var snap = Config.node.snap / 2
    if (snapToGrid) {
      var x, y
      if (this.props.export) {
        var newPos = {
          x: Math.round(this.props.export.metadata.x / snap) * snap,
          y: Math.round(this.props.export.metadata.y / snap) * snap
        }
        if (this.props.isIn) {
          this.props.graph.setInportMetadata(this.props.exportKey, newPos)
        } else {
          this.props.graph.setOutportMetadata(this.props.exportKey, newPos)
        }
      } else {
        this.props.graph.setNodeMetadata(this.props.nodeID, {
          x: Math.round(this.props.node.metadata.x / snap) * snap,
          y: Math.round(this.props.node.metadata.y / snap) * snap
        })
      }
    }

    // Moving a node should only be a single transaction
    if (this.props.export) {
      this.props.graph.endTransaction('moveexport')
    } else {
      this.props.graph.endTransaction('movenode')
    }
  }

  showContext (event) {
    // Don't show native context menu
    event.preventDefault()

    // Don't tap graph on hold event
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    // Get mouse position
    var x = event.x || event.clientX || 0
    var y = event.y || event.clientY || 0

    // App.showContext
    this.props.showContext({
      element: this,
      type: (this.props.export ? (this.props.isIn ? 'graphInport' : 'graphOutport') : 'node'),
      x: x,
      y: y,
      graph: this.props.graph,
      itemKey: (this.props.export ? this.props.exportKey : this.props.nodeID),
      item: (this.props.export ? this.props.export : this.props.node)
    })
  }

  getContext (menu, options, hide) {
    // If this node is an export
    if (this.props.export) {
      return Menu({
        menu: menu,
        options: options,
        triggerHideContext: hide,
        label: this.props.exportKey
      })
    }

    // this relies on the state of the parent app.

    // Absolute position of node
    var x = options.x
    var y = options.y
    var scale = this.props.app.state.scale
    var appX = this.props.app.state.x
    var appY = this.props.app.state.y
    var nodeX = (this.props.x + this.props.width / 2) * scale + appX
    var nodeY = (this.props.y + this.props.height / 2) * scale + appY
    var deltaX = nodeX - x
    var deltaY = nodeY - y
    var ports = this.props.ports
    var processKey = this.props.nodeID
    var highlightPort = this.props.highlightPort

    // If there is a preview edge started, only show connectable ports
    if (this.props.graphView.state.edgePreview) {
      if (this.props.graphView.state.edgePreview.isIn) {
        // Show outputs
        return NodeMenuPorts({
          ports: ports.outports,
          triggerHideContext: hide,
          isIn: false,
          scale: scale,
          processKey: processKey,
          deltaX: deltaX,
          deltaY: deltaY,
          translateX: x,
          translateY: y,
          nodeWidth: this.props.width,
          nodeHeight: this.props.height,
          highlightPort: highlightPort
        })
      } else {
        // Show inputs
        return NodeMenuPorts({
          ports: ports.inports,
          triggerHideContext: hide,
          isIn: true,
          scale: scale,
          processKey: processKey,
          deltaX: deltaX,
          deltaY: deltaY,
          translateX: x,
          translateY: y,
          nodeWidth: this.props.width,
          nodeHeight: this.props.height,
          highlightPort: highlightPort
        })
      }
    }

    // Default, show whole node menu
    return NodeMenu({
      menu: menu,
      options: options,
      triggerHideContext: hide,
      label: this.props.label,
      graph: this.props.graph,
      graphView: this.props.graphView,
      node: this,
      icon: this.props.icon,
      ports: ports,
      process: this.props.node,
      processKey: processKey,
      x: x,
      y: y,
      nodeWidth: this.props.width,
      nodeHeight: this.props.height,
      deltaX: deltaX,
      deltaY: deltaY,
      highlightPort: highlightPort
    })
  }

  getTooltipTrigger () {
    return findDOMNode(this)
  }

  shouldShowTooltip () {
    return (this.props.app.state.scale < Config.base.zbpNormal)
  }

  shouldComponentUpdate (nextProps, nextState) {
    // Only rerender if changed
    return (
      nextProps.x !== this.props.x ||
      nextProps.y !== this.props.y ||
      nextProps.icon !== this.props.icon ||
      nextProps.label !== this.props.label ||
      nextProps.sublabel !== this.props.sublabel ||
      nextProps.ports !== this.props.ports ||
      nextProps.selected !== this.props.selected ||
      nextProps.error !== this.props.error ||
      nextProps.highlightPort !== this.props.highlightPort ||
      nextProps.ports.dirty === true
    )
  }

  // Ports
  createPortViews (type, ports) {
    const {
      app,
      graph,
      height,
      highlightPort,
      node,
      nodeID,
      showContext,
      width,
      x,
      y
    } = this.props

    console.log('THE PROPS', ports)

    const isExport = (this.props.export !== undefined)

    const keys = Object.keys(ports)

    return keys.map((key) => {
      const info = ports[key]
      const props = {
        app,
        graph,
        node,
        key: `${nodeID}.${type}.${info.label}`,
        label: info.label,
        processKey: nodeID,
        isIn: true,
        isExport,
        nodeX: x,
        nodeY: y,
        nodeWidth: width,
        nodeHeight: height,
        x: info.x,
        y: info.y,
        port: {
          process: nodeID,
          port: info.label,
          type: info.type
        },
        highlightPort,
        route: info.route,
        showContext
      }

      console.log('Props for Node Port', props)

      return <NodePort {...props} />
    })
  }

  createInportViews () {
    return this.createPortViews('in', this.props.ports.inports)
  }

  createOutportViews () {
    return this.createPortViews('out', this.props.ports.outports)
  }

  createIconContent () {
    const {iconsvg, width, height} = this.props

    // Node Icon
    let icon = Config.FONT_AWESOME[ this.props.icon ]

    if (!icon) {
      icon = Config.FONT_AWESOME.cog
    }

    console.log('iCON', icon)
    console.log('iCON SVG', iconsvg)

    if (iconsvg && iconsvg !== '') {
      const iconSVGOptions = merge(Config.node.iconsvg, {
        src: iconsvg,
        x: Config.base.config.nodeRadius - 4,
        y: Config.base.config.nodeRadius - 4,
        width: width - 10,
        height: height - 10
      })

      return <NodeIconSVG {...iconSVGOptions} />
    } else {
      const iconOptions = merge(Config.node.icon, {
        x: width / 2,
        y: height / 2,
        children: icon
      })

      return <NodeIconText {...iconOptions} />
    }
  }

  render () {
    if (this.props.ports.dirty) {
      // This tag is set when an edge or iip changes port colors
      this.props.ports.dirty = false
    }

    var label = this.props.label
    var sublabel = this.props.sublabel
    if (!sublabel || sublabel === label) {
      sublabel = ''
    }
    var x = this.props.x
    var y = this.props.y

    // Make views
    const NodeInportViews = this.createInportViews()
    const NodeOutportViews = this.createOutportViews()

    const NodeIconContent = this.createIconContent()

    const backgroundRectOptions = merge(Config.node.background, { width: this.props.width, height: this.props.height + 25 })
    const borderRectOptions = merge(Config.node.border, { width: this.props.width, height: this.props.height })
    const innerRectOptions = merge(Config.node.innerRect, { width: this.props.width - 6, height: this.props.height - 6 })

    const inportsOptions = Config.node.inports // merge(Config.node.inports, { children: inportViews });
    const outportsOptions = Config.node.outports // merge(Config.node.outports, { children: outportViews });

    const labelTextOptions = merge(Config.node.labelText, { x: this.props.width / 2, y: this.props.height + 15})
    // , children: label });

    let labelRectOptions
    const labelRectX = this.props.width / 2
    const labelRectY = this.props.height + 15
    labelRectOptions = buildLabelRectOptions(14, labelRectX, labelRectY, label.length, Config.node.labelRect.className)
    labelRectOptions = merge(Config.node.labelRect, labelRectOptions)

    // has children
    // / var labelGroup = createNodeLabelGroup(Config.node.labelBackground, [labelRect, labelText]);

    var sublabelTextOptions = merge(Config.node.sublabelText, { x: this.props.width / 2, y: this.props.height + 30})
    //, children: sublabel });

    var sublabelRectX = this.props.width / 2
    var sublabelRectY = this.props.height + 30
    var sublabelRectOptions = buildLabelRectOptions(9, sublabelRectX, sublabelRectY, sublabel.length, Config.node.sublabelRect.className)
    sublabelRectOptions = merge(Config.node.sublabelRect, sublabelRectOptions)

    // var sublabelGroup = createNodeSublabelGroup(Config.node.sublabelBackground, [sublabelRect, sublabelText]);

    let nodeOptions

    nodeOptions = {
      className: 'node drag' + (this.props.selected ? ' selected' : '') + (this.props.error ? ' error' : ''),
      name: this.props.nodeID,
      key: this.props.nodeID,
      title: label,
      transform: 'translate(' + x + ',' + y + ')'
    }

    nodeOptions = merge(Config.node.container, nodeOptions)

    return (
      <NodeGroup {...nodeOptions}>
        <NodeBackgroundRect {...backgroundRectOptions} />
        <NodeBorderRect {...borderRectOptions} />
        <NodeInnerRect {...innerRectOptions} />
        {NodeIconContent}
        <NodeInportsGroup {...inportsOptions}>
          {NodeInportViews}
        </NodeInportsGroup>
        <NodeOutportsGroup {...outportsOptions}>
          {NodeOutportViews}
        </NodeOutportsGroup>
        <NodeLabelGroup {...Config.node.labelBackground}>
          <NodeLabelRect {...labelRectOptions} />
          <NodeLabelText {...labelTextOptions}>
            {label}
          </NodeLabelText>
        </NodeLabelGroup>
        <NodeSublabelGroup {...Config.node.sublabelBackground}>
          <NodeSublabelRect {...sublabelRectOptions} />
          <NodeSublabelText {...sublabelTextOptions}>
            Heh {sublabel}
          </NodeSublabelText>
        </NodeSublabelGroup>
      </NodeGroup>
    )
  }
}

/* Main Structure
 var nodeContents = [
 backgroundRect,
 borderRect,
 innerRect,
 iconContent,
 inportsGroup,
 outportsGroup,
 labelGroup,
 sublabelGroup
 ];
 */
// return createNodeGroup(nodeOptions, nodeContents);
