import test from 'ava'
import { positionPort } from '../../src/utils'

test('positions port', (t) => {
  const port = {name: 'IN1', type: 'all'}

  const dimensions = {
    x: 2,
    height: 10
  }

  const result = positionPort(port, 1, 0, dimensions)

  t.deepEqual(result, {
    label: 'IN1',
    type: 'all',
    x: 2,
    y: 5
  })
})
