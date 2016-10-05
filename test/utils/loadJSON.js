import test from 'ava'
import { loadJSON } from '../../src/utils'
import Graph from '../../src/graph/noflo'

test.cb('loads JSON', (t) => {
  loadJSON({

  }, (error, result) => {
    t.true(result instanceof Graph)
    t.end()
  })
})
