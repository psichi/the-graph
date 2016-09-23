import fbp from 'fbp'
import loadJSON from './loadJSON'

export default function loadFBP(fbpData, callback, metadata = {}, caseSensitive: false) {
  let definition

  try {
    definition = fbp.parse(fbpData, {
      caseSensitive
    })
  } catch (error) {
    return callback(error)
  }

  return loadJSON(definition, callback, metadata)
}
