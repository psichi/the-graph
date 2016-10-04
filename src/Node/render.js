import React from 'react'
import Hammer from 'react-hammerjs'
import Config from '../Config'
import Track from '../Track'
import {
  NodeBorderRect,
  NodeGroup,
  NodeBackgroundRect,
  NodeInnerRect,
  NodeInportsGroup,
  NodeLabelGroup,
  NodeLabelRect,
  NodeLabelText,
  NodeOutportsGroup,
  NodeSublabelGroup,
  NodeSublabelRect,
  NodeSublabelText
} from '../factories/node'
import { buildLabelRectOptions } from '../utils'

export default function render() {
  const { error, label, x, y, height, width, nodeID, selected } = this.props
  let { sublabel } = this.props

  if (this.props.ports.dirty) {
    // This tag is set when an edge or iip changes port colors
    this.props.ports.dirty = false
  }

  if (!sublabel || sublabel === label) {
    sublabel = ''
  }

  const NodeOutportViews = this.createOutportViews()

  const NodeInportViews = this.createInportViews()

  const NodeIconContent = this.createIconContent()

  const backgroundRectOptions = {
    ...Config.node.background,
    width,
    height: height + 25
  }

  const borderRectOptions = {
    ...Config.node.border,
    width,
    height
  }

  const innerRectOptions = {
    ...Config.node.innerRect,
    width: width - 6,
    height: height - 6
  }

  const inportsOptions = {
    ...Config.node.inports
  }

  const outportsOptions = {
    ...Config.node.outports
  }

  const labelTextOptions = {
    ...Config.node.labelText,
    x: width / 2,
    y: height + 15
  }

  let labelRectOptions
  const labelRectX = width / 2
  const labelRectY = height + 15

  labelRectOptions = buildLabelRectOptions(14, labelRectX, labelRectY, label.length, Config.node.labelRect.className)
  labelRectOptions = {
    ...Config.node.labelRect,
    ...labelRectOptions
  }

  const sublabelTextOptions = {
    ...Config.node.sublabelText,
    x: width / 2,
    y: height + 30
  }

  const sublabelRectX = width / 2
  const sublabelRectY = height + 30

  let sublabelRectOptions = buildLabelRectOptions(9, sublabelRectX, sublabelRectY, sublabel.length, Config.node.sublabelRect.className)
  sublabelRectOptions = {
    ...Config.node.sublabelRect,
    ...sublabelRectOptions
  }

  let nodeOptions

  nodeOptions = {
    className: `node drag${(selected ? ' selected' : '')}${(error ? ' error' : '')}`,
    name: nodeID,
    key: nodeID,
    title: label,
    transform: `translate(${x},${y})`
  }

  nodeOptions = {
    ...Config.node.container,
    ...nodeOptions
  }

  const trackOptions = {
    onTrackStart: this.onTrackStart,
    onTrack: this.onTrack,
    onTrackEnd: this.onTrackEnd
  }

  return (
    <Track {...trackOptions}>
      <Hammer onTap={this.onNodeSelection}>
        <NodeGroup {...nodeOptions}>
          <NodeBackgroundRect {...backgroundRectOptions} />
          <NodeBorderRect {...borderRectOptions} />
          <NodeInnerRect {...innerRectOptions} />
          {NodeIconContent}
          <NodeInportsGroup {...inportsOptions}>
            {NodeInportViews}
          </NodeInportsGroup>
          <NodeOutportsGroup {...outportsOptions}>
            {NodeOutportViews}
          </NodeOutportsGroup>
          <NodeLabelGroup {...Config.node.labelBackground}>
            <NodeLabelRect {...labelRectOptions} />
            <NodeLabelText {...labelTextOptions}>
              {label}
            </NodeLabelText>
          </NodeLabelGroup>
          <NodeSublabelGroup {...Config.node.sublabelBackground}>
            <NodeSublabelRect {...sublabelRectOptions} />
            <NodeSublabelText {...sublabelTextOptions}>
              {sublabel}
            </NodeSublabelText>
          </NodeSublabelGroup>
        </NodeGroup>
      </Hammer>
    </Track>
  )
}
