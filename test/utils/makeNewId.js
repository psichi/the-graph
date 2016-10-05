import test from 'ava'
import { makeNewId } from '../../src/utils'

test('is unique', (t) => {
  const id1 = makeNewId('some_label')
  const id2 = makeNewId('some_label')

  t.false(id1 === id2)
})
