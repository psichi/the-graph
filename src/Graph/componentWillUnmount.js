export default function componentWillUnmount() {
  const { graph } = this.props

  graph.removeListener('addEdge', this.resetPortRoute)
  graph.removeListener('changeEdge', this.resetPortRoute)
  graph.removeListener('removeEdge', this.resetPortRoute)
  graph.removeListener('removeInitial', this.resetPortRoute)

  graph.removeListener('changeNode', this.markDirty)
  graph.removeListener('changeInport', this.markDirty)
  graph.removeListener('changeOutport', this.markDirty)
  graph.removeListener('endTransaction', this.markDirty)
}

