export default function setErrorNodes(errorNodes) {
  this.setState({
    errorNodes
  })
  this.markDirty()
}
