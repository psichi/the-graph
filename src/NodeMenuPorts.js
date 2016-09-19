import React, {Component, PropTypes} from 'react'
import Config from './Config'
import {
  NodeMenuPortsGroup,
  NodeMenuPortsLinesGroup,
  NodeMenuPortsNodeMenuPort,
  NodeMenuPortsPortPath
} from './factories/nodeMenuPorts'

export default class TheGraphNodeMenuPorts extends Component {
  static propTypes = {
    translateX: PropTypes.number,
    translateY: PropTypes.number,
    highlightPort: PropTypes.bool,
    isIn: PropTypes.bool,
    scale: PropTypes.number,
    processKey: PropTypes.string,
    ports: PropTypes.object.isRequired,
    route: PropTypes.number.isRequired,
    deltaX: PropTypes.number.isRequired,
    deltaY: PropTypes.number.isRequired,
    nodeWidth: PropTypes.number.isRequired,
    nodeHeight: PropTypes.number.isRequired
  }

  render () {
    const portViews = []
    const lines = []

    const {
      translateX,
      translateY,
      highlightPort,
      isIn,
      scale,
      processKey,
      ports,
      route,
      deltaX,
      deltaY,
      nodeWidth,
      nodeHeight
    } = this.props

    const keys = Object.keys(ports)
    const h = keys.length * Config.base.contextPortSize
    const len = keys.length

    // creates both lines and portViews..
    let i
    for (i = 0; i < len; i++) {
      const key = keys[i]
      const port = ports[key]

      const x = (isIn ? -100 : 100)
      const y = 0 - h / 2 + i * Config.base.contextPortSize + Config.base.contextPortSize / 2
      const ox = (port.x - nodeWidth / 2) * scale + deltaX
      const oy = (port.y - nodeHeight / 2) * scale + deltaY

      // Make path from graph port to menu port
      const lineOptions = {
        ...Config.nodeMenuPorts.portPath,
        d: [ 'M', ox, oy, 'L', x, y ].join(' ')
      }

      const line = <NodeMenuPortsPortPath {...lineOptions} />

      const portViewOptions = {
        ...Config.nodeMenuPorts.nodeMenuPort,
        label: key,
        port,
        processKey,
        isIn,
        x,
        y,
        route,
        highlightPort
      }

      const portView = <NodeMenuPortsNodeMenuPort {...portViewOptions} />

      lines.push(line)

      portViews.push(portView)
    }

    let transform

    transform = ''
    if (translateX !== undefined) {
      transform = `translate(${translateX},${translateY})`
    }

    const linesGroupOptions = {
      ...Config.nodeMenuPorts.linesGroup,
      children: lines
    }

    const portsGroupOptions = {
      ...Config.nodeMenuPorts.portsGroup,
      children: portViews
    }

    const containerOptions = {
      ...Config.nodeMenuPorts.container,
      className: `context-ports context-ports-${(isIn ? 'in' : 'out')}`,
      transform
    }

    return (
      <NodeMenuPortsGroup {...containerOptions}>
        <NodeMenuPortsLinesGroup {...linesGroupOptions} />
        <NodeMenuPortsGroup {...portsGroupOptions} />
      </NodeMenuPortsGroup>
    )
  }
}
