export default function invokeEdgeSelection(itemKey, item, toggle) {
  const { onEdgeSelection } = this.props

  if (itemKey === undefined) {
    if (this.selectedEdges.length > 0) {
      this.selectedEdges = []
    }
    this.fire('edges', this.selectedEdges)
    return
  }
  if (toggle) {
    const index = this.selectedEdges.indexOf(item)
    const isSelected = (index !== -1)
    const shallowClone = this.selectedEdges.slice()
    if (isSelected) {
      shallowClone.splice(index, 1)
      this.selectedEdges = shallowClone
    } else {
      shallowClone.push(item)
      this.selectedEdges = shallowClone
    }
  } else {
    this.selectedEdges = [item]
  }

  if (onEdgeSelection) {
    onEdgeSelection(this.selectedEdges)
  }

  this.fire('edges', this.selectedEdges);
}
