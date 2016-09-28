import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import Config from './Config'
import {
  NodeMenuBackgroundRect,
  NodeMenuPortCircle,
  NodeMenuPortGroup,
  NodeMenuPortText
} from './factories/nodeMenuPort'

export default class TheGraphNodeMenuPort extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    processKey: PropTypes.string,
    port: PropTypes.string,
    highlightPort: PropTypes.shape({
      type: PropTypes.string,
      isIn: PropTypes.bool
    }),
    isIn: PropTypes.bool,
    route: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }

  constructor(props, context) {
    super(props, context)

    this.edgeStart = this.edgeStart.bind(this)
  }

  componentDidMount() {
    const domNode = findDOMNode(this)

    // domNode.addEventListener('up', this.edgeStart)
    domNode.addEventListener('mouseup', this.edgeStart)
  }

  componentWillUnmount() {
    const domNode = findDOMNode(this)

    // domNode.removeEventListener('up', this.edgeStart)
    domNode.removeEventListener('mouseup', this.edgeStart)
  }

  edgeStart(event) {
    // Don't tap graph
    event.stopPropagation()

    const { processKey: process, label, port: { type }, isIn, route } = this.props

    const port = {
      process,
      port: label,
      type
    }

    const domNode = findDOMNode(this)

    const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
      detail: {
        isIn,
        port,
        route
      },
      bubbles: true
    })

    domNode.dispatchEvent(edgeStartEvent)
  }

  render() {
    const { isIn, label, port, highlightPort, x, y, route } = this.props
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

    const circleOptions = {
      ...Config.nodeMenuPort.circle,
      className: `context-port-hole stroke route${route}`,
      cx: x,
      cy: y
    }

    const textOptions = {
      ...Config.nodeMenuPort.text,
      className: `context-port-label fill route${route}`,
      x: x + (isIn ? -20 : 20),
      y
    }

    const menuPortText = label.replace(/(.*)\/(.*)(_.*)\.(.*)/, '$2.$4')

    const containerOptions = {
      ...Config.nodeMenuPort.container,
      className: `context-port click context-port-${(isIn ? 'in' : 'out')}`
    }

    return (
      <NodeMenuPortGroup {...containerOptions}>
        <NodeMenuBackgroundRect {...rectOptions} />
        <NodeMenuPortCircle {...circleOptions} />
        <NodeMenuPortText {...textOptions}>
          {menuPortText}
        </NodeMenuPortText>
      </NodeMenuPortGroup>
    )
  }
}
