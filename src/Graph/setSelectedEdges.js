export default function setSelectedEdges(selectedEdges) {
  this.setState({
    selectedEdges
  })
  this.markDirty()
}
