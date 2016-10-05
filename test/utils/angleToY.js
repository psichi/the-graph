import test from 'ava'
import { angleToY } from '../../src/utils'

test((t) => {
  const percent = 0.75
  const radius = 23

  const result = angleToY(percent, radius)

  t.is(result, -23)
})
