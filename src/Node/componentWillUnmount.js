import { findDOMNode } from 'react-dom'
import { keys } from '../utils'

export default function componentWillUnmount() {
  const { onNodeSelection, showContext } = this.props
  const domNode = findDOMNode(this)

  // Dragging
  // domNode.removeEventListener('trackstart', this.onTrackStart)

  // Tap to select
  /*
   if (onNodeSelection) {
   domNode.removeEventListener('tap', this.onNodeSelection)
   }
   */
  keys.unsubscribe('keydown', this.keyDown)
  keys.unsubscribe('keyup', this.keyUp)

  // Context menu
  if (showContext) {
    domNode.removeEventListener('contextmenu', this.showContext)
    domNode.removeEventListener('hold', this.showContext)
  }
}
