import { positionPort } from '../utils'
import type { PortHash } from '../types'

type PortsType = {
  inports: PortHash,
  outports: PortHash
}

export default function calcPositions (
  ports: PortsType,
  width: number,
  height: number
): PortsType {
  const portInfo = {
      inports: {},
      outports: {}
    }

    ;['inports', 'outports'].forEach((type) => {
    const keys = Object.keys(ports[type])

    keys.forEach((key, index) => {
      const info = positionPort(ports[type][key], keys.length, index, {
        x: type === 'inports' ? 0 : width,
        height
      })

      portInfo[type][key] = info
    })
  })

  return portInfo
}
