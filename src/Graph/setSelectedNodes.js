export default function setSelectedNodes(selectedNodes) {
  this.setState({
    selectedNodes
  })
  this.markDirty()
}
