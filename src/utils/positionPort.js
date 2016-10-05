import type { PortDimensions, Port } from '../types'

export default function positionPort (
  port: Port,
  total: number,
  index: number,
  dimensions: PortDimensions
): Object {
  return {
    label: port.name || port.label, // normalize this
    type: port.type,
    x: dimensions.x,
    y: dimensions.height / (total + 1) * (index + 1)
  }
}
