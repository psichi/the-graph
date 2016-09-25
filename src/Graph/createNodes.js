import Config from '../Config'
import { GraphNode } from '../factories/graph'

export default function createNodes(graph, selectedIds, highlightPort) {
  const { app, onNodeSelection, showContext } = this.props

  return graph.nodes.map((node) => {
    const componentInfo = this.getComponentInfo(node.component)
    const key = node.id

    if (!node.metadata) {
      node.metadata = {}
    }

    if (node.metadata.x === undefined) {
      node.metadata.x = 0
    }

    if (node.metadata.y === undefined) {
      node.metadata.y = 0
    }

    if (node.metadata.width === undefined) {
      node.metadata.width = Config.base.config.nodeWidth
    }

    node.metadata.height = Config.base.config.nodeHeight

    if (Config.base.config.autoSizeNode && componentInfo) {
      // Adjust node height based on number of ports.
      const portCount = Math.max(componentInfo.inports.length, componentInfo.outports.length)
      if (portCount > Config.base.config.maxPortCount) {
        const diff = portCount - Config.base.config.maxPortCount
        node.metadata.height = Config.base.config.nodeHeight + (diff * Config.base.config.nodeHeightIncrement)
      }
    }
    if (!node.metadata.label || node.metadata.label === '') {
      node.metadata.label = key
    }

    let icon
    let iconsvg

    icon = 'cog'
    iconsvg = ''

    if (this.updatedIcons[key]) {
      icon = this.updatedIcons[key]
    } else if (componentInfo && componentInfo.icon) {
      icon = componentInfo.icon
    } else if (componentInfo && componentInfo.iconsvg) {
      iconsvg = componentInfo.iconsvg
    }
    const selected = (this.state.selectedNodes[key] === true)
    if (selected) {
      selectedIds.push(key)
    }

    const nodeOptions = {
      ...Config.node,
      app,
      key,
      node,
      icon,
      graph,
      iconsvg,
      selected,
      showContext,
      onNodeSelection,
      highlightPort,
      nodeID: key,
      x: node.metadata.x,
      y: node.metadata.y,
      label: node.metadata.label,
      sublabel: node.metadata.sublabel || node.component,
      width: node.metadata.width,
      height: node.metadata.height,
      graphView: this,
      ports: this.getPorts(graph, key, node.component),
      error: (this.state.errorNodes[key] === true)
    }

    console.log('NODE %s', key, JSON.stringify({
      key,
      node,
      icon,
      // graph,
      iconsvg,
      selected,
      showContext,
      onNodeSelection,
      highlightPort,
      nodeID: key,
      x: node.metadata.x,
      y: node.metadata.y,
      label: node.metadata.label,
      sublabel: node.metadata.sublabel || node.component,
      width: node.metadata.width,
      height: node.metadata.height,
      // graphView: this,
      ports: this.getPorts(graph, key, node.component),
      error: (this.state.errorNodes[key] === true)
    }, null, 2))

    return GraphNode(nodeOptions)
  })
}
