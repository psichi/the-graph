import Config from '../Config'
import { findNodeFit, findAreaFit } from '../utils'

export default function focusNode(node) {
  const { width, height, scale, x: currentX, y: currentY } = this.state

  const duration = Config.focusAnimationDuration

  const fit = findNodeFit(node, Config.base.nodeSize, width, height)

  const start_point = {
    x: -(currentX - width / 2) / scale,
    y: -(currentY - height / 2) / scale
  }

  const end_point = {
    x: node.metadata.x,
    y: node.metadata.y
  }

  const graphfit = findAreaFit(Config.base.nodeSize, start_point, end_point, width, height)

  const scale_ratio_1 = Math.abs(graphfit.scale - scale)
  const scale_ratio_2 = Math.abs(fit.scale - graphfit.scale)
  const scale_ratio_diff = scale_ratio_1 + scale_ratio_2

  // Animate zoom-out then zoom-in
  this.animate({
    x: graphfit.x,
    y: graphfit.y,
    scale: graphfit.scale
  }, duration * (scale_ratio_1 / scale_ratio_diff), 'in-quint', () => {
    this.animate({
      x: fit.x,
      y: fit.y,
      scale: fit.scale
    }, duration * (scale_ratio_2 / scale_ratio_diff), 'out-quint')
  })
}
