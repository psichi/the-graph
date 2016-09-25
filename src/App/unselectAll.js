export default function unselectAll(/* event */) {
  // No arguments = clear selection
  this.props.onNodeSelection()
  this.props.onEdgeSelection()
}
