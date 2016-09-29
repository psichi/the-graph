import { findDOMNode } from 'react-dom'

export default function componentWillUnmount() {
  const domNode = findDOMNode(this)

  // domNode.removeEventListener('trackstart', this.dontPan)

  if (this.props.showContext) {
    domNode.removeEventListener('contextmenu', this.showContext)
    domNode.removeEventListener('hold', this.showContext)
  }
}
