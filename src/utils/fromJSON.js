import Graph from '../graph/noflo'

export default function fromJSON (definition, metadata) {
  var caseSensitive, conn, def, exported, graph, group, i, id, j, k, len, len1, len2, portId, priv, processId, properties, property, pub, ref, ref1, ref2, ref3, ref4, ref5, ref6, split, value
  if (metadata == null) {
    metadata = {}
  }
  if (typeof definition === 'string') {
    definition = JSON.parse(definition)
  }
  if (!definition.properties) {
    definition.properties = {}
  }
  if (!definition.processes) {
    definition.processes = {}
  }
  if (!definition.connections) {
    definition.connections = []
  }
  caseSensitive = definition.caseSensitive || false
  graph = new Graph(definition.properties.name, {
    caseSensitive: caseSensitive
  })
  graph.startTransaction('loadJSON', metadata)
  properties = {}
  ref = definition.properties
  for (property in ref) {
    value = ref[property]
    if (property === 'name') {
      continue
    }
    properties[property] = value
  }

  console.log('DEFINITION', definition.processes.basic.metadata);

  graph.setProperties(properties)
  ref1 = definition.processes
  for (id in ref1) {
    def = ref1[id]
    if (!def.metadata) {
      def.metadata = {}
    }

    console.log('ADD NODE ', def)
    graph.addNode(id, def.component, def.metadata)
  }
  ref2 = definition.connections
  console.log('DEFINITION 2', definition.processes.basic.metadata)
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
  console.log('DEFINITION 3', definition.processes.basic.metadata)
  if (definition.exports && definition.exports.length) {
    ref3 = definition.exports
    for (j = 0, len1 = ref3.length; j < len1; j++) {
      exported = ref3[j]
      if (exported['private']) {
        split = exported['private'].split('.')
        if (split.length !== 2) {
          continue
        }
        processId = split[0]
        portId = split[1]
        for (id in definition.processes) {
          if (graph.getPortName(id) === graph.getPortName(processId)) {
            processId = id
          }
        }
      } else {
        processId = exported.process
        portId = graph.getPortName(exported.port)
      }
      graph.addExport(exported['public'], processId, portId, exported.metadata)
    }
  }
  console.log('DEFINITION 4', definition.processes.basic.metadata)
  if (definition.inports) {
    ref4 = definition.inports
    for (pub in ref4) {
      priv = ref4[pub]
      graph.addInport(pub, priv.process, graph.getPortName(priv.port), priv.metadata)
    }
  }
  if (definition.outports) {
    ref5 = definition.outports
    for (pub in ref5) {
      priv = ref5[pub]
      graph.addOutport(pub, priv.process, graph.getPortName(priv.port), priv.metadata)
    }
  }
  if (definition.groups) {
    ref6 = definition.groups
    for (k = 0, len2 = ref6.length; k < len2; k++) {
      group = ref6[k]
      graph.addGroup(group.name, group.nodes, group.metadata || {})
    }
  }
  console.log('DEFINITION 5', definition.processes.basic.metadata)
  graph.endTransaction('loadJSON')

  console.log('DEFINITION 6', definition.processes.basic.metadata);
  console.log('FROM JSON', definition, metadata, graph)

  return graph
}
