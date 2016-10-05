import test from 'ava'
import { buildLabelRectOptions } from '../../src/utils'

test.skip('builds options', (t) => {
  const height = 300
  const x = 2
  const y = 1
  const len = 15
  const className = 'heh'
  const options = buildLabelRectOptions(
    height,
    x,
    y,
    len,
    className
  )

  t.deepEqual(options, {
    className: 'heh',
    height: 330,
    width: 3000,
    rx: 150,
    ry: 150,
    x: -1498,
    y:-149
  })
})
