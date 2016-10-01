export default function invokeNodeSelection(itemKey, item, toggle) {
  const { onNodeSelection } = this.props

  if (itemKey === undefined) {
    this.selectedNodes = []
  } else if (toggle) {
    const index = this.selectedNodes.indexOf(item)
    const isSelected = (index !== -1)
    if (isSelected) {
      this.selectedNodes.splice(index, 1)
    } else {
      this.selectedNodes.push(item)
    }
  } else {
    this.selectedNodes = [item]
  }

  this.selectedNodesChanged()

  if (onNodeSelection) {
    onNodeSelection(this.selectedNodes)
  }

  this.fire('nodes', this.selectedNodes);
}
