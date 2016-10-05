export default function updateIcon(nodeId: string, icon: string) {
  if (!this.refs.appView.refs.graph) { return }

  this.refs.appView.refs.graph.updateIcon(nodeId, icon)
}
