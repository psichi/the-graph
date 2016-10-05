import test from 'ava'
import { findLinePoint } from '../../src/utils'

test('finds point', (t) => {
  const result = findLinePoint(2, 4, 0, 5, 4)

  t.deepEqual(result, [6, 5])
})
