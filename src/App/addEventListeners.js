import Hammer from 'hammerjs'
import { keys } from '../utils'
import { findDOMNode } from 'react-dom'

export default function addEventListeners () {
  const { graph, onNodeSelection } = this.props

  const domNode = findDOMNode(this)

  if (domNode) {
    // Unselect edges and nodes
    if (onNodeSelection) {
      domNode.addEventListener('tap', this.unselectAll)
    }

    // Don't let Hammer.js collide with polymer-gestures
    let hammertime

    if (Hammer) {
      hammertime = new Hammer(domNode, {})
      hammertime.get('pinch').set({enable: true})
    }

    // Pointer gesture event for pan
    // domNode.addEventListener('trackstart', this.onTrackStart)

    const isTouchDevice = 'ontouchstart' in document.documentElement

    if (isTouchDevice && hammertime) {
      hammertime.on('pinchstart', this.onTransformStart)
      hammertime.on('pinch', this.onTransform)
      hammertime.on('pinchend', this.onTransformEnd)
    }

    // Tooltip listener
    domNode.addEventListener('the-graph-tooltip', this.changeTooltip)
    domNode.addEventListener('the-graph-tooltip-hide', this.hideTooltip)

    // Edge preview
    // is a custom event emitted by Port and MenuPort
    domNode.addEventListener('the-graph-edge-start', this.edgeStart)

    domNode.addEventListener('contextmenu', this.onShowContext)
  }

  keys.subscribe('keydown', this.keyDown)
  keys.subscribe('keyup', this.keyUp)
}
