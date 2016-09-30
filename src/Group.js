import React, { Component, PropTypes } from 'react'
import { provision } from './provision'

import {
  componentDidMount,
  componentWillUnmount,
  dontPan,
  getContext,
  onTrack,
  onTrackEnd,
  onTrackStart,
  render,
  showContext
} from './Group/index'

// Group view
class TheGraphGroup extends Component {
  static propTypes = {
    app: PropTypes.shape({
      menuShown: PropTypes.bool
    }),
    label: PropTypes.string,
    graph: PropTypes.object,
    item: PropTypes.object,
    color: PropTypes.number,
    description: PropTypes.string,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number,
    isSelectionGroup: PropTypes.bool,
    showContext: PropTypes.func,
    triggerMoveGroup: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context)

    this.onTrack = this.onTrack.bind(this)
    this.onTrackStart = this.onTrackStart.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.dontPan = this.dontPan.bind(this)
    this.showContext = this.showContext.bind(this)
  }

  componentDidMount = this::componentDidMount
  componentWillUnmount = this::componentWillUnmount
  showContext = this::showContext
  getContext = this::getContext
  dontPan = this::dontPan
  onTrackStart = this::onTrackStart
  onTrack = this::onTrack
  onTrackEnd = this::onTrackEnd
  render = this::render
}

export default provision(TheGraphGroup)
