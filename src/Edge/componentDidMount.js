import { findDOMNode } from 'react-dom'

export default function componentDidMount() {
  const domNode = findDOMNode(this)

  // Dragging
  // domNode.addEventListener('trackstart', this.dontPan)

  // Context menu
  if (this.props.showContext) {
    domNode.addEventListener('contextmenu', this.showContext)
    domNode.addEventListener('hold', this.showContext)
  }
}
