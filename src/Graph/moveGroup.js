import Config from '../Config'
export default function moveGroup(nodes, dx, dy) {
  const { graph } = this.state

  // Move each group member
  const len = nodes.length

  let i

  for (i = 0; i < len; i++) {
    const node = graph.getNode(nodes[i])

    if (!node) { continue }

    if (dx !== undefined) {
      // Move by delta
      graph.setNodeMetadata(node.id, {
        x: node.metadata.x + dx,
        y: node.metadata.y + dy
      })
    } else {
      // Snap to grid
      const snap = Config.base.nodeHeight / 2
      graph.setNodeMetadata(node.id, {
        x: Math.round(node.metadata.x / snap) * snap,
        y: Math.round(node.metadata.y / snap) * snap
      })
    }
  }
}
