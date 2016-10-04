import { findDOMNode } from 'react-dom'
import { keys } from '../utils'

export default function componentWillUnmount() {
  let hammertime
  const { onNodeSelection, graph } = this.props

  this.autolayouter.destroy()

  const domNode = findDOMNode(this)

  this.removeGraphListeners(graph)

  // Unselect edges and nodes
  if (onNodeSelection) {
    domNode.removeEventListener('tap', this.unselectAll)
  }

  if (Hammer) {
    hammertime = new Hammer(domNode, {})
    hammertime.get('pinch').set({ enable: false })

    const isTouchDevice = 'ontouchstart' in document.documentElement

    if (isTouchDevice && hammertime) {
      hammertime.off('pinchstart', this.onTransformStart)
      hammertime.off('pinch', this.onTransform)
      hammertime.off('pinchend', this.onTransformEnd)
    }
  }

  // Pointer gesture event for pan
  domNode.removeEventListener('trackstart', this.onTrackStart)

  // Wheel to zoom
  /*
  if (domNode.onwheel !== undefined) {
    // Chrome and Firefox
    domNode.removeEventListener('wheel', this.onWheel)
  } else if (domNode.onmousewheel !== undefined) {
    // Safari
    domNode.removeEventListener('mousewheel', this.onWheel)
  }
  */

  // Tooltip listener
  domNode.removeEventListener('the-graph-tooltip', this.changeTooltip)
  domNode.removeEventListener('the-graph-tooltip-hide', this.hideTooltip)

  // Edge preview
  domNode.removeEventListener('the-graph-edge-start', this.edgeStart)

  domNode.removeEventListener('contextmenu', this.onShowContext)

  /*
  document.removeEventListener('keydown', this.keyDown)
  document.removeEventListener('keyup', this.keyUp)
  */

  keys.unsubscribe('keydown', this.keyDown)
  keys.unsubscribe('keyup', this.keyUp)
}
