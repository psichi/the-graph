// TODO
export default function autolayoutChanged() {
  const { graph } = this.props

  if (!graph) {
    return
  }

  // Only listen to changes that affect layout
  if (this.autolayout) {
    this.addGraphListeners(graph)
  } else {
    this.removeGraphListeners(graph)
  }
}
