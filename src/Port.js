import React, { Component, PropTypes } from 'react'
import { Tooltip } from './mixins'
import { provision } from './provision'

import {
  componentDidMount,
  componentWillUnmount,
  edgeStart,
  edgeDraw,
  getContext,
  getTooltipTrigger,
  render,
  shouldShowTooltip,
  showContext,
  triggerDropOnTarget
} from './Port/index'

// Port view
class TheGraphPort extends Component {
  mixins = [
    Tooltip
  ]

  static defaultProps = {
    label: '',
    scale: 1,
    x: 0,
    y: 0
  }

  static propTypes = {
    scale: PropTypes.number,
    label: PropTypes.string.isRequired,
    isIn: PropTypes.bool,
    port: PropTypes.shape({
      process: PropTypes.string,
      port: PropTypes.string,
      type: PropTypes.string
    }).isRequired,
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
    this.edgeDraw = this.edgeDraw.bind(this)
    this.triggerDropOnTarget = this.triggerDropOnTarget.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount = this::componentDidMount
  componentWillUnmount = this::componentWillUnmount
  getTooltipTrigger = this::getTooltipTrigger
  shouldShowTooltip = this::shouldShowTooltip
  showContext = this::showContext
  getContext = this::getContext
  edgeStart = this::edgeStart
  edgeDraw = this::edgeDraw
  triggerDropOnTarget = this::triggerDropOnTarget
  render = this::render
}

export default provision(TheGraphPort)
