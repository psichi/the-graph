import Config from '../Config'
import { findFit } from '../utils'

export default function triggerFit(/* event */) {
  const { graph, width, height } = this.props

  const { x, y, scale } = findFit(graph, Config.base.nodeSize, width, height)

  this.setState({
    x,
    y,
    scale
  })

  this.forceUpdate()
}
