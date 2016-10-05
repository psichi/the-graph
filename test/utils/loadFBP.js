import test from 'ava'
import { loadFBP } from '../../src/utils'
import Graph from '../../src/graph/noflo'

test.cb('loads FBP', (t) => {
  const fbp = 'Some(some/process) out -> in Whatever(what/ever)'

  loadFBP(fbp, (error, result) => {
    t.true(result instanceof Graph)
    t.end()
  })
})
