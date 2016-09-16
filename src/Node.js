import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {buildLabelRectOptions} from './utils'
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
    const {onNodeSelection, showContext} = this.props
    const domNode = findDOMNode(this)

    // Dragging
    domNode.addEventListener('trackstart', this.onTrackStart)

    // Tap to select
    if (onNodeSelection) {
      domNode.addEventListener('tap', this.onNodeSelection, true)
    }

    // Context menu
    if (showContext) {
      findDOMNode(this).addEventListener('contextmenu', this.showContext)
      findDOMNode(this).addEventListener('hold', this.showContext)
    }
  }

  onNodeSelection (event) {
    // Don't tap app (unselect)
    event.stopPropagation()

    const {nodeID, node} = this.props

    const toggle = (TheGraph.metaKeyPressed || event.pointerType === 'touch')

    this.props.onNodeSelection(nodeID, node, toggle)
  }

  onTrackStart (event) {
    // Don't drag graph
    event.stopPropagation()

    // Don't change selection
    event.preventTap()

    const {app, graph} = this.props

    // Don't drag under menu
    if (app.menuShown) { return }

    // Don't drag while pinching
    if (app.pinching) { return }

    var domNode = findDOMNode(this)
    domNode.addEventListener('track', this.onTrack)
    domNode.addEventListener('trackend', this.onTrackEnd)

    // Moving a node should only be a single transaction
    if (this.props.export) {
      graph.startTransaction('moveexport')
    } else {
      graph.startTransaction('movenode')
    }
  }

  onTrack (event) {
    // Don't fire on graph
    event.stopPropagation()

    const {graph, exportKey, isIn, node: nodeMetadata, nodeID, scale} = this.props
    const {metadata: exportMetadata} = this.props.export

    const deltaX = Math.round(event.ddx / scale)
    const deltaY = Math.round(event.ddy / scale)

    // Fires a change event on noflo graph, which triggers redraw
    if (exportMetadata) {
      const newPos = {
        x: exportMetadata.x + deltaX,
        y: exportMetadata.y + deltaY
      }

      if (isIn) {
        graph.setInportMetadata(exportKey, newPos)
      } else {
        graph.setOutportMetadata(exportKey, newPos)
      }
    } else {
      graph.setNodeMetadata(nodeID, {
        x: nodeMetadata.x + deltaX,
        y: nodeMetadata.y + deltaY
      })
    }
  }

  onTrackEnd (event) {
    // Don't fire on graph
    event.stopPropagation()

    const {exportKey, graph, isIn, node: {metadata: nodeMetadata}, nodeID} = this.props
    const {metadata: exportMetadata} = this.props.export

    const domNode = findDOMNode(this)
    domNode.removeEventListener('track', this.onTrack)
    domNode.removeEventListener('trackend', this.onTrackEnd)

    // Snap to grid
    const snapToGrid = true
    const snap = Config.node.snap / 2

    if (snapToGrid) {
      if (exportMetadata) {
        const newPos = {
          x: Math.round(exportMetadata.x / snap) * snap,
          y: Math.round(exportMetadata.y / snap) * snap
        }

        if (isIn) {
          graph.setInportMetadata(exportKey, newPos)
        } else {
          graph.setOutportMetadata(exportKey, newPos)
        }
      } else {
        graph.setNodeMetadata(nodeID, {
          x: Math.round(nodeMetadata.x / snap) * snap,
          y: Math.round(nodeMetadata.y / snap) * snap
        })
      }
    }

    // Moving a node should only be a single transaction
    if (exportMetadata) {
      graph.endTransaction('moveexport')
    } else {
      graph.endTransaction('movenode')
    }
  }

  showContext (event) {
    // Don't show native context menu
    event.preventDefault()

    // Don't tap graph on hold event
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    const {isIn, graph, exportKey, node, nodeID, showContext} = this.props
    const _export = this.props.export

    // Get mouse position
    const x = event.x || event.clientX || 0
    const y = event.y || event.clientY || 0

    // App.showContext
    showContext({
      element: this,
      type: (_export ? (isIn ? 'graphInport' : 'graphOutport') : 'node'),
      x: x,
      y: y,
      graph,
      itemKey: (_export ? exportKey : nodeID),
      item: (_export ? _export : node)
    })
  }

  getContext (menu, options, triggerHideContext) {
    const {
      app: {
        state: {
          x: appX,
          y: appY,
          scale
        }
      },
      exportKey: label,
      graph,
      icon,
      highlightPort,
      ports,
      node: process,
      nodeID: processKey,
      x: xProp,
      y: yProp,
      width,
      height,
      graphView,
      graphView: {
        state: {
          edgePreview
        }
      }
    } = this.props

    const _export = this.props.export

    // If this node is an export
    if (_export) {
      return Menu({
        menu,
        options,
        triggerHideContext,
        label
      })
    }

    // this relies on the state of the parent app.

    // Absolute position of node
    const {x, y} = options
    const nodeX = (xProp + width / 2) * scale + appX
    const nodeY = (yProp + height / 2) * scale + appY
    const deltaX = nodeX - x
    const deltaY = nodeY - y

    // If there is a preview edge started, only show connectable ports
    if (edgePreview) {
      if (edgePreview.isIn) {
        // Show outputs
        return NodeMenuPorts({
          ports: ports.outports,
          triggerHideContext,
          isIn: false,
          scale,
          processKey,
          deltaX,
          deltaY,
          translateX: x,
          translateY: y,
          nodeWidth: width,
          nodeHeight: height,
          highlightPort
        })
      } else {
        // Show inputs
        return NodeMenuPorts({
          ports: ports.inports,
          triggerHideContext,
          isIn: true,
          scale,
          processKey,
          deltaX,
          deltaY,
          translateX: x,
          translateY: y,
          nodeWidth: width,
          nodeHeight: height,
          highlightPort
        })
      }
    }

    // Default, show whole node menu
    return NodeMenu({
      menu,
      options,
      triggerHideContext,
      label,
      graph,
      graphView,
      node: this,
      icon,
      ports,
      process,
      processKey,
      x,
      y,
      nodeWidth: width,
      nodeHeight: height,
      deltaX,
      deltaY,
      highlightPort
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
      highlightPort,
      node,
      nodeID,
      showContext,
    } = this.props

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
        isIn: type === 'in',
        isExport,
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
      const iconSVGOptions = {
        ...Config.node.iconsvg,
        src: iconsvg,
        x: Config.base.config.nodeRadius - 4,
        y: Config.base.config.nodeRadius - 4,
        width: width - 10,
        height: height - 10
      }

      return <NodeIconSVG {...iconSVGOptions} />
    } else {
      const iconOptions = {
        ...Config.node.icon,
        x: width / 2,
        y: height / 2,
        children: icon
      }

      return <NodeIconText {...iconOptions} />
    }
  }

  render () {
    const {error, x, y, height, width, nodeID, selected} = this.props

    if (this.props.ports.dirty) {
      // This tag is set when an edge or iip changes port colors
      this.props.ports.dirty = false
    }

    let label = this.props.label
    let sublabel = this.props.sublabel
    if (!sublabel || sublabel === label) {
      sublabel = ''
    }

    // Make views
    const NodeInportViews = this.createInportViews()
    const NodeOutportViews = this.createOutportViews()

    const NodeIconContent = this.createIconContent()

    const backgroundRectOptions = {
      ...Config.node.background,
      width: this.props.width,
      height: this.props.height + 25
    }

    const borderRectOptions = {
      ...Config.node.border,
      width: this.props.width,
      height: this.props.height
    }

    const innerRectOptions = {
      ...Config.node.innerRect,
      width: this.props.width - 6,
      height: this.props.height - 6
    }

    const inportsOptions = {
      ...Config.node.inports
      // { children: inportViews }
    }

    const outportsOptions = {
      ...Config.node.outports
      // { children: outportViews }
    }

    const labelTextOptions = {
      ...Config.node.labelText,
      x: this.props.width / 2,
      y: this.props.height + 15
      // { children: label });
    }

    let labelRectOptions
    const labelRectX = this.props.width / 2
    const labelRectY = this.props.height + 15

    labelRectOptions = buildLabelRectOptions(14, labelRectX, labelRectY, label.length, Config.node.labelRect.className)
    labelRectOptions = {
      ...Config.node.labelRect,
      ...labelRectOptions
    }

    // has children
    // / var labelGroup = createNodeLabelGroup(Config.node.labelBackground, [labelRect, labelText]);

    const sublabelTextOptions = {
      ...Config.node.sublabelText,
      x: width / 2,
      y: height + 30
      // { children: sublabel }
    }

    const sublabelRectX = width / 2
    const sublabelRectY = height + 30

    let sublabelRectOptions = buildLabelRectOptions(9, sublabelRectX, sublabelRectY, sublabel.length, Config.node.sublabelRect.className)
    sublabelRectOptions = {
      ...Config.node.sublabelRect,
      ...sublabelRectOptions
    }

    // var sublabelGroup = createNodeSublabelGroup(Config.node.sublabelBackground, [sublabelRect, sublabelText]);

    let nodeOptions

    nodeOptions = {
      className: 'node drag' + (selected ? ' selected' : '') + (error ? ' error' : ''),
      name: nodeID,
      key: nodeID,
      title: label,
      transform: 'translate(' + x + ',' + y + ')'
    }

    nodeOptions = {
      ...Config.node.container,
      ...nodeOptions
    }

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
