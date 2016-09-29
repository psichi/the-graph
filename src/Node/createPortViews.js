import React from 'react'
import {
  NodePort
} from '../factories/node'

// Ports
export default function createPortViews(type, ports) {
  const {
    app,
    graph,
    highlightPort,
    node,
    nodeID,
    showContext
  } = this.props

  const isExport = (this.props.export !== undefined)

  const keys = Object.keys(ports)

  return keys.map((key) => {
    const info = ports[key]

    const props = {
      scale: app.state.scale,
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
      showContext
    }

    return <NodePort {...props} />
  })
}
