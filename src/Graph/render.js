import Config from '../Config'
import React from 'react'
import { findMinMax } from '../utils'

import {
  GraphGroup,
  GraphEdgesGroup,
  GraphEdgePreview,
  GraphIIPGroup,
  GraphNodesGroup,
  GraphInportsGroup,
  GraphGroupsGroup,
  GraphContainerGroup
} from '../factories/graph'

export default function render() {
  this.dirty = false

  const {
    forceSelection,
    graph,
    edgePreview: currentEdgePreview,
    displaySelectionGroup,
    edgePreviewX,
    edgePreviewY
  } = this.state

  const { app, scale, showContext } = this.props
  const selectedIds = []

  // Reset ports if library has changed
  if (this.libraryDirty) {
    this.libraryDirty = false
    this.portInfo = {}
  }

  // Highlight compatible ports
  let highlightPort

  highlightPort = null
  if (currentEdgePreview && currentEdgePreview.type) {
    highlightPort = {
      type: currentEdgePreview.type,
      isIn: !currentEdgePreview.isIn
    }
  }

  // Nodes
  const nodes = this.createNodes(graph, selectedIds, highlightPort)

  // Edges
  const edges = this.createEdges(graph)

  // IIPs
  const iips = this.createIIPs(graph)

  // Inport exports
  const inports = this.createInportExports(graph)

  // Outport exports
  const outports = this.createOutportExports(graph)

  // Groups
  const groups = this.createGroups(graph)

  // Selection pseudo-group
  if (displaySelectionGroup && selectedIds.length >= 2) {
    const limits = findMinMax(graph, selectedIds)
    if (limits) {
      const pseudoGroup = {
        name: 'selection',
        nodes: selectedIds,
        metadata: { color: 1 }
      }

      const selectionGroupOptions = {
        ...Config.graph.selectionGroup,
        graph,
        app,
        item: pseudoGroup,
        minX: limits.minX,
        minY: limits.minY,
        maxX: limits.maxX,
        maxY: limits.maxY,
        scale,
        color: pseudoGroup.metadata.color,
        triggerMoveGroup: this.moveGroup,
        showContext
      }

      const selectionGroup = GraphGroup(selectionGroupOptions)

      groups.push(selectionGroup)
    }
  }

  // Edge preview
  const edgePreview = this.state.edgePreview

  if (edgePreview) {
    let edgePreviewOptions

    if (edgePreview.from) {
      const source = graph.getNode(edgePreview.from.process)
      const sourcePort = this.getNodeOutport(graph, edgePreview.from.process, edgePreview.from.port)

      edgePreviewOptions = {
        ...Config.graph.edgePreview,
        sX: source.metadata.x + source.metadata.width,
        sY: source.metadata.y + sourcePort.y,
        tX: edgePreviewX,
        tY: edgePreviewY,
        route: edgePreview.metadata.route
      }
    } else {
      const target = graph.getNode(edgePreview.to.process)
      const targetPort = this.getNodeInport(graph, edgePreview.to.process, edgePreview.to.port)

      edgePreviewOptions = {
        ...Config.graph.edgePreview,
        sX: edgePreviewX,
        sY: edgePreviewY,
        tX: target.metadata.x,
        tY: target.metadata.y + targetPort.y,
        route: edgePreview.metadata.route
      }
    }

    const edgePreviewView = GraphEdgePreview(edgePreviewOptions)

    edges.push(edgePreviewView)
  }

  const groupsOptions = Config.graph.groupsGroup
  const edgesOptions = Config.graph.edgesGroup
  const iipsOptions = Config.graph.iipsGroup
  const nodesOptions = Config.graph.nodesGroup
  const inportsOptions = Config.graph.inportsGroup
  const outportsOptions = Config.graph.outportsGroup

  const selectedClass = (forceSelection || selectedIds.length > 0) ? ' selection' : ''
  const containerOptions = {
    ...Config.graph.container,
    className: `graph${selectedClass}`
  }

  return (
    <GraphContainerGroup {...containerOptions}>
      <GraphNodesGroup {...nodesOptions}>
        {nodes}
      </GraphNodesGroup>
      <GraphInportsGroup {...inportsOptions}>
        {inports}
      </GraphInportsGroup>
      <GraphIIPGroup {...iipsOptions}>
        {iips}
      </GraphIIPGroup>
      <GraphEdgesGroup {...edgesOptions}>
        {edges}
      </GraphEdgesGroup>
      <GraphGroupsGroup {...outportsOptions}>
        {outports}
      </GraphGroupsGroup>
      <GraphGroupsGroup {...groupsOptions}>
        {groups}
      </GraphGroupsGroup>
    </GraphContainerGroup>
  )
}
