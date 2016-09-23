import EventEmitter from 'events'
import clone from 'lodash.clone'

const cleanID = (id) => {
  return id.replace(/\s*/g, '')
}
const cleanPort = (port) => {
  return port.replace(/\./g, '')
}

export default class Graph extends EventEmitter {
  name = '';
  caseSensitive = false;
  properties = {};
  nodes = [];
  edges = [];
  initializers = [];
  exports = [];
  inports = {};
  outports = {};
  groups = [];

  constructor(name = '', options = {}) {
    super()

    this.name = name
    this.properties = {}
    this.nodes = []
    this.edges = []
    this.initializers = []
    this.exports = []
    this.inports = {}
    this.outports = {}
    this.groups = []
    this.transaction = {
      id: null,
      depth: 0
    }
    this.caseSensitive = options.caseSensitive || false
  }

  getPortName(port) {
    if (this.caseSensitive) {
      return port
    }

    return port.toLowerCase()
  }

  startTransaction(id, metadata) {
    if (this.transaction.id) {
      throw Error('Nested transactions not supported')
    }
    this.transaction.id = id
    this.transaction.depth = 1

    return this.emit('startTransaction', id, metadata)
  }

  endTransaction(id, metadata) {
    if (!this.transaction.id) {
      throw Error('Attempted to end non-existing transaction')
    }
    this.transaction.id = null
    this.transaction.depth = 0
    return this.emit('endTransaction', id, metadata)
  }

  checkTransactionStart() {
    if (!this.transaction.id) {
      return this.startTransaction('implicit')
    } else if (this.transaction.id === 'implicit') {
      return this.transaction.depth += 1
    }
  }

  checkTransactionEnd() {
    if (this.transaction.id === 'implicit') {
      this.transaction.depth -= 1
    }
    if (this.transaction.depth === 0) {
      return this.endTransaction('implicit')
    }
  }

  setProperties(properties) {
    let before
    let item
    let val

    this.checkTransactionStart()

    before = clone(this.properties)

    for (item in properties) {
      val = properties[item]
      this.properties[item] = val
    }

    this.emit('changeProperties', this.properties, before)

    return this.checkTransactionEnd()
  }

  addExport(publicPort, nodeKey, portKey, metadata) {
    let exported
    if (metadata == null) {
      metadata = {
        x: 0,
        y: 0
      }
    }
    platform.deprecated('noflo.Graph exports is deprecated: please use specific inport or outport instead')
    if (!this.getNode(nodeKey)) {
      return
    }
    this.checkTransactionStart()
    exported = {
      'public': this.getPortName(publicPort),
      process: nodeKey,
      port: this.getPortName(portKey),
      metadata
    }
    this.exports.push(exported)
    this.emit('addExport', exported)
    return this.checkTransactionEnd()
  }

  removeExport(publicPort) {
    let exported
    let found
    let i
    let idx
    let len
    let ref

    platform.deprecated('noflo.Graph exports is deprecated: please use specific inport or outport instead')
    publicPort = this.getPortName(publicPort)
    found = null
    ref = this.exports
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      exported = ref[idx]
      if (exported.public === publicPort) {
        found = exported
      }
    }
    if (!found) {
      return
    }
    this.checkTransactionStart()
    this.exports.splice(this.exports.indexOf(found), 1)
    this.emit('removeExport', found)
    return this.checkTransactionEnd()
  }

  addInport(publicPort, nodeKey, portKey, metadata) {
    if (!this.getNode(nodeKey)) {
      return
    }
    publicPort = this.getPortName(publicPort)
    this.checkTransactionStart()
    this.inports[publicPort] = {
      process: nodeKey,
      port: this.getPortName(portKey),
      metadata
    }
    this.emit('addInport', publicPort, this.inports[publicPort])
    return this.checkTransactionEnd()
  }

  removeInport(publicPort) {
    let port
    publicPort = this.getPortName(publicPort)
    if (!this.inports[publicPort]) {
      return
    }
    this.checkTransactionStart()
    port = this.inports[publicPort]
    this.setInportMetadata(publicPort, {})
    delete this.inports[publicPort]
    this.emit('removeInport', publicPort, port)
    return this.checkTransactionEnd()
  }

  renameInport(oldPort, newPort) {
    oldPort = this.getPortName(oldPort)
    newPort = this.getPortName(newPort)
    if (!this.inports[oldPort]) {
      return
    }
    this.checkTransactionStart()
    this.inports[newPort] = this.inports[oldPort]
    delete this.inports[oldPort]
    this.emit('renameInport', oldPort, newPort)
    return this.checkTransactionEnd()
  }

  setInportMetadata(publicPort, metadata) {
    let before, item, val
    publicPort = this.getPortName(publicPort)
    if (!this.inports[publicPort]) {
      return
    }
    this.checkTransactionStart()
    before = clone(this.inports[publicPort].metadata)
    if (!this.inports[publicPort].metadata) {
      this.inports[publicPort].metadata = {}
    }
    for (item in metadata) {
      val = metadata[item]
      if (val != null) {
        this.inports[publicPort].metadata[item] = val
      } else {
        delete this.inports[publicPort].metadata[item]
      }
    }
    this.emit('changeInport', publicPort, this.inports[publicPort], before)
    return this.checkTransactionEnd()
  }

  addOutport(publicPort, nodeKey, portKey, metadata) {
    if (!this.getNode(nodeKey)) {
      return
    }
    publicPort = this.getPortName(publicPort)
    this.checkTransactionStart()
    this.outports[publicPort] = {
      process: nodeKey,
      port: this.getPortName(portKey),
      metadata
    }
    this.emit('addOutport', publicPort, this.outports[publicPort])
    return this.checkTransactionEnd()
  }

  removeOutport(publicPort) {
    let port
    publicPort = this.getPortName(publicPort)
    if (!this.outports[publicPort]) {
      return
    }
    this.checkTransactionStart()
    port = this.outports[publicPort]
    this.setOutportMetadata(publicPort, {})
    delete this.outports[publicPort]
    this.emit('removeOutport', publicPort, port)
    return this.checkTransactionEnd()
  }

  renameOutport(oldPort, newPort) {
    oldPort = this.getPortName(oldPort)
    newPort = this.getPortName(newPort)
    if (!this.outports[oldPort]) {
      return
    }
    this.checkTransactionStart()
    this.outports[newPort] = this.outports[oldPort]
    delete this.outports[oldPort]
    this.emit('renameOutport', oldPort, newPort)
    return this.checkTransactionEnd()
  }

  setOutportMetadata(publicPort, metadata) {
    let before, item, val
    publicPort = this.getPortName(publicPort)
    if (!this.outports[publicPort]) {
      return
    }
    this.checkTransactionStart()
    before = clone(this.outports[publicPort].metadata)
    if (!this.outports[publicPort].metadata) {
      this.outports[publicPort].metadata = {}
    }
    for (item in metadata) {
      val = metadata[item]
      if (val != null) {
        this.outports[publicPort].metadata[item] = val
      } else {
        delete this.outports[publicPort].metadata[item]
      }
    }
    this.emit('changeOutport', publicPort, this.outports[publicPort], before)
    return this.checkTransactionEnd()
  }

  addGroup(group, nodes, metadata) {
    let g
    this.checkTransactionStart()
    g = {
      name: group,
      nodes,
      metadata
    }
    this.groups.push(g)
    this.emit('addGroup', g)
    return this.checkTransactionEnd()
  }

  renameGroup(oldName, newName) {
    let group, i, len, ref
    this.checkTransactionStart()
    ref = this.groups
    for (i = 0, len = ref.length; i < len; i++) {
      group = ref[i]
      if (!group) {
        continue
      }
      if (group.name !== oldName) {
        continue
      }
      group.name = newName
      this.emit('renameGroup', oldName, newName)
    }
    return this.checkTransactionEnd()
  }

  removeGroup(groupName) {
    let group, i, len, ref
    this.checkTransactionStart()
    ref = this.groups
    for (i = 0, len = ref.length; i < len; i++) {
      group = ref[i]
      if (!group) {
        continue
      }
      if (group.name !== groupName) {
        continue
      }
      this.setGroupMetadata(group.name, {})
      this.groups.splice(this.groups.indexOf(group), 1)
      this.emit('removeGroup', group)
    }
    return this.checkTransactionEnd()
  }

  setGroupMetadata(groupName, metadata) {
    let before, group, i, item, len, ref, val
    this.checkTransactionStart()
    ref = this.groups
    for (i = 0, len = ref.length; i < len; i++) {
      group = ref[i]
      if (!group) {
        continue
      }
      if (group.name !== groupName) {
        continue
      }
      before = clone(group.metadata)
      for (item in metadata) {
        val = metadata[item]
        if (val != null) {
          group.metadata[item] = val
        } else {
          delete group.metadata[item]
        }
      }
      this.emit('changeGroup', group, before)
    }
    return this.checkTransactionEnd()
  }

  addNode(id, component, metadata) {
    let node
    this.checkTransactionStart()
    if (!metadata) {
      metadata = {}
    }
    node = {
      id,
      component,
      metadata
    }
    this.nodes.push(node)
    this.emit('addNode', node)
    this.checkTransactionEnd()
    return node
  }

  removeNode(id) {
    let edge
    let exported
    let group
    let i
    let index
    let initializer
    let j
    let k
    let l
    let len
    let len1
    let len2
    let len3
    let len4
    let len5
    let len6
    let len7
    let len8
    let m
    let n
    let node
    let o
    let p
    let priv
    let pub
    let q
    let ref
    let ref1
    let ref2
    let ref3
    let ref4
    let ref5
    let toRemove
    node = this.getNode(id)
    if (!node) {
      return
    }
    this.checkTransactionStart()
    toRemove = []
    ref = this.edges
    for (i = 0, len = ref.length; i < len; i++) {
      edge = ref[i]
      if ((edge.from.node === node.id) || (edge.to.node === node.id)) {
        toRemove.push(edge)
      }
    }
    for (j = 0, len1 = toRemove.length; j < len1; j++) {
      edge = toRemove[j]
      this.removeEdge(edge.from.node, edge.from.port, edge.to.node, edge.to.port)
    }
    toRemove = []
    ref1 = this.initializers
    for (k = 0, len2 = ref1.length; k < len2; k++) {
      initializer = ref1[k]
      if (initializer.to.node === node.id) {
        toRemove.push(initializer)
      }
    }
    for (l = 0, len3 = toRemove.length; l < len3; l++) {
      initializer = toRemove[l]
      this.removeInitial(initializer.to.node, initializer.to.port)
    }
    toRemove = []
    ref2 = this.exports
    for (m = 0, len4 = ref2.length; m < len4; m++) {
      exported = ref2[m]
      if (this.getPortName(id) === exported.process) {
        toRemove.push(exported)
      }
    }
    for (n = 0, len5 = toRemove.length; n < len5; n++) {
      exported = toRemove[n]
      this.removeExport(exported.public)
    }
    toRemove = []
    ref3 = this.inports
    for (pub in ref3) {
      priv = ref3[pub]
      if (priv.process === id) {
        toRemove.push(pub)
      }
    }
    for (o = 0, len6 = toRemove.length; o < len6; o++) {
      pub = toRemove[o]
      this.removeInport(pub)
    }
    toRemove = []
    ref4 = this.outports
    for (pub in ref4) {
      priv = ref4[pub]
      if (priv.process === id) {
        toRemove.push(pub)
      }
    }
    for (p = 0, len7 = toRemove.length; p < len7; p++) {
      pub = toRemove[p]
      this.removeOutport(pub)
    }
    ref5 = this.groups
    for (q = 0, len8 = ref5.length; q < len8; q++) {
      group = ref5[q]
      if (!group) {
        continue
      }
      index = group.nodes.indexOf(id)
      if (index === -1) {
        continue
      }
      group.nodes.splice(index, 1)
    }
    this.setNodeMetadata(id, {})
    if (-1 !== this.nodes.indexOf(node)) {
      this.nodes.splice(this.nodes.indexOf(node), 1)
    }
    this.emit('removeNode', node)
    return this.checkTransactionEnd()
  }

  getNode(id) {
    let i
    let len
    let node
    let ref

    ref = this.nodes
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i]
      if (!node) {
        continue
      }
      if (node.id === id) {
        return node
      }
    }
    return null
  }

  renameNode(oldId, newId) {
    let edge
    let exported
    let group
    let i
    let iip
    let index
    let j
    let k
    let l
    let len
    let len1
    let len2
    let len3
    let node
    let priv
    let pub
    let ref
    let ref1
    let ref2
    let ref3
    let ref4
    let ref5
    this.checkTransactionStart()
    node = this.getNode(oldId)
    if (!node) {
      return
    }
    node.id = newId
    ref = this.edges
    for (i = 0, len = ref.length; i < len; i++) {
      edge = ref[i]
      if (!edge) {
        continue
      }
      if (edge.from.node === oldId) {
        edge.from.node = newId
      }
      if (edge.to.node === oldId) {
        edge.to.node = newId
      }
    }
    ref1 = this.initializers
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      iip = ref1[j]
      if (!iip) {
        continue
      }
      if (iip.to.node === oldId) {
        iip.to.node = newId
      }
    }
    ref2 = this.inports
    for (pub in ref2) {
      priv = ref2[pub]
      if (priv.process === oldId) {
        priv.process = newId
      }
    }
    ref3 = this.outports
    for (pub in ref3) {
      priv = ref3[pub]
      if (priv.process === oldId) {
        priv.process = newId
      }
    }
    ref4 = this.exports
    for (k = 0, len2 = ref4.length; k < len2; k++) {
      exported = ref4[k]
      if (exported.process === oldId) {
        exported.process = newId
      }
    }
    ref5 = this.groups
    for (l = 0, len3 = ref5.length; l < len3; l++) {
      group = ref5[l]
      if (!group) {
        continue
      }
      index = group.nodes.indexOf(oldId)
      if (index === -1) {
        continue
      }
      group.nodes[index] = newId
    }
    this.emit('renameNode', oldId, newId)
    return this.checkTransactionEnd()
  }

  setNodeMetadata(id, metadata) {
    let before
    let item
    let node
    let val

    node = this.getNode(id)
    if (!node) {
      return
    }
    this.checkTransactionStart()
    before = clone(node.metadata)
    if (!node.metadata) {
      node.metadata = {}
    }
    for (item in metadata) {
      val = metadata[item]
      if (val != null) {
        node.metadata[item] = val
      } else {
        delete node.metadata[item]
      }
    }
    this.emit('changeNode', node, before)
    return this.checkTransactionEnd()
  }

  addEdge(outNode, outPort, inNode, inPort, metadata) {
    let edge
    let i
    let len
    let ref

    if (metadata == null) {
      metadata = {}
    }
    outPort = this.getPortName(outPort)
    inPort = this.getPortName(inPort)
    ref = this.edges
    for (i = 0, len = ref.length; i < len; i++) {
      edge = ref[i]
      if (edge.from.node === outNode && edge.from.port === outPort && edge.to.node === inNode && edge.to.port === inPort) {
        return
      }
    }
    if (!this.getNode(outNode)) {
      return
    }
    if (!this.getNode(inNode)) {
      return
    }
    this.checkTransactionStart()
    edge = {
      from: {
        node: outNode,
        port: outPort
      },
      to: {
        node: inNode,
        port: inPort
      },
      metadata
    }
    this.edges.push(edge)
    this.emit('addEdge', edge)
    this.checkTransactionEnd()
    return edge
  }

  addEdgeIndex(outNode, outPort, outIndex, inNode, inPort, inIndex, metadata) {
    let edge

    if (metadata == null) {
      metadata = {}
    }
    if (!this.getNode(outNode)) {
      return
    }
    if (!this.getNode(inNode)) {
      return
    }
    outPort = this.getPortName(outPort)
    inPort = this.getPortName(inPort)
    if (inIndex === null) {
      inIndex = void 0
    }
    if (outIndex === null) {
      outIndex = void 0
    }
    if (!metadata) {
      metadata = {}
    }
    this.checkTransactionStart()
    edge = {
      from: {
        node: outNode,
        port: outPort,
        index: outIndex
      },
      to: {
        node: inNode,
        port: inPort,
        index: inIndex
      },
      metadata
    }
    this.edges.push(edge)
    this.emit('addEdge', edge)
    this.checkTransactionEnd()
    return edge
  }

  removeEdge(node, port, node2, port2) {
    let edge
    let i
    let index
    let j
    let k
    let len
    let len1
    let len2
    let ref
    let ref1
    let toKeep
    let toRemove

    this.checkTransactionStart()
    port = this.getPortName(port)
    port2 = this.getPortName(port2)
    toRemove = []
    toKeep = []
    if (node2 && port2) {
      ref = this.edges
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        edge = ref[index]
        if (edge.from.node === node && edge.from.port === port && edge.to.node === node2 && edge.to.port === port2) {
          this.setEdgeMetadata(edge.from.node, edge.from.port, edge.to.node, edge.to.port, {})
          toRemove.push(edge)
        } else {
          toKeep.push(edge)
        }
      }
    } else {
      ref1 = this.edges
      for (index = j = 0, len1 = ref1.length; j < len1; index = ++j) {
        edge = ref1[index]
        if ((edge.from.node === node && edge.from.port === port) || (edge.to.node === node && edge.to.port === port)) {
          this.setEdgeMetadata(edge.from.node, edge.from.port, edge.to.node, edge.to.port, {})
          toRemove.push(edge)
        } else {
          toKeep.push(edge)
        }
      }
    }
    this.edges = toKeep
    for (k = 0, len2 = toRemove.length; k < len2; k++) {
      edge = toRemove[k]
      this.emit('removeEdge', edge)
    }
    return this.checkTransactionEnd()
  }

  getEdge(node, port, node2, port2) {
    let edge
    let i
    let index
    let len
    let ref

    port = this.getPortName(port)
    port2 = this.getPortName(port2)
    ref = this.edges
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      edge = ref[index]
      if (!edge) {
        continue
      }
      if (edge.from.node === node && edge.from.port === port) {
        if (edge.to.node === node2 && edge.to.port === port2) {
          return edge
        }
      }
    }
    return null
  }

  setEdgeMetadata(node, port, node2, port2, metadata) {
    let before
    let edge
    let item
    let val

    edge = this.getEdge(node, port, node2, port2)
    if (!edge) {
      return
    }
    this.checkTransactionStart()
    before = clone(edge.metadata)
    if (!edge.metadata) {
      edge.metadata = {}
    }
    for (item in metadata) {
      val = metadata[item]
      if (val != null) {
        edge.metadata[item] = val
      } else {
        delete edge.metadata[item]
      }
    }
    this.emit('changeEdge', edge, before)
    return this.checkTransactionEnd()
  }

  addInitial(data, node, port, metadata) {
    let initializer

    if (!this.getNode(node)) {
      return
    }
    port = this.getPortName(port)
    this.checkTransactionStart()
    initializer = {
      from: {
        data
      },
      to: {
        node,
        port
      },
      metadata
    }
    this.initializers.push(initializer)
    this.emit('addInitial', initializer)
    this.checkTransactionEnd()
    return initializer
  }

  addInitialIndex(data, node, port, index, metadata) {
    let initializer

    if (!this.getNode(node)) {
      return
    }
    if (index === null) {
      index = void 0
    }
    port = this.getPortName(port)
    this.checkTransactionStart()
    initializer = {
      from: {
        data
      },
      to: {
        node,
        port,
        index
      },
      metadata
    }
    this.initializers.push(initializer)
    this.emit('addInitial', initializer)
    this.checkTransactionEnd()
    return initializer
  }

  addGraphInitial(data, node, metadata) {
    let inport
    inport = this.inports[node]
    if (!inport) {
      return
    }
    return this.addInitial(data, inport.process, inport.port, metadata)
  }

  addGraphInitialIndex(data, node, index, metadata) {
    let inport
    inport = this.inports[node]
    if (!inport) {
      return
    }
    return this.addInitialIndex(data, inport.process, inport.port, index, metadata)
  }

  removeInitial(node, port) {
    let edge
    let i
    let index
    let j
    let len
    let len1
    let ref
    let toKeep
    let toRemove

    port = this.getPortName(port)
    this.checkTransactionStart()
    toRemove = []
    toKeep = []
    ref = this.initializers
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      edge = ref[index]
      if (edge.to.node === node && edge.to.port === port) {
        toRemove.push(edge)
      } else {
        toKeep.push(edge)
      }
    }
    this.initializers = toKeep
    for (j = 0, len1 = toRemove.length; j < len1; j++) {
      edge = toRemove[j]
      this.emit('removeInitial', edge)
    }
    return this.checkTransactionEnd()
  }

  removeGraphInitial(node) {
    let inport
    inport = this.inports[node]
    if (!inport) {
      return
    }
    return this.removeInitial(inport.process, inport.port)
  }

  toDOT() {
    let cleanID
    let cleanPort
    let data
    let dot
    let edge
    let i
    let id
    let initializer
    let j
    let k
    let len
    let len1
    let len2
    let node
    let ref
    let ref1
    let ref2
    dot = 'digraph {\n'
    ref = this.nodes
    for (i = 0, len = ref.length; i < len; i++) {
      node = ref[i]
      dot += '    ' + (cleanID(node.id)) + ' [label=' + node.id + ' shape=box]\n'
    }
    ref1 = this.initializers
    for (id = j = 0, len1 = ref1.length; j < len1; id = ++j) {
      initializer = ref1[id]
      if (typeof initializer.from.data === 'function') {
        data = 'Function'
      } else {
        data = initializer.from.data
      }
      dot += '    data' + id + " [label=\"'" + data + "'\" shape=plaintext]\n"
      dot += '    data' + id + ' -> ' + (cleanID(initializer.to.node)) + '[headlabel=' + (cleanPort(initializer.to.port)) + ' labelfontcolor=blue labelfontsize=8.0]\n'
    }
    ref2 = this.edges
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      edge = ref2[k]
      dot += '    ' + (cleanID(edge.from.node)) + ' -> ' + (cleanID(edge.to.node)) + '[taillabel=' + (cleanPort(edge.from.port)) + ' headlabel=' + (cleanPort(edge.to.port)) + ' labelfontcolor=blue labelfontsize=8.0]\n'
    }
    dot += '}'
    return dot
  }

  toYUML() {
    let edge
    let i
    let initializer
    let j
    let len
    let len1
    let ref
    let ref1
    let yuml

    yuml = []
    ref = this.initializers
    for (i = 0, len = ref.length; i < len; i++) {
      initializer = ref[i]
      yuml.push('(start)[' + initializer.to.port + ']->(' + initializer.to.node + ')')
    }
    ref1 = this.edges
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      edge = ref1[j]
      yuml.push('(' + edge.from.node + ')[' + edge.from.port + ']->(' + edge.to.node + ')')
    }
    return yuml.join(',')
  }

  toJSON() {
    let connection
    let edge
    let exported
    let group
    let groupData
    let i
    let initializer
    let j
    let json
    let k
    let l
    let len
    let len1
    let len2
    let len3
    let len4
    let m
    let node
    let priv
    let property
    let pub
    let ref
    let ref1
    let ref2
    let ref3
    let ref4
    let ref5
    let ref6
    let ref7
    let value
    json = {
      caseSensitive: this.caseSensitive,
      properties: {},
      inports: {},
      outports: {},
      groups: [],
      processes: {},
      connections: []
    }
    if (this.name) {
      json.properties.name = this.name
    }
    ref = this.properties
    for (property in ref) {
      value = ref[property]
      json.properties[property] = value
    }
    ref1 = this.inports
    for (pub in ref1) {
      priv = ref1[pub]
      json.inports[pub] = priv
    }
    ref2 = this.outports
    for (pub in ref2) {
      priv = ref2[pub]
      json.outports[pub] = priv
    }
    ref3 = this.exports
    for (i = 0, len = ref3.length; i < len; i++) {
      exported = ref3[i]
      if (!json.exports) {
        json.exports = []
      }
      json.exports.push(exported)
    }
    ref4 = this.groups
    for (j = 0, len1 = ref4.length; j < len1; j++) {
      group = ref4[j]
      groupData = {
        name: group.name,
        nodes: group.nodes
      }
      if (Object.keys(group.metadata).length) {
        groupData.metadata = group.metadata
      }
      json.groups.push(groupData)
    }
    ref5 = this.nodes
    for (k = 0, len2 = ref5.length; k < len2; k++) {
      node = ref5[k]
      json.processes[node.id] = {
        component: node.component
      }
      if (node.metadata) {
        json.processes[node.id].metadata = node.metadata
      }
    }
    ref6 = this.edges
    for (l = 0, len3 = ref6.length; l < len3; l++) {
      edge = ref6[l]
      connection = {
        src: {
          process: edge.from.node,
          port: edge.from.port,
          index: edge.from.index
        },
        tgt: {
          process: edge.to.node,
          port: edge.to.port,
          index: edge.to.index
        }
      }
      if (Object.keys(edge.metadata).length) {
        connection.metadata = edge.metadata
      }
      json.connections.push(connection)
    }
    ref7 = this.initializers
    for (m = 0, len4 = ref7.length; m < len4; m++) {
      initializer = ref7[m]
      json.connections.push({
        data: initializer.from.data,
        tgt: {
          process: initializer.to.node,
          port: initializer.to.port,
          index: initializer.to.index
        }
      })
    }
    return json
  }

  static create(name, options) {
    return new Graph(name, options)
  }
}

