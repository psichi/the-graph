import test from 'ava'
import { getElementOffset } from '../../src/utils'

test('defaults to 0', (t) => {
  const offset = getElementOffset()

  t.deepEqual(offset, {
    left: 0,
    top: 0
  })
})

test('determines offset', (t) => {
  const offset = getElementOffset({
    offsetTop: 5,
    offsetLeft: 5
  })

  t.deepEqual(offset, {
    left: 5,
    top: 5
  })
})

test('offset from parent', (t) => {
  const offset = getElementOffset({
    offsetTop: 5,
    offsetLeft: 5,
    offsetParent: {
      offsetTop: 15,
      offsetLeft: 15
    }
  })

  t.deepEqual(offset, {
    left: 20,
    top: 20
  })
})
