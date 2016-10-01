export default function errorNodesChanged() {
  if (!this.refs.appView.refs.graph) { return }

  this.refs.appView.refs.graph.setErrorNodes(this.errorNodes)
}
