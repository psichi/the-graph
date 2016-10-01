export default function rerender(options) {
  // This is throttled with rAF internally
  if (!this.refs.appView.refs.graph) { return }
  this.refs.appView.refs.graph.markDirty(options)
}
