export default function forceSelectionChanged() {
  if (!this.refs.appView.refs.graph) { return }
  this.refs.appView.refs.graph.setState({
    forceSelection: this.forceSelection
  })
}
