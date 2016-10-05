import type { PortHash } from '../types'

export default function createOutportViews(outports: PortHash) {
  return this.createPortViews('out', outports)
}
