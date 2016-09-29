import React from 'react'
import Config from '../Config'
// import Hammer from 'react-hammerjs'
import Track from '../Track'
import {
  PortArc,
  PortBackgroundCircle,
  PortGroup,
  PortInnerCircle,
  PortLabelText
} from '../factories/port'
import { arcs } from '../utils'

export default function render() {
  let style

  const { label, highlightPort, isIn, port, route, x, y } = this.props

  if (label.length > 7) {
    const fontSize = 6 * (30 / (4 * label.length))
    style = {
      fontSize: `${fontSize}px`
    }
  }

  let r
  let inArc
  let outArc

  // Highlight matching ports
  r = 4
  inArc = arcs.inport
  outArc = arcs.outport

  if (highlightPort && highlightPort.isIn === isIn && (highlightPort.type === port.type || port.type === 'any')) {
    r = 6
    inArc = arcs.inportBig
    outArc = arcs.outportBig
  }

  const backgroundCircleOptions = {
    ...Config.port.backgroundCircle,
    r: r + 1
  }

  const arcOptions = {
    ...Config.port.arc,
    d: (isIn ? inArc : outArc)
  }

  const innerCircleOptions = {
    ...Config.port.innerCircle,
    className: `port-circle-small fill route${route}`,
    r: r - 1.5
  }

  const labelTextOptions = {
    ...Config.port.text,
    x: (isIn ? 5 : -5),
    style
  }

  const containerOptions = {
    ...Config.port.container,
    title: label,
    transform: `translate(${x},${y})`
  }

  // problem track and hammer give different event types.
  // <Hammer onTap={this.edgeStart}>
  // </Hammer>
  return (
    <Track
      onTrackStart={this.edgeStart}
      onTrackEnd={this.triggerDropOnTarget}
    >
      <PortGroup {...containerOptions}>
        <PortBackgroundCircle {...backgroundCircleOptions} />
        <PortArc {...arcOptions} />
        <PortInnerCircle {...innerCircleOptions} />
        <PortLabelText {...labelTextOptions}>
          {label}
        </PortLabelText>
      </PortGroup>
    </Track>
  )
}
