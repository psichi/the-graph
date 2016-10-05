import React from 'react'
import {
  NodePort
} from '../factories/node'
import {
  positionPort
} from '../utils/'
import type { PortHash } from '../types'

// Ports
export default function createPortViews(type: string, ports: PortHash) {
  const {
    scale,
    graph,
    highlightPort,
    node,
    nodeID,
    showContext,
    height,
    width,
    onEdgeStart,
    onEdgeDraw,
    onEdgeDrop
  } = this.props

  const isExport = (this.props.export !== undefined)

  const keys = Object.keys(ports)

  return keys.map((key, index) => {
    const info = positionPort(ports[key], keys.length, index, {
      x: type === 'in' ? 0 : width,
      height
    })

    const props = {
      scale,
      graph,
      node,
      key: `${nodeID}.${type}.${info.label}`,
      label: info.label,
      processKey: nodeID,
      isIn: type === 'in',
      isExport,
      x: info.x,
      y: info.y,
      port: {
        process: nodeID,
        port: info.label,
        type: info.type
      },
      highlightPort,
      route: info.route,
      showContext,
      onEdgeStart: onEdgeStart,
      onEdgeDraw: onEdgeDraw,
      onEdgeDrop: onEdgeDrop
    }

    return <NodePort {...props} />
  })
}
