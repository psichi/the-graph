import { findDOMNode } from 'react-dom'

export default function componentWillUnmount() {
  const domNode = findDOMNode(this)

  // Preview edge start
  // domNode.removeEventListener('tap', this.edgeStart)
  /*
   domNode.removeEventListener('trackstart', this.edgeStart)
   // Make edge
   domNode.removeEventListener('trackend', this.triggerDropOnTarget)
   */
  // domNode.removeEventListener('the-graph-edge-drop', this.edgeStart)

  // Show context menu
  if (this.props.showContext) {
    domNode.removeEventListener('contextmenu', this.showContext)
    domNode.removeEventListener('hold', this.showContext)
  }
}
