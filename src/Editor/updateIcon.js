export default function updateIcon(nodeId, icon) {
  if (!this.refs.appView.refs.graph) { return }
  this.refs.appView.refs.graph.updateIcon(nodeId, icon)
}
