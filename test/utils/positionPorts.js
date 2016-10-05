import test from 'ava'
import { positionPorts } from '../../src/utils'

test('positions ports', (t) => {
  const ports = [
    {name: 'IN1', type: 'all'},
    {name: 'IN2', type: 'all'}
  ]

  const dimensions = {
    x: 2,
    height: 10
  }

  const result = positionPorts(ports, dimensions)

  t.deepEqual(result, {})
})
