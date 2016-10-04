import { positionPort } from '../utils'

export default function calcPositions (props) {
  const { height, ports, width } = props

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
