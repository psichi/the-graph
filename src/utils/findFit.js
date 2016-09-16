import findMinMax from './findMinMax'
import Config from '../Config'

const {base: {nodeSize}} = Config

export default function findFit (graph, width, height) {
  const limits = findMinMax(graph)

  if (!limits) {
    return {x: 0, y: 0, scale: 1}
  }

  limits.minX -= nodeSize
  limits.minY -= nodeSize
  limits.maxX += nodeSize * 2
  limits.maxY += nodeSize * 2

  const gWidth = limits.maxX - limits.minX
  const gHeight = limits.maxY - limits.minY

  const scaleX = width / gWidth
  const scaleY = height / gHeight

  let scale
  let x
  let y

  if (scaleX < scaleY) {
    scale = scaleX
    x = 0 - limits.minX * scale
    y = 0 - limits.minY * scale + (height - (gHeight * scale)) / 2
  } else {
    scale = scaleY
    x = 0 - limits.minX * scale + (width - (gWidth * scale)) / 2
    y = 0 - limits.minY * scale
  }

  return {
    x,
    y,
    scale
  }
};
