import { findDOMNode } from 'react-dom'
import { keys } from '../utils'

export default function componentDidMount() {
  const { onNodeSelection, showContext } = this.props
  const domNode = findDOMNode(this)

  // Dragging
  // domNode.addEventListener('trackstart', this.onTrackStart)

  // Tap to select
  /*
   if (onNodeSelection) {
   domNode.addEventListener('tap', this.onNodeSelection, true)
   }
   */

  keys.subscribe('keydown', this.keyDown)
  keys.subscribe('keyup', this.keyUp)

  // Context menu
  if (showContext) {
    domNode.addEventListener('contextmenu', this.showContext)
    domNode.addEventListener('hold', this.showContext)
  }
}
