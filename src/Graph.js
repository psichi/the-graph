import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom'
import { FakeMouse } from './mixins'
import { provision } from './provision'

import {
  addEdge,
  cancelPreviewEdge,
  componentDidMount,
  componentWillUnmount,
  createEdges,
  createGroups,
  createIIPs,
  createInportExports,
  createNodes,
  createOutportExports,
  edgeStart,
  getComponentInfo,
  getGraphInport,
  getGraphOutport,
  getNodeInport,
  getNodeOutport,
  getPorts,
  markDirty,
  moveGroup,
  render,
  renderPreviewEdge,
  resetPortRoute,
  setAnimatedEdges,
  setErrorNodes,
  setSelectedEdges,
  setSelectedNodes,
  shouldComponentUpdate,
  triggerRender,
  updateIcon
} from './Graph/'

// Graph view
class TheGraphGraph extends Component {
  mixins = [FakeMouse]
  edgePreview = null
  portInfo = {}
  graphOutports = {}
  graphInports = {}
  updatedIcons = {}
  dirty = false
  libraryDirty = false

  static propTypes = {
    graph: PropTypes.object.isRequired,
    scale: PropTypes.number,
    app: PropTypes.object,  // << see what this is used for
    library: PropTypes.object,
    onNodeSelection: PropTypes.func,
    onEdgeSelection: PropTypes.func,
    showContext: PropTypes.func,

    onEdgeStart: PropTypes.func,
    onEdgeDraw: PropTypes.func,
    onEdgeDrop: PropTypes.func
  }

  constructor(props, context) {
    super(props, context)

    const { graph, offsetX, offsetY } = this.props

    this.state = {
      graph,
      offsetX,
      offsetY,
      displaySelectionGroup: true,
      edgePreview: null,
      edgePreviewX: 0,
      edgePreviewY: 0,
      forceSelection: false,
      selectedNodes: [],
      errorNodes: [],
      selectedEdges: [],
      animatedEdges: []
    }

    this.triggerRender = this.triggerRender.bind(this)
    this.resetPortRoute = this.resetPortRoute.bind(this)
    this.markDirty = this.markDirty.bind(this)
    this.renderPreviewEdge = this.renderPreviewEdge.bind(this)
    this.cancelPreviewEdge = this.cancelPreviewEdge.bind(this)
    // this.removeNode = this.removeNode.bind(this)
  }

  componentDidMount = this::componentDidMount
  componentWillUnmount = this::componentWillUnmount
  edgeStart = this::edgeStart
  cancelPreviewEdge = this::cancelPreviewEdge
  renderPreviewEdge = this::renderPreviewEdge
  addEdge = this::addEdge
  moveGroup = this::moveGroup
  getComponentInfo = this::getComponentInfo
  getPorts = this::getPorts
  getNodeOutport = this::getNodeOutport
  getNodeInport = this::getNodeInport
  resetPortRoute = this::resetPortRoute
  getGraphOutport = this::getGraphOutport
  getGraphInport = this::getGraphInport

  // These setters should be done differently.
  setSelectedNodes = this::setSelectedNodes
  setErrorNodes = this::setErrorNodes
  setSelectedEdges = this::setSelectedEdges
  setAnimatedEdges = this::setAnimatedEdges

  updateIcon = this::updateIcon
  markDirty = this::markDirty
  triggerRender = this::triggerRender
  shouldComponentUpdate = this::shouldComponentUpdate
  createNodes = this::createNodes
  createEdges = this::createEdges
  createIIPs = this::createIIPs
  createInportExports = this::createInportExports
  createOutportExports = this::createOutportExports
  createGroups = this::createGroups
  render = this::render

  onPortsCreated (nodeId) {
    return (portInfo) => {
      this.portInfo[nodeId] = portInfo
    }
  }
}

export default provision(TheGraphGraph)
