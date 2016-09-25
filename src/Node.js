import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { buildLabelRectOptions } from './utils'
import Config from './Config'
import { Tooltip } from './mixins'
import Menu from './Menu'
import NodeMenuPorts from './NodeMenuPorts'
import NodeMenu from './NodeMenu'
import Track from './Track'
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

  constructor(props, context) {
    super(props, context)

    this.onTrackStart = this.onTrackStart.bind(this)
    this.onNodeSelection = this.onNodeSelection.bind(this)
    this.showContext = this.showContext.bind(this)
    this.onTrack = this.onTrack.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
  }

  componentDidMount() {
    const { onNodeSelection, showContext } = this.props
    const domNode = findDOMNode(this)

    // Dragging
    // domNode.addEventListener('trackstart', this.onTrackStart)

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

  componentWillUnmount() {
    const { onNodeSelection, showContext } = this.props
    const domNode = findDOMNode(this)

    // Dragging
    // domNode.removeEventListener('trackstart', this.onTrackStart)

    // Tap to select
    if (onNodeSelection) {
      domNode.removeEventListener('tap', this.onNodeSelection, true)
    }

    // Context menu
    if (showContext) {
      findDOMNode(this).removeEventListener('contextmenu', this.showContext)
      findDOMNode(this).removeEventListener('hold', this.showContext)
    }
  }

  onNodeSelection(event) {
    // Don't tap app (unselect)
    event.stopPropagation()

    const { nodeID, node } = this.props

    const toggle = (TheGraph.metaKeyPressed || event.pointerType === 'touch')

    this.props.onNodeSelection(nodeID, node, toggle)
  }

  onTrackStart(event) {
    // Don't drag graph
    event.stopPropagation()

    // Don't change selection
    // event.preventTap()

    const { app, graph } = this.props

    // Don't drag under menu
    if (app && app.menuShown) { return }

    // Don't drag while pinching
    if (app && app.pinching) { return }

    /*
    const domNode = findDOMNode(this)
    domNode.addEventListener('track', this.onTrack)
    domNode.addEventListener('trackend', this.onTrackEnd)
    */

    if (this.props.onTrackStart) {
      // should probably not be the entire event
      this.props.onTrackStart(event)
    }

    /* Should be done by whatever is going to handle us
    // Moving a node should only be a single transaction
    if (this.props.export) {
      graph.startTransaction('moveexport')
    } else {
      graph.startTransaction('movenode')
    }
    */
  }

  onTrack(event) {
    // Don't fire on graph
    event.stopPropagation()

    // this should not need graph.
    // we send out, and then the graph is updated.
    const { graph, exportKey, isIn, node, nodeID, scale } = this.props
    const _export = this.props.export

    const deltaX = Math.round(event.ddx / scale)
    const deltaY = Math.round(event.ddy / scale)

    // Fires a change event on noflo graph, which triggers redraw
    let newPos

    if (this.props.onTrack) {
      if (_export && _export.metadata) {
        newPos = {
          x: _export.metadata.x + deltaX,
          y: _export.metadata.y + deltaY
        }

        /*
        if (isIn) {
          graph.setInportMetadata(exportKey, newPos)
        } else {
          graph.setOutportMetadata(exportKey, newPos)
        }
        */
      } else {
        newPos = {
          x: node.metadata.x + deltaX,
          y: node.metadata.y + deltaY
        }
      }

      this.props.onTrack({
        exportKey,
        isIn,
        node,
        nodeID,
        x: newPos.x,
        y: newPos.y,
        'export': _export,
        scale
      })
    }
    /*
    if (exportMetadata) {
      const newPos = {
        x: _export.metadata.x + deltaX,
        y: _export.metadata.y + deltaY
      }

      if (isIn) {
        graph.setInportMetadata(exportKey, newPos)
      } else {
        graph.setOutportMetadata(exportKey, newPos)
      }
    } else {
      graph.setNodeMetadata(nodeID, {
        x: node.metadata.x + deltaX,
        y: node.metadata.y + deltaY
      })
    }
    */
  }

  onTrackEnd(event) {
    // Don't fire on graph
    event.stopPropagation()

    const { exportKey, graph, isIn, node, nodeID } = this.props
    const _export = this.props.export

    /*
    const domNode = findDOMNode(this)
    domNode.removeEventListener('track', this.onTrack)
    domNode.removeEventListener('trackend', this.onTrackEnd)
    */

    // Snap to grid
    const snapToGrid = true
    const snap = Config.node.snap / 2

    if (this.props.onTrackEnd) {
      this.props.onTrackEnd({
        exportKey,
        isIn,
        node,
        nodeID,
        'export': _export
      })
    }

    /* Re-Implement

    if (snapToGrid) {
      if (_export && _export.metadata) {
        const newPos = {
          x: Math.round(export.metadata.x / snap) * snap,
          y: Math.round(export.metadata.y / snap) * snap
        }

        if (isIn) {
          graph.setInportMetadata(exportKey, newPos)
        } else {
          graph.setOutportMetadata(exportKey, newPos)
        }
      } else {
        graph.setNodeMetadata(nodeID, {
          x: Math.round(node.metadata.x / snap) * snap,
          y: Math.round(node.metadata.y / snap) * snap
        })
      }
    }
    */

    /* Should be done by whatever handles us
    // Moving a node should only be a single transaction
    if (_export && _export.metadata) {
      graph.endTransaction('moveexport')
    } else {
      graph.endTransaction('movenode')
    }
    */
  }

  showContext(event) {
    // Don't show native context menu
    event.preventDefault()

    // Don't tap graph on hold event
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    const { isIn, graph, exportKey, node, nodeID, showContext } = this.props
    const _export = this.props.export

    // Get mouse position
    const x = event.x || event.clientX || 0
    const y = event.y || event.clientY || 0

    // App.showContext
    showContext({
      element: this,
      type: (_export ? (isIn ? 'graphInport' : 'graphOutport') : 'node'),
      x,
      y,
      graph,
      itemKey: (_export ? exportKey : nodeID),
      item: (_export ? _export : node)
    })
  }

  getContext(menu, options, triggerHideContext) {
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
    let menuOptions

    // If this node is an export
    if (_export) {
      menuOptions = {
        menu,
        options,
        triggerHideContext,
        label
      }

      return <Menu {...menuOptions} />
    }

    // this relies on the state of the parent app.

    // Absolute position of node
    const { x, y } = options
    const nodeX = (xProp + width / 2) * scale + appX
    const nodeY = (yProp + height / 2) * scale + appY
    const deltaX = nodeX - x
    const deltaY = nodeY - y

    // If there is a preview edge started, only show connectable ports
    if (edgePreview) {
      if (edgePreview.isIn) {
        // Show outputs
        menuOptions = {
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
        }
      } else {
        // Show inputs
        menuOptions = {
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
        }
      }

      return <NodeMenuPorts {...menuOptions} />
    }

    menuOptions = {
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
    }

    // Default, show whole node menu
    return <NodeMenu {...menuOptions} />
  }

  getTooltipTrigger() {
    return findDOMNode(this)
  }

  shouldShowTooltip() {
    return (this.props.app.state.scale < Config.base.zbpNormal)
  }

  shouldComponentUpdate(nextProps, nextState) {
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
  createPortViews(type, ports) {
    const {
      app,
      graph,
      highlightPort,
      node,
      nodeID,
      showContext
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

  createInportViews() {
    return this.createPortViews('in', this.props.ports.inports)
  }

  createOutportViews() {
    return this.createPortViews('out', this.props.ports.outports)
  }

  createIconContent() {
    const { iconsvg, width, height } = this.props

    // Node Icon
    let icon = Config.FONT_AWESOME[this.props.icon]

    if (!icon) {
      icon = Config.FONT_AWESOME.cog
    }

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

  render() {
    const { error, label, x, y, height, width, nodeID, selected } = this.props
    let { sublabel } = this.props

    if (this.props.ports.dirty) {
      // This tag is set when an edge or iip changes port colors
      this.props.ports.dirty = false
    }

    if (!sublabel || sublabel === label) {
      sublabel = ''
    }

    // Make views
    const NodeInportViews = this.createInportViews()
    const NodeOutportViews = this.createOutportViews()

    const NodeIconContent = this.createIconContent()

    const backgroundRectOptions = {
      ...Config.node.background,
      width,
      height: height + 25
    }

    const borderRectOptions = {
      ...Config.node.border,
      width,
      height
    }

    const innerRectOptions = {
      ...Config.node.innerRect,
      width: width - 6,
      height: height - 6
    }

    const inportsOptions = {
      ...Config.node.inports
    }

    const outportsOptions = {
      ...Config.node.outports
    }

    const labelTextOptions = {
      ...Config.node.labelText,
      x: width / 2,
      y: height + 15
    }

    let labelRectOptions
    const labelRectX = width / 2
    const labelRectY = height + 15

    labelRectOptions = buildLabelRectOptions(14, labelRectX, labelRectY, label.length, Config.node.labelRect.className)
    labelRectOptions = {
      ...Config.node.labelRect,
      ...labelRectOptions
    }

    const sublabelTextOptions = {
      ...Config.node.sublabelText,
      x: width / 2,
      y: height + 30
    }

    const sublabelRectX = width / 2
    const sublabelRectY = height + 30

    let sublabelRectOptions = buildLabelRectOptions(9, sublabelRectX, sublabelRectY, sublabel.length, Config.node.sublabelRect.className)
    sublabelRectOptions = {
      ...Config.node.sublabelRect,
      ...sublabelRectOptions
    }

    let nodeOptions

    nodeOptions = {
      className: `node drag${(selected ? ' selected' : '')}${(error ? ' error' : '')}`,
      name: nodeID,
      key: nodeID,
      title: label,
      transform: `translate(${x},${y})`
    }

    nodeOptions = {
      ...Config.node.container,
      ...nodeOptions
    }

    const trackOptions = {
       onTrackStart: this.onTrackStart,
       onTrack: this.onTrack,
       onTrackEnd: this.onTrackEnd
    }

    return (
      <Track {...trackOptions}>
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
              {sublabel}
            </NodeSublabelText>
          </NodeSublabelGroup>
        </NodeGroup>
      </Track>
    )
  }
}
