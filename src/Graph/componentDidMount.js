import { findDOMNode } from 'react-dom'

export default function componentDidMount() {
  const { graph } = this.props

  // To change port colors
  graph.on('addEdge', this.resetPortRoute)
  graph.on('changeEdge', this.resetPortRoute)
  graph.on('removeEdge', this.resetPortRoute)
  graph.on('removeInitial', this.resetPortRoute)

  // Listen to noflo graph object's events
  graph.on('changeNode', this.markDirty)
  graph.on('changeInport', this.markDirty)
  graph.on('changeOutport', this.markDirty)
  graph.on('endTransaction', this.markDirty)

  // not sure where removeNode should come from, probably was always undefined.
  // findDOMNode(this).addEventListener('the-graph-node-remove', this.removeNode);
}

