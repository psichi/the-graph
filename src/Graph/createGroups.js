import Config from '../Config'
import { findMinMax } from '../utils'
import { GraphGroup } from '../factories/graph'

export default function createGroups(graph) {
  const { app, scale, showContext } = this.props

  return graph.groups.map((group) => {
    if (group.nodes.length < 1) {
      return
    }

    const limits = findMinMax(graph, group.nodes)

    if (!limits) {
      return
    }

    const groupOptions = {
      ...Config.graph.nodeGroup,
      app,
      graph,
      scale,
      showContext,
      key: `group.${group.name}`,
      item: group,
      minX: limits.minX,
      minY: limits.minY,
      maxX: limits.maxX,
      maxY: limits.maxY,
      label: group.name,
      nodes: group.nodes,
      description: group.metadata.description,
      color: group.metadata.color,
      triggerMoveGroup: this.moveGroup
    }

    return GraphGroup(groupOptions)
  })
}
