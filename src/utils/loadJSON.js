import fromJSON from './fromJSON'

export default function loadJSON (definition, callback, metadata) {
  const graph = fromJSON(definition, metadata)

  return callback(null, graph)
}
