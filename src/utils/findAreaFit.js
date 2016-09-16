import Config from '../Config'

const {base: {nodeSize}} = Config

export default function findAreaFit (point1, point2, width, height) {
  const limits = {
    minX: point1.x < point2.x ? point1.x : point2.x,
    minY: point1.y < point2.y ? point1.y : point2.y,
    maxX: point1.x > point2.x ? point1.x : point2.x,
    maxY: point1.y > point2.y ? point1.y : point2.y
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
}
