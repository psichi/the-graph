import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {
  findLinePoint,
  perpendicular,
  findPointOnCubicBezier,
} from './utils'
import {Tooltip} from './mixins'
import Menu from './Menu'
import Config from './Config'
import {
  EdgePathArray,
  EdgeBackgroundPath,
  EdgeForegroundPath,
  EdgeTouchPath,
  Arrow,
  EdgeGroup
} from './factories/edge'

// Const
const CURVE = Config.edge.curve

// Edge view
export default class TheGraphEdge extends Component {
  mixins = [
    Tooltip
  ]

  static propTypes = {
    onEdgeSelection: PropTypes.func,
    showContext: PropTypes.func,
    app: PropTypes.object,
    edgeID: PropTypes.string,
    edge: PropTypes.object,
    'export': PropTypes.bool,
    isIn: PropTypes.bool,
    graph: PropTypes.object,
    exportKey: PropTypes.string,
    label: PropTypes.string,
    route: PropTypes.number,
    sX: PropTypes.number,
    sY: PropTypes.number,
    tX: PropTypes.number,
    tY: PropTypes.number,
    selected: PropTypes.bool,
    animated: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)

    this.dontPan = this.dontPan.bind(this)
    this.onEdgeSelection = this.onEdgeSelection.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount () {
    const domNode = findDOMNode(this)

    // Dragging
    domNode.addEventListener('trackstart', this.dontPan)

    if (this.props.onEdgeSelection) {
      // Needs to be click (not tap) to get event.shiftKey
      domNode.addEventListener('tap', this.onEdgeSelection)
    }

    // Context menu
    if (this.props.showContext) {
      domNode.addEventListener('contextmenu', this.showContext)
      domNode.addEventListener('hold', this.showContext)
    }
  }

  dontPan (event) {
    // Don't drag under menu
    if (this.props.app.menuShown) {
      event.stopPropagation()
    }
  }

  onEdgeSelection (event) {
    // Don't click app
    event.stopPropagation()

    const {edgeID, edge, onEdgeSelection} = this.props

    const toggle = (TheGraph.metaKeyPressed || event.pointerType === 'touch')

    onEdgeSelection(edgeID, edge, toggle)
  }

  showContext (event) {
    // Don't show native context menu
    event.preventDefault()

    // Don't tap graph on hold event
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    const {isIn, exportKey, edge, graph, showContext} = this.props
    const _export = this.props.export

    // Get mouse position
    var x = event.x || event.clientX || 0
    var y = event.y || event.clientY || 0

    // App.showContext
    showContext({
      element: this,
      type: (_export ? (isIn ? 'graphInport' : 'graphOutport') : 'edge'),
      x: x,
      y: y,
      graph,
      itemKey: (_export ? exportKey : null),
      item: (_export ? _export : edge)
    })
  }

  getContext (menu, options, hide) {
    const menuOptions = {
      menu: menu,
      options: options,
      triggerHideContext: hide,
      label: this.props.label,
      iconColor: this.props.route
    }

    return <Menu {...menuOptions} />
  }

  shouldComponentUpdate (nextProps /* , nextState */) {
    // Only re-render if changed
    return (
      nextProps.sX !== this.props.sX ||
      nextProps.sY !== this.props.sY ||
      nextProps.tX !== this.props.tX ||
      nextProps.tY !== this.props.tY ||
      nextProps.selected !== this.props.selected ||
      nextProps.animated !== this.props.animated ||
      nextProps.route !== this.props.route
    )
  }

  getTooltipTrigger () {
    return findDOMNode(this.refs.touch)
  }

  shouldShowTooltip () {
    return true
  }

  render () {
    const {sX: sourceX, sY: sourceY, tX: targetX, tY: targetY, route, selected, animated, label} = this.props

    // Organic / curved edge
    let c1X, c1Y, c2X, c2Y

    if (targetX - 5 < sourceX) {
      const curveFactor = (sourceX - targetX) * CURVE / 200
      if (Math.abs(targetY - sourceY) < Config.base.nodeSize / 2) {
        // Loopback
        c1X = sourceX + curveFactor
        c1Y = sourceY - curveFactor
        c2X = targetX - curveFactor
        c2Y = targetY - curveFactor
      } else {
        // Stick out some
        c1X = sourceX + curveFactor
        c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor)
        c2X = targetX - curveFactor
        c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor)
      }
    } else {
      // Controls halfway between
      c1X = sourceX + (targetX - sourceX) / 2
      c1Y = sourceY
      c2X = c1X
      c2Y = targetY
    }

    // Make SVG path

    const path = EdgePathArray(sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY).join(' ')

    const backgroundPathOptions = {
      ...Config.edge.backgroundPath,
      d: path
    }

    const foregroundPathClassName = Config.edge.foregroundPath.className + route

    const foregroundPathOptions = {
      ...Config.edge.foregroundPath,
      d: path,
      className: foregroundPathClassName
    }

    const touchPathOptions = {
      ...Config.edge.touchPath,
      d: path
    }

    const containerOptions = {
      ...Config.edge.container,
      className: 'edge' +
      (selected ? ' selected' : '') +
      (animated ? ' animated' : ''),
      title: label
    }

    var epsilon = 0.01
    var center = findPointOnCubicBezier(0.5, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY)

    // estimate slope and intercept of tangent line
    const getShiftedPoint = (epsilon) => {
      return findPointOnCubicBezier(0.5 + epsilon, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY)
    }

    const plus = getShiftedPoint(epsilon)
    const minus = getShiftedPoint(-epsilon)

    const m = 1 * (plus[1] - minus[1]) / (plus[0] - minus[0])
    const b = center[1] - (m * center[0])

    let arrowLength

    arrowLength = 12

    // Which direction should arrow point
    if (plus[0] > minus[0]) {
      arrowLength *= -1
    }

    center = findLinePoint(center[0], center[1], m, b, -1 * arrowLength / 2)

    let pointsArray = perpendicular(center[0], center[1], m, arrowLength * 0.9)

    // For m === 0, figure out if arrow should be straight up or down
    const flip = plus[1] > minus[1] ? -1 : 1
    const arrowTip = findLinePoint(center[0], center[1], m, b, arrowLength, flip)

    pointsArray.push(arrowTip)

    const points = pointsArray.map((point) => point.join(',')).join(' ')

    const arrowBgOptions = {
      points,
      className: 'arrow-bg'
    }

    const arrowOptions = {
      points,
      className: 'arrow fill route' + route
    }

    return (
      <EdgeGroup {...containerOptions}>
        <EdgeBackgroundPath {...backgroundPathOptions} />
        <Arrow {...arrowBgOptions} />
        <EdgeForegroundPath {...foregroundPathOptions} />
        <EdgeTouchPath {...touchPathOptions} />
        <Arrow {...arrowOptions} />
      </EdgeGroup>
    )
  }
}
