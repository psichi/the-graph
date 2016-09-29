import { findDOMNode } from 'react-dom'

export default function getTooltipTrigger() {
  return findDOMNode(this)
}
