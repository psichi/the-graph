import test from 'ava'
import { findAreaFit } from '../../src/utils'

test('finds area fit', (t) => {
  const nodeSize = 100
  const point1 = {
    x: 0,
    y: 0
  }
  const point2 = {
    x: 3,
    y: 3
  }
  const width = 200
  const height = 200
  const result = findAreaFit(
    nodeSize,
    point1,
    point2,
    width,
    height
  )

  t.deepEqual(result, {
    x: 66.006600660066,
    y: 66.006600660066,
    scale: 0.6600660066006601
  })
})
