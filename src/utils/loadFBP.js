import loadJSON from './loadJSON'
import fbp from 'fbp'

export default function loadFBP (fbpData, callback, metadata = {}, caseSensitive: false) {
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
