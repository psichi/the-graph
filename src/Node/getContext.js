import React from 'react'
import Menu from '../Menu'
import NodeMenu from '../NodeMenu'
import NodeMenuPorts from '../NodeMenuPorts'

export default function getContext(menu, options, triggerHideContext) {
  const {
    app: {
      state: {
        x: appX,
        y: appY
      }
    },
    scale,
    exportKey: label,
    graph,
    icon,
    highlightPort,
    ports,
    node: process,
    nodeID: processKey,
    x: xProp,
    y: yProp,
    width,
    height,
    graphView,
    graphView: {
      state: {
        edgePreview
      }
    }
  } = this.props

  const _export = this.props.export
  let menuOptions

  // If this node is an export
  if (_export) {
    menuOptions = {
      menu,
      options,
      triggerHideContext,
      label
    }

    return <Menu {...menuOptions} />
  }

  // this relies on the state of the parent app.

  // Absolute position of node
  const { x, y } = options
  const nodeX = (xProp + width / 2) * scale + appX
  const nodeY = (yProp + height / 2) * scale + appY
  const deltaX = nodeX - x
  const deltaY = nodeY - y

  // If there is a preview edge started, only show connectable ports
  if (edgePreview) {
    if (edgePreview.isIn) {
      // Show outputs
      menuOptions = {
        ports: ports.outports,
        triggerHideContext,
        isIn: false,
        scale,
        processKey,
        deltaX,
        deltaY,
        translateX: x,
        translateY: y,
        nodeWidth: width,
        nodeHeight: height,
        highlightPort
      }
    } else {
      // Show inputs
      menuOptions = {
        ports: ports.inports,
        triggerHideContext,
        isIn: true,
        scale,
        processKey,
        deltaX,
        deltaY,
        translateX: x,
        translateY: y,
        nodeWidth: width,
        nodeHeight: height,
        highlightPort
      }
    }

    return <NodeMenuPorts {...menuOptions} />
  }

  menuOptions = {
    menu,
    options,
    triggerHideContext,
    label,
    graph,
    graphView,
    node: this,
    icon,
    ports,
    process,
    processKey,
    x,
    y,
    nodeWidth: width,
    nodeHeight: height,
    deltaX,
    deltaY,
    highlightPort
  }

  // Default, show whole node menu
  return <NodeMenu {...menuOptions} />
}
