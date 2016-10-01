export default function displaySelectionGroupChanged() {
  if (!this.refs.appView.refs.graph) { return }
  this.refs.appView.refs.graph.setState({
    displaySelectionGroup: this.displaySelectionGroup
  })
}
