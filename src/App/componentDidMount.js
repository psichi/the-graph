import Config from '../Config'
import { findFit } from '../utils'
export default function componentDidMount() {
  const { width, height } = this.props

  // Autofit (not sure whether this is the correct location to do it
  /*
  let { x, y, scale } = findFit(graph, Config.base.nodeSize, width, height)

  this.setState({
    x,
    y,
    scale
  })
  */

  this.addEventListeners()

  // Start zoom from middle if zoom before mouse move
  this.mouseX = Math.floor(width / 2)
  this.mouseY = Math.floor(height / 2)

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
