export default function setAnimatedEdges(animatedEdges) {
  this.setState({
    animatedEdges
  })
  this.markDirty()
}
