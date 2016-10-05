import test from 'ava'
import { positionPorts } from '../../src/utils'

test('positions ports', (t) => {
  const ports = [
    {name: 'IN1', type: 'all'},
    {name: 'IN2', type: 'all'}
  ]

  const dimensions = {
    x: 3,
    height: 9
  }

  const result = positionPorts(ports, dimensions)

  t.deepEqual(result, {
    IN1: {
      label: 'IN1',
      type: 'all',
      x: 3,
      y: 3
    },
    IN2: {
      label: 'IN2',
      type:'all',
      x: 3,
      y: 6
    }
  })
})
