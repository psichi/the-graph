import { NofloGraph } from '../types'

export default function addGraphListeners(graph: NofloGraph) {
  graph.on('addNode', this.triggerAutolayout)
  graph.on('removeNode', this.triggerAutolayout)
  graph.on('addInport', this.triggerAutolayout)
  graph.on('removeInport', this.triggerAutolayout)
  graph.on('addOutport', this.triggerAutolayout)
  graph.on('removeOutport', this.triggerAutolayout)
  graph.on('addEdge', this.triggerAutolayout)
  graph.on('removeEdge', this.triggerAutolayout)
}
