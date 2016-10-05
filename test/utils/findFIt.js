import test from 'ava'
import { findFit } from '../../src/utils'

test.skip('finds min/max', (t) => {
  const graph = {}
  const nodeSize = 100
  const width = 100
  const height = 100
  const result = findFit(graph, nodeSize, width, height)

  t.deepEqual(result, {})
})
