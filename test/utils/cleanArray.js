import test from 'ava'
import { cleanArray } from '../../src/utils'

test('cleans', (t) => {
  const arr = [
    1,
    null,
    2,
    undefined,
    3,
    null
  ]
  const cleaned = cleanArray(arr)

  t.deepEqual(cleaned, [1,2,3])
})
