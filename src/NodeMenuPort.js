import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {
  createNodeMenuBackgroundRect,
  createNodeMenuPortCircle,
  createNodeMenuPortGroup,
  createNodeMenuPortText
} from './factories/nodeMenuPort'

export default class TheGraphNodeMenuPort extends Component {
  constructor (props, context) {
    super(props, context)

    this.edgeStart = this.edgeStart.bind(this)
  }

  componentDidMount () {
    findDOMNode(this).addEventListener('up', this.edgeStart)
  }

  componentWillUnmount () {
    findDOMNode(this).removeEventListener('up', this.edgeStart)
  }

  edgeStart (event) {
    // Don't tap graph
    event.stopPropagation()

    const {processKey: process, label, port: {type}, isIn, route} = this.props

    const port = {
      process,
      port: label,
      type
    }

    const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn,
        port,
        route
      },
      bubbles: true
    })

    findDOMNode(this).dispatchEvent(edgeStartEvent)
  }

  render () {
    const {isIn, label, port, highlightPort, x, y, route} = this.props
    const labelLen = label.length
    const bgWidth = (labelLen > 12 ? labelLen * 8 + 40 : 120)
    // Highlight compatible port
    const highlight = (highlightPort && highlightPort.isIn === isIn && highlightPort.type === port.type)

    const rectOptions = {
      ...Config.nodeMenuPort.backgroundRect,
      className: `context-port-bg${(highlight ? ' highlight' : '')}`,
      x: x + (isIn ? -bgWidth : 0),
      y: y - Config.base.contextPortSize / 2,
      width: bgWidth
    }

    const rect = createNodeMenuBackgroundRect(rectOptions)

    const circleOptions = {
      ...Config.nodeMenuPort.circle,
      className: `context-port-hole stroke route${route}`,
      cx: x,
      cy: y
    }

    const circle = createNodeMenuPortCircle(circleOptions)

    const textOptions = {
      ...Config.nodeMenuPort.text,
      className: `context-port-label fill route${route}`,
      x: x + (isIn ? -20 : 20),
      y: y,
      children: label.replace(/(.*)\/(.*)(_.*)\.(.*)/, '$2.$4')
    }

    const text = createNodeMenuPortText(textOptions)

    const containerContents = [rect, circle, text]

    const containerOptions = {
      ...Config.nodeMenuPort.container,
      className: `context-port click context-port-${(isIn ? 'in' : 'out')}`
    }

    return createNodeMenuPortGroup(containerOptions, containerContents)
  }
}
