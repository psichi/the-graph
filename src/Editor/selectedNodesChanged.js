export default function selectedNodesChanged() {
  const selectedNodesHash = {}
  for (let i = 0, len = this.selectedNodes.length; i < len; i++) {
    selectedNodesHash[this.selectedNodes[i].id] = true
  }
  this.selectedNodesHash = selectedNodesHash

  this.selectedNodesHashChanged()

  this.fire('nodes', this.selectedNodes);
}
