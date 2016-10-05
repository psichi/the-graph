import test from 'ava'
import { findNodeFit } from '../../src/utils'

test('finds point', (t) => {
  const result = findNodeFit(
    4,
    4,
    40,
    30,
    30
  )

  t.deepEqual(result, {
    x: 9,
    y: 9,
    scale: 0.25
  })
})
