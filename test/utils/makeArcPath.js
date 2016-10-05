import test from 'ava'
import { makeArcPath } from '../../src/utils'

test('creates arc path', (t) => {
  const arcPath = makeArcPath(2, 2, 4)

  t.is(arcPath, 'M 4 -1.959434878635765e-15 A 4 4 0 0 0 4 -1.959434878635765e-15')
})
