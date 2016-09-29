import { findDOMNode } from 'react-dom'

export default function componentDidMount() {
  const domNode = findDOMNode(this)

  // Preview edge start
  // addEventListener('tap', this.edgeStart)
  /*
   addEventListener('trackstart', this.edgeStart)
   // Make edge
   addEventListener('trackend', this.triggerDropOnTarget)
   */

  // listens for drop on this port.


  // No need for dispatch
  domNode.addEventListener('the-graph-edge-drop', this.edgeStart)

  // Show context menu
  if (this.props.showContext) {
    domNode.addEventListener('contextmenu', this.showContext)
    domNode.addEventListener('hold', this.showContext)
  }
}
