import test from 'ava'
import { findMinMax } from '../../src/utils'

test.skip('finds min/max', (t) => {
  const graph = {}
  const nodes = []
  const result = findMinMax(graph, nodes)

  t.deepEqual(result, {})
})
