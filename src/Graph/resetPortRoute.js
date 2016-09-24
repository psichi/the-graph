export default function resetPortRoute(event) {
  // Trigger nodes with changed ports to rerender
  if (event.from && event.from.node) {
    const fromNode = this.portInfo[event.from.node]

    if (fromNode) {
      fromNode.dirty = true

      const outport = fromNode.outports[event.from.port]

      if (outport) {
        outport.route = null
      }
    }
  }
  if (event.to && event.to.node) {
    const toNode = this.portInfo[event.to.node]

    if (toNode) {
      toNode.dirty = true

      const inport = toNode.inports[event.to.port]

      if (inport) {
        inport.route = null
      }
    }
  }
}
