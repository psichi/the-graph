import { findDOMNode } from 'react-dom'

export default function componentWillUnmount() {
  const { showContext, isSelectionGroup } = this.props
  const { box: boxRef, label: labelRef } = this.refs

  if (isSelectionGroup) {
    findDOMNode(boxRef).removeEventListener('trackstart', this.onTrackStart)
  } else {
    findDOMNode(labelRef).removeEventListener('trackstart', this.onTrackStart)
  }

  const domNode = findDOMNode(this)

  domNode.removeEventListener('trackstart', this.dontPan)

  if (showContext) {
    domNode.removeEventListener('contextmenu', this.showContext)
    domNode.removeEventListener('hold', this.showContext)
  }
}
