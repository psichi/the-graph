import Graph from '../graph/noflo'
import clone from './cloneObject'

export default function fromJSON(definition: Object, metadata: ?Object) {
  let caseSensitive
  let conn
  let def
  let _definition
  let exported
  let graph
  let group
  let i
  let id
  let j
  let k
  let len
  let len1
  let len2
  let _metadata
  let portId
  let priv
  let processId
  let properties
  let property
  let pub
  let ref
  let ref1
  let ref2
  let ref3
  let ref4
  let ref5
  let ref6
  let split
  let value

  if (metadata == null) {
    _metadata = {}
  } else {
    _definition = clone(metadata)
  }
  if (typeof definition === 'string') {
    _definition = JSON.parse(definition)
  } else {
    _definition = clone(definition)
  }
  if (!_definition.properties) {
    _definition.properties = {}
  }
  if (!_definition.processes) {
    _definition.processes = {}
  }
  if (!_definition.connections) {
    _definition.connections = []
  }
  caseSensitive = _definition.caseSensitive || false
  graph = new Graph(_definition.properties.name, {
    caseSensitive
  })
  graph.startTransaction('loadJSON', metadata)
  properties = {}
  ref = _definition.properties
  for (property in ref) {
    value = ref[property]
    if (property === 'name') {
      continue
    }
    properties[property] = value
  }

  graph.setProperties(properties)
  ref1 = _definition.processes
  for (id in ref1) {
    def = ref1[id]
    if (!def.metadata) {
      def.metadata = {}
    }

    graph.addNode(id, def.component, def.metadata)
  }
  ref2 = _definition.connections

  for (i = 0, len = ref2.length; i < len; i++) {
    conn = ref2[i]
    metadata = conn.metadata ? conn.metadata : {}
    if (conn.data !== void 0) {
      if (typeof conn.tgt.index === 'number') {
        graph.addInitialIndex(conn.data, conn.tgt.process, graph.getPortName(conn.tgt.port), conn.tgt.index, metadata)
      } else {
        graph.addInitial(conn.data, conn.tgt.process, graph.getPortName(conn.tgt.port), metadata)
      }
      continue
    }
    if (typeof conn.src.index === 'number' || typeof conn.tgt.index === 'number') {
      graph.addEdgeIndex(conn.src.process, graph.getPortName(conn.src.port), conn.src.index, conn.tgt.process, graph.getPortName(conn.tgt.port), conn.tgt.index, metadata)
      continue
    }
    graph.addEdge(conn.src.process, graph.getPortName(conn.src.port), conn.tgt.process, graph.getPortName(conn.tgt.port), metadata)
  }

  if (_definition.exports && _definition.exports.length) {
    ref3 = _definition.exports
    for (j = 0, len1 = ref3.length; j < len1; j++) {
      exported = ref3[j]
      if (exported.private) {
        split = exported.private.split('.')
        if (split.length !== 2) {
          continue
        }
        processId = split[0]
        portId = split[1]
        for (id in _definition.processes) {
          if (graph.getPortName(id) === graph.getPortName(processId)) {
            processId = id
          }
        }
      } else {
        processId = exported.process
        portId = graph.getPortName(exported.port)
      }
      graph.addExport(exported.public, processId, portId, exported.metadata)
    }
  }

  if (_definition.inports) {
    ref4 = _definition.inports
    for (pub in ref4) {
      priv = ref4[pub]
      graph.addInport(pub, priv.process, graph.getPortName(priv.port), priv.metadata)
    }
  }

  if (_definition.outports) {
    ref5 = _definition.outports
    for (pub in ref5) {
      priv = ref5[pub]
      graph.addOutport(pub, priv.process, graph.getPortName(priv.port), priv.metadata)
    }
  }

  if (_definition.groups) {
    ref6 = _definition.groups
    for (k = 0, len2 = ref6.length; k < len2; k++) {
      group = ref6[k]
      graph.addGroup(group.name, group.nodes, group.metadata || {})
    }
  }

  graph.endTransaction('loadJSON')

  return graph
}
