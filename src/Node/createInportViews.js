import type { PortHash } from '../types'

export default function createInportViews(inports: PortHash) {
  return this.createPortViews('in', inports)
}
