import getElementOffset from './getElementOffset'

export default function getOffset(domNode) {
  try {
    return getElementOffset(domNode)
  } catch (e) {
    return getElementOffset()
  }
}
