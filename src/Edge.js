import React, { Component, PropTypes } from 'react'
import { Tooltip } from './mixins'
import Config from './Config'
import { provision } from './provision'

import {
  componentDidMount,
  componentWillUnmount,
  dontPan,
  getContext,
  getTooltipTrigger,
  onEdgeSelection,
  render,
  shouldComponentUpdate,
  shouldShowTooltip,
  showContext
} from './Edge/index'

// Edge view
class TheGraphEdge extends Component {
  mixins = [
    Tooltip
  ]

  static defaultProps = {
    curve: Config.edge.curve
  }

  static propTypes = {
    onEdgeSelection: PropTypes.func,
    showContext: PropTypes.func,
    app: PropTypes.object,
    edgeID: PropTypes.string,
    edge: PropTypes.object,
    export: PropTypes.bool,
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
    animated: PropTypes.bool,
    curve: PropTypes.number
  }

  constructor(props, context) {
    super(props, context)

    this.dontPan = this.dontPan.bind(this)
    this.onEdgeSelection = this.onEdgeSelection.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount = this::componentDidMount
  componentWillUnmount = this::componentWillUnmount
  dontPan = this::dontPan
  onEdgeSelection = this::onEdgeSelection
  showContext = this::showContext
  getContext = this::getContext
  shouldComponentUpdate = this::shouldComponentUpdate
  getTooltipTrigger = this::getTooltipTrigger
  shouldShowTooltip = this::shouldShowTooltip
  render = this::render
}

export default provision(TheGraphEdge)
