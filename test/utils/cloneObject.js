import test from 'ava'
import { cloneObject } from '../../src/utils'

test('clones', (t) => {
  const obj = {a: 1}
  const clone = cloneObject(obj)

  t.false(obj === clone)
  t.deepEqual(obj, clone)
})
