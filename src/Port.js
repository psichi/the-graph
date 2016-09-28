import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Hammer from 'react-hammerjs'
import { arcs } from './utils'
import Config from './Config'
import { Tooltip } from './mixins'
import Menu from './Menu'
import Track from './Track'
import {
  PortArc,
  PortBackgroundCircle,
  PortGroup,
  PortInnerCircle,
  PortLabelText
} from './factories/port'

// Port view
export default class TheGraphPort extends Component {
  mixins = [
    Tooltip
  ]

  static defaultProps = {
    label: '',
    x: 0,
    y: 0
  }

  static propTypes = {
    app: PropTypes.object,
    label: PropTypes.string.isRequired,
    isIn: PropTypes.bool,
    port: PropTypes.object.isRequired,
    graph: PropTypes.object,
    route: PropTypes.number,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    showContext: PropTypes.func,
    isExport: PropTypes.bool,
    highlightPort: PropTypes.bool,
    onEdgeStart: PropTypes.func,
    onEdgeDrop: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    this.edgeStart = this.edgeStart.bind(this)
    this.triggerDropOnTarget = this.triggerDropOnTarget.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount() {
    const domNode = findDOMNode(this)

    // Preview edge start
    // addEventListener('tap', this.edgeStart)
    /*
     addEventListener('trackstart', this.edgeStart)
     // Make edge
     addEventListener('trackend', this.triggerDropOnTarget)
     */

    // listens for drop on this port.


    // No need for dispatch
    domNode.addEventListener('the-graph-edge-drop', this.edgeStart)

    // Show context menu
    if (this.props.showContext) {
      domNode.addEventListener('contextmenu', this.showContext)
      domNode.addEventListener('hold', this.showContext)
    }
  }


  componentWillUnmount() {
    const { addEventListener } = findDOMNode(this)

    // Preview edge start
    // removeEventListener('tap', this.edgeStart)
    /*
    removeEventListener('trackstart', this.edgeStart)
    // Make edge
    removeEventListener('trackend', this.triggerDropOnTarget)
    */
    // removeEventListener('the-graph-edge-drop', this.edgeStart)

    // Show context menu
    if (this.props.showContext) {
      removeEventListener('contextmenu', this.showContext)
      removeEventListener('hold', this.showContext)
    }
  }

  getTooltipTrigger() {
    return findDOMNode(this)
  }

  shouldShowTooltip() {
    const { label, app: { state: { scale } } } = this.props

    return (
      scale < Config.base.zbpBig || label.length > 8
    )
  }

  showContext(event) {
    const { isExport, isIn, graph, label: itemKey, port: item, showContext } = this.props
    const { label: labelRef } = this.refs

    // Don't show port menu on export node port
    if (isExport) {
      return
    }

    // Click on label, pass context menu to node
    if (event && (event.target === findDOMNode(labelRef))) {
      return
    }

    // Don't show native context menu
    event.preventDefault()

    // Don't tap graph on hold event
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    // Get mouse position
    const x = event.x || event.clientX || 0
    const y = event.y || event.clientY || 0

    // App.showContext
    showContext({
      element: this,
      type: (isIn ? 'nodeInport' : 'nodeOutport'),
      x,
      y,
      graph,
      itemKey,
      item
    })
  }

  getContext(menu, options, triggerHideContext) {
    const { label } = this.props

    const menuOptions = {
      menu,
      options,
      label,
      triggerHideContext
    }

    return <Menu {...menuOptions} />
  }

  edgeStart(event) {
    const { isExport, isIn, port, route } = this.props
    const { label: labelRef } = this.refs
    const domNode = findDOMNode(this)

    // Don't start edge on export node port
    if (isExport) {
      return
    }
    // Click on label, pass context menu to node
    if (event && (event.target === findDOMNode(labelRef))) {
      return
    }
    // Don't tap graph
    event.stopPropagation()

    if (this.props.onEdgeStart) {
      this.props.onEdgeStart({
        type: 'Edge/START',
        payload: {
          isIn,
          port,
          // process: this.props.processKey,
          route
        }
      })
    }

    const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn,
        port,
        // process: this.props.processKey,
        route
      },
      bubbles: true
    })

    domNode.dispatchEvent(edgeStartEvent)
  }

  triggerDropOnTarget(event) {
    // If dropped on a child element will bubble up to port

    // if (!event.relatedTarget) { return }
    if (!event.target) { return }

    if (this.props.onEdgeDrop) {
      this.props.onEdgeDrop({
        type: 'Edge/DROP',
        payload: null
      })
    }

    const dropEvent = new CustomEvent('the-graph-edge-drop', {
      detail: null,
      bubbles: true
    })

    // event.relatedTarget.dispatchEvent(dropEvent)
    event.target.dispatchEvent(dropEvent)
  }

  render() {
    let style

    const { label, highlightPort, isIn, port, route, x, y } = this.props

    if (label.length > 7) {
      const fontSize = 6 * (30 / (4 * label.length))
      style = {
        fontSize: `${fontSize}px`
      }
    }

    let r
    let inArc
    let outArc

    // Highlight matching ports
    r = 4
    inArc = arcs.inport
    outArc = arcs.outport

    if (highlightPort && highlightPort.isIn === isIn && (highlightPort.type === port.type || port.type === 'any')) {
      r = 6
      inArc = arcs.inportBig
      outArc = arcs.outportBig
    }

    const backgroundCircleOptions = {
      ...Config.port.backgroundCircle,
      r: r + 1
    }

    const arcOptions = {
      ...Config.port.arc,
      d: (isIn ? inArc : outArc)
    }

    const innerCircleOptions = {
      ...Config.port.innerCircle,
      className: `port-circle-small fill route${route}`,
      r: r - 1.5
    }

    const labelTextOptions = {
      ...Config.port.text,
      x: (isIn ? 5 : -5),
      style
    }

    const containerOptions = {
      ...Config.port.container,
      title: label,
      transform: `translate(${x},${y})`
    }

    // problem track and hammer give different event types.
    // <Hammer onTap={this.edgeStart}>
    // </Hammer>
    return (
      <Track
        onTrackStart={this.edgeStart}
        onTrackEnd={this.triggerDropOnTarget}>
        <PortGroup {...containerOptions}>
          <PortBackgroundCircle {...backgroundCircleOptions} />
          <PortArc {...arcOptions} />
          <PortInnerCircle {...innerCircleOptions} />
          <PortLabelText {...labelTextOptions}>
            {label}
          </PortLabelText>
        </PortGroup>
      </Track>
    )
  }
}
