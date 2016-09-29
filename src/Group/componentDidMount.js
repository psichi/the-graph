import { findDOMNode } from 'react-dom'

export default function componentDidMount() {
  const { box: boxRef, label: labelRef } = this.refs
  const { isSelectionGroup, showContext } = this.props

  // Move group
  if (isSelectionGroup) {
    // Drag selection by bg
    findDOMNode(boxRef).addEventListener('trackstart', this.onTrackStart)
  } else {
    findDOMNode(labelRef).addEventListener('trackstart', this.onTrackStart)
  }

  const domNode = findDOMNode(this)

  // Don't pan under menu
  domNode.addEventListener('trackstart', this.dontPan)

  // Context menu
  if (showContext) {
    domNode.addEventListener('contextmenu', this.showContext)
    domNode.addEventListener('hold', this.showContext)
  }
}
