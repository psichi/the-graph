import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {arcs} from './utils'
import Config from './Config'
import {Tooltip} from './mixins'
import Menu from './Menu'
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
    highlightPort: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)

    this.edgeStart = this.edgeStart.bind(this)
    this.triggerDropOnTarget = this.triggerDropOnTarget.bind(this)
    this.edgeStart = this.edgeStart.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount () {
    const {addEventListener} = findDOMNode(this)

    // Preview edge start
    addEventListener('tap', this.edgeStart)
    addEventListener('trackstart', this.edgeStart)
    // Make edge
    addEventListener('trackend', this.triggerDropOnTarget)
    addEventListener('the-graph-edge-drop', this.edgeStart)

    // Show context menu
    if (this.props.showContext) {
      addEventListener('contextmenu', this.showContext)
      addEventListener('hold', this.showContext)
    }
  }

  getTooltipTrigger () {
    return findDOMNode(this)
  }

  shouldShowTooltip () {
    const {label, app: {state: {scale}}} = this.props

    return (
      scale < Config.base.zbpBig || label.length > 8
    )
  }

  showContext (event) {
    const {isExport, isIn, graph, label: itemKey, port: item, showContext} = this.props
    const {label: labelRef} = this.refs

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

  getContext (menu, options, triggerHideContext) {
    const {label} = this.props

    return Menu({
      menu,
      options,
      label,
      triggerHideContext
    })
  }

  edgeStart (event) {
    const {isExport, isIn, port, route} = this.props
    const {label: labelRef} = this.refs
    const {dispatchEvent} = findDOMNode(this)

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

    const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn,
        port,
        // process: this.props.processKey,
        route
      },
      bubbles: true
    })

    dispatchEvent(edgeStartEvent)
  }

  triggerDropOnTarget (event) {
    // If dropped on a child element will bubble up to port
    if (!event.relatedTarget) { return }

    const dropEvent = new CustomEvent('the-graph-edge-drop', {
      detail: null,
      bubbles: true
    })

    event.relatedTarget.dispatchEvent(dropEvent)
  }

  render () {
    let style

    const {label, highlightPort, isIn, port, route, x, y} = this.props

    if (label.length > 7) {
      const fontSize = 6 * (30 / (4 * label.length))
      style = { 'fontSize': fontSize + 'px' }
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

    // const backgroundCircle = createPortBackgroundCircle(backgroundCircleOptions);

    const arcOptions = {
      ...Config.port.arc,
      d: (isIn ? inArc : outArc)
    }

    // var arc = createPortArc(arcOptions);

    const innerCircleOptions = {
      ...Config.port.innerCircle,
      className: 'port-circle-small fill route' + route,
      r: r - 1.5
    }

    // const innerCircle = createPortInnerCircle(innerCircleOptions);

    const labelTextOptions = {
      ...Config.port.text,
      x: (isIn ? 5 : -5),
      style
      // children: label
    }

    const containerOptions = {
      ...Config.port.container,
      title: label,
      transform: 'translate(' + x + ',' + y + ')'
    }

    return (
      <PortGroup {...containerOptions}>
        <PortBackgroundCircle {...backgroundCircleOptions} />
        <PortArc {...arcOptions} />
        <PortInnerCircle {...innerCircleOptions} />
        <PortLabelText {...labelTextOptions}>
          {label}
        </PortLabelText>
      </PortGroup>
    )
  }
}
