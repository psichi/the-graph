import test from 'ava'
import { findPointOnCubicBezier } from '../../src/utils'

test('finds point', (t) => {
  const result = findPointOnCubicBezier(
    1,2,3,4,5,6,7,8,9
  )

  t.deepEqual(result, [2, 3])
})
