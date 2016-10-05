type ElementOffsets = ?{
  offsetTop: ?number,
  offsetLeft: ?number,
  offsetParent: ?ElementOffsets
}

type Offset = {
  left: number,
  top: number
}

export default function getElementOffset(element: ElementOffsets): Offset {
  const offset = {
    top: 0,
    left: 0
  }

  if (!element) {
    return offset
  }

  offset.top += (element.offsetTop || 0)
  offset.left += (element.offsetLeft || 0)

  const { top, left } = getElementOffset(element.offsetParent)

  offset.top += top
  offset.left += left

  return offset
}
