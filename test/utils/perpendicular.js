import test from 'ava'
import { perpendicular } from '../../src/utils'

test('perpendiculars', (t) => {
  const result = perpendicular(2, 3, 1, 0)

  t.deepEqual(result, [
    [2,3],
    [2,3]
  ])
})
