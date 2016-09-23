export default function findNodeFit(node, nodeSize, width, height) {
  const limits = {
    minX: node.metadata.x - nodeSize,
    minY: node.metadata.y - nodeSize,
    maxX: node.metadata.x + nodeSize * 2,
    maxY: node.metadata.y + nodeSize * 2
  }

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
