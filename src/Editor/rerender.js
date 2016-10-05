export default function rerender(options: Object) {
  // This is throttled with rAF internally
  if (!this.refs.appView.refs.graph) { return }
  this.refs.appView.refs.graph.markDirty(options)
}
