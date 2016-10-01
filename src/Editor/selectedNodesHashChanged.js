export default function selectedNodesHashChanged() {
  if (!this.refs.appView.refs.graph) { return }

  this.refs.appView.refs.graph.setSelectedNodes(this.selectedNodesHash)
}
