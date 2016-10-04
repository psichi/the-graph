import Hammer from 'hammerjs'
import Config from '../Config'
import { findDOMNode } from 'react-dom'
import { findFit, keys } from '../utils'

export default function componentDidMount() {
  const { graph, width, height, onNodeSelection } = this.props

  // Autofit (not sure whether this is the correct location to do it
  /*
  let { x, y, scale } = findFit(graph, Config.base.nodeSize, width, height)

  this.setState({
    x,
    y,
    scale
  })
  */

  const domNode = findDOMNode(this)

  // Unselect edges and nodes
  if (onNodeSelection) {
    domNode.addEventListener('tap', this.unselectAll)
  }

  // Don't let Hammer.js collide with polymer-gestures
  let hammertime

  if (Hammer) {
    hammertime = new Hammer(domNode, {})
    hammertime.get('pinch').set({ enable: true })
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

  // Start zoom from middle if zoom before mouse move
  this.mouseX = Math.floor(width / 2)
  this.mouseY = Math.floor(height / 2)

  keys.subscribe('keydown', this.keyDown)
  keys.subscribe('keyup', this.keyUp)

  // Canvas background
  /* is only for the grid background, fix later
  // can be a seperate component GridCanvas
  if (this.refs.canvas) {
    this.bgCanvas = this.refs.canvas
    this.bgContext = this.bgCanvas.getContext('2d')

    this.componentDidUpdate()
  }
  */

  // Ready to render graph
  this.triggerAutolayout()
}
