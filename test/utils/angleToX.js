import test from 'ava'
import { angleToX } from '../../src/utils'

test((t) => {
  const percent = 0.5
  const radius = 23

  const result = angleToX(percent, radius)

  t.is(result, -23)
})
