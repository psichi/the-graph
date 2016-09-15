import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {arcs, merge} from './utils'
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
    port: PropTypes.object,
    graph: PropTypes.object,
    route: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    showContext: PropTypes.func,
    isExport: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)

    this.edgeStart = this.edgeStart.bind(this)
    this.triggerDropOnTarget = this.triggerDropOnTarget.bind(this)
    this.edgeStart = this.edgeStart.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount () {
    // Preview edge start
    findDOMNode(this).addEventListener('tap', this.edgeStart)
    findDOMNode(this).addEventListener('trackstart', this.edgeStart)
    // Make edge
    findDOMNode(this).addEventListener('trackend', this.triggerDropOnTarget)
    findDOMNode(this).addEventListener('the-graph-edge-drop', this.edgeStart)

    // Show context menu
    if (this.props.showContext) {
      findDOMNode(this).addEventListener('contextmenu', this.showContext)
      findDOMNode(this).addEventListener('hold', this.showContext)
    }
  }

  getTooltipTrigger () {
    return findDOMNode(this)
  }

  shouldShowTooltip () {
    return (
      this.props.app.state.scale < Config.base.zbpBig ||
      this.props.label.length > 8
    )
  }

  showContext (event) {
    // Don't show port menu on export node port
    if (this.props.isExport) {
      return
    }
    // Click on label, pass context menu to node
    if (event && (event.target === findDOMNode(this.refs.label))) {
      return
    }
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
      type: (this.props.isIn ? 'nodeInport' : 'nodeOutport'),
      x: x,
      y: y,
      graph: this.props.graph,
      itemKey: this.props.label,
      item: this.props.port
    })
  }

  getContext (menu, options, hide) {
    return Menu({
      menu: menu,
      options: options,
      label: this.props.label,
      triggerHideContext: hide
    })
  }

  edgeStart (event) {
    // Don't start edge on export node port
    if (this.props.isExport) {
      return
    }
    // Click on label, pass context menu to node
    if (event && (event.target === findDOMNode(this.refs.label))) {
      return
    }
    // Don't tap graph
    event.stopPropagation()

    var edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn: this.props.isIn,
        port: this.props.port,
        // process: this.props.processKey,
        route: this.props.route
      },
      bubbles: true
    })
    findDOMNode(this).dispatchEvent(edgeStartEvent)
  }

  triggerDropOnTarget (event) {
    // If dropped on a child element will bubble up to port
    if (!event.relatedTarget) { return }
    var dropEvent = new CustomEvent('the-graph-edge-drop', {
      detail: null,
      bubbles: true
    })
    event.relatedTarget.dispatchEvent(dropEvent)
  }

  render () {
    var style
    console.log('dus', this.props)
    if (this.props.label.length > 7) {
      var fontSize = 6 * (30 / (4 * this.props.label.length))
      style = { 'fontSize': fontSize + 'px' }
    }
    var r = 4
    // Highlight matching ports
    var highlightPort = this.props.highlightPort
    var inArc = arcs.inport
    var outArc = arcs.outport
    if (highlightPort && highlightPort.isIn === this.props.isIn && (highlightPort.type === this.props.port.type || this.props.port.type === 'any')) {
      r = 6
      inArc = arcs.inportBig
      outArc = arcs.outportBig
    }

    var backgroundCircleOptions = merge(Config.port.backgroundCircle, { r: r + 1 })
    // var backgroundCircle = createPortBackgroundCircle(backgroundCircleOptions);

    var arcOptions = merge(Config.port.arc, { d: (this.props.isIn ? inArc : outArc) })
    // var arc = createPortArc(arcOptions);

    var innerCircleOptions = {
      className: 'port-circle-small fill route' + this.props.route,
      r: r - 1.5
    }

    // Could just convert this to a pure component.
    // it's really just a <circle /> with props nothing more.
    // thus <PortInnerCircle {...innerCircleOptions} />
    // Where PortInnerCircle just return a circle.
    // let's put them within components with the same factory structure.
    // or else within factories without the create prefix.
    // Most merges can be done using ...
    innerCircleOptions = merge(Config.port.innerCircle, innerCircleOptions)
    // var innerCircle = createPortInnerCircle(innerCircleOptions);

    var labelTextOptions = {
      x: (this.props.isIn ? 5 : -5),
      style: style,
      children: this.props.label
    }
    labelTextOptions = merge(Config.port.text, labelTextOptions)
    // var labelText = createPortLabelText(labelTextOptions);

    /*
    var portContents = [
      backgroundCircle,
      arc,
      innerCircle,
      labelText
    ];
    */

    var containerOptions = merge(Config.port.container, { title: this.props.label, transform: 'translate(' + this.props.x + ',' + this.props.y + ')' })
    // return createPortGroup(containerOptions, portContents);

    // can just look like this.
    // should almost work
    return (
      <PortGroup {...containerOptions}>
        <PortBackgroundCircle {...backgroundCircleOptions} />
        <PortArc {...arcOptions} />
        <PortInnerCircle {...innerCircleOptions} />
        <PortLabelText {...labelTextOptions} />
      </PortGroup>
    )
  }
}
