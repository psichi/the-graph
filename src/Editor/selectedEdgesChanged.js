export default function selectedEdgesChanged() {
  if (!this.refs.appView.refs.graph) { return }

  this.refs.appView.refs.graph.setSelectedEdges(this.selectedEdges)

  this.fire('edges', this.selectedEdges)
}
