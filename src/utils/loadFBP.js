import loadJSON from './loadJSON'
import fbp from 'fbp'

export default function loadFBP (fbpData, callback, metadata, caseSensitive) {
  var definition, e, error
  if (metadata == null) {
    metadata = {}
  }
  if (caseSensitive == null) {
    caseSensitive = false
  }
  try {
    definition = fbp.parse(fbpData, {
      caseSensitive: caseSensitive
    })
  } catch (error) {
    e = error
    return callback(e)
  }
  return loadJSON(definition, callback, metadata)
}
