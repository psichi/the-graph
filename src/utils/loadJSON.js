import fromJSON from './fromJSON'

export default function loadJSON(
  definition: Object,
  callback: Function,
  metadata: Object = {}
) {
  const graph = fromJSON(definition, metadata)

  return callback(null, graph)
}
