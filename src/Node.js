import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { buildLabelRectOptions, keys } from './utils'
import Config from './Config'
import { Tooltip } from './mixins'

import {
  componentDidMount,
  componentWillUnmount,
  createIconContent,
  createInportViews,
  createOutportViews,
  createPortViews,
  getContext,
  getTooltipTrigger,
  keyDown,
  keyUp,
  onNodeSelection,
  onTrack,
  onTrackEnd,
  onTrackStart,
  render,
  shouldComponentUpdate,
  shouldShowTooltip,
  showContext
} from './Node/index'

// Node view
export default class TheGraphNode extends Component {
  mixins = [
    Tooltip
  ]

  metaKeyPressed: false

  static defaultProps = {
    scale: 1
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    graph: PropTypes.object.isRequired,
    export: PropTypes.object,
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
    error: PropTypes.bool,
    scale: PropTypes.number,

    menuShown: PropTypes.bool,
    pinching: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    this.onTrackStart = this.onTrackStart.bind(this)
    this.onNodeSelection = this.onNodeSelection.bind(this)
    this.showContext = this.showContext.bind(this)
    this.onTrack = this.onTrack.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)
  }

  componentDidMount = this::componentDidMount
  componentWillUnmount = this::componentWillUnmount
  keyDown = this::keyDown
  keyUp = this::keyUp
  onNodeSelection = this::onNodeSelection
  onTrackStart = this::onTrackStart
  onTrack = this::onTrack
  onTrackEnd = this::onTrackEnd
  showContext = this::showContext
  getContext = this::getContext
  getTooltipTrigger = this::getTooltipTrigger
  shouldShowTooltip = this::shouldShowTooltip
  shouldComponentUpdate = this::shouldComponentUpdate
  createPortViews = this::createPortViews
  createInportViews = this::createInportViews
  createOutportViews = this::createOutportViews
  createIconContent = this::createIconContent
  render = this::render
}
