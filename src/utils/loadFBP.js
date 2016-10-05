import fbp from 'fbp'
import loadJSON from './loadJSON'

export default function loadFBP(
  fbpData: string,
  callback: Function,
  metadata: Object = {},
  caseSensitive: boolean = false
) {
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
