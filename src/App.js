import React, { Component, PropTypes } from 'react'

import { provision } from './provision'

import {
  addGraphListeners,
  applyAutolayout,
  autolayoutChanged,
  changeTooltip,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
  componentWillMount,
  edgeStart,
  focusNode,
  getContext,
  getContextModal,
  hideContext,
  hideTooltip,
  keyDown,
  keyUp,
  onPanScale,
  onShowContext,
  onTrack,
  onTrackEnd,
  onTrackStart,
  onTransform,
  onTransformEnd,
  onTransformStart,
  onWheel,
  removeGraphListeners,
  render,
  renderCanvas,
  renderGraph,
  scheduleWheelZoom,
  showContext,
  triggerAutolayout,
  triggerFit,
  unselectAll
} from './App/'

class TheGraphApp extends Component {
  mixins = [React.Animate]
  zoomFactor = 0
  zoomX = 0
  zoomY = 0
  lastScale = 1
  lastX = 0
  lastY = 0
  pinching = false

  static defaultProps = {
    snap: 36,
    theme: 'the-graph-dark',
    klayjs: 'klayjs/klay.js'
  }

  static propTypes = {
    graph: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    offsetY: PropTypes.number,
    offsetX: PropTypes.number,
    theme: PropTypes.string,
    snap: PropTypes.number,
    klayjs: PropTypes.string,
    library: PropTypes.object,
    menus: PropTypes.object,
    editable: PropTypes.bool,
    onEdgeSelection: PropTypes.func,
    onNodeSelection: PropTypes.func,
    onPanScale: PropTypes.func,
    getMenuDef: PropTypes.func,
    displaySelectionGroup: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    const { width, height, minZoom, maxZoom, offsetY, offsetX } = this.props

    this.state = {
      x: 0,
      y: 0,
      scale: 1,
      width,
      height,
      minZoom,
      maxZoom,
      offsetY,
      offsetX,
      tooltip: '',
      tooltipX: 0,
      tooltipY: 0,
      tooltipVisible: false,
      contextElement: null,
      contextType: null
    }

    this.onTrack = this.onTrack.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.onTrackStart = this.onTrackStart.bind(this)
    this.onWheel = this.onWheel.bind(this)
    this.changeTooltip = this.changeTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.edgeStart = this.edgeStart.bind(this)
    this.onShowContext = this.onShowContext.bind(this)
    this.unselectAll = this.unselectAll.bind(this)
    this.showContext = this.showContext.bind(this)
    this.scheduleWheelZoom = this.scheduleWheelZoom.bind(this)
    this.triggerAutolayout = this.triggerAutolayout.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)
  }

  componentWillMount = this::componentWillMount
  addGraphListeners = this::addGraphListeners
  removeGraphListeners = this::removeGraphListeners
  autolayoutChanged = this::autolayoutChanged
  triggerAutolayout = this::triggerAutolayout
  applyAutolayout = this::applyAutolayout
  onWheel = this::onWheel
  scheduleWheelZoom = this::scheduleWheelZoom
  onTransformStart = this::onTransformStart
  onTransform = this::onTransform
  onTransformEnd = this::onTransformEnd
  onTrackStart = this::onTrackStart
  onTrack = this::onTrack
  onTrackEnd = this::onTrackEnd
  onPanScale = this::onPanScale
  showContext = this::showContext
  hideContext = this::hideContext
  changeTooltip = this::changeTooltip
  hideTooltip = this::hideTooltip
  triggerFit = this::triggerFit
  focusNode = this::focusNode
  edgeStart = this::edgeStart
  componentDidMount = this::componentDidMount
  componentWillUnmount = this::componentWillUnmount
  onShowContext = this::onShowContext
  keyDown = this::keyDown
  keyUp = this::keyUp
  unselectAll = this::unselectAll
  renderGraph = this::renderGraph
  componentDidUpdate = this::componentDidUpdate
  renderCanvas = this::renderCanvas
  getContext = this::getContext
  getContextModal = this::getContextModal
  render = this::render
}

export default provision(TheGraphApp)
