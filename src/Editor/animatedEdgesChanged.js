export default function animatedEdgesChanged() {
  if (!this.refs.appView.refs.graph) { return }

  this.refs.appView.refs.graph.setAnimatedEdges(this.animatedEdges)
}
