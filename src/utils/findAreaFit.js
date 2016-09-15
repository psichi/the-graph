import Config from '../Config'

export default function findAreaFit (point1, point2, width, height) {
  var limits = {
    minX: point1.x < point2.x ? point1.x : point2.x,
    minY: point1.y < point2.y ? point1.y : point2.y,
    maxX: point1.x > point2.x ? point1.x : point2.x,
    maxY: point1.y > point2.y ? point1.y : point2.y
  }

  limits.minX -= Config.base.nodeSize
  limits.minY -= Config.base.nodeSize
  limits.maxX += Config.base.nodeSize * 2
  limits.maxY += Config.base.nodeSize * 2

  var gWidth = limits.maxX - limits.minX
  var gHeight = limits.maxY - limits.minY

  var scaleX = width / gWidth
  var scaleY = height / gHeight

  var scale, x, y
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
    x: x,
    y: y,
    scale: scale
  }
};
