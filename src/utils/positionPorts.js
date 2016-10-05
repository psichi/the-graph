import positionPort from './positionPort'
import type { Port, PortDimensions } from '../types'

export default function positionPorts (
  ports: Port[],
  dimensions: PortDimensions
) {
  const positioned = {}
  let i
  let len
  let port

  for (i = 0, len = ports.length; i < len; i++) {
    port = ports[i]

    if (!port.name) { continue }

    positioned[port.name] = positionPort(port, len, i, dimensions)
  }

  return positioned
}

