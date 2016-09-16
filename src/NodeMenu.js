import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {
  createNodeMenuGroup,
  createNodeMenuInports,
  createNodeMenuMenu,
  createNodeMenuOutports
} from './factories/nodeMenu'

export default class TheGraphNodeMenu extends Component {
  radius = 72

  stopPropagation (event) {
    // Don't drag graph
    event.stopPropagation()
  }

  componentDidMount () {
    // Prevent context menu
    findDOMNode(this).addEventListener('contextmenu', function (event) {
      event.stopPropagation()
      event.preventDefault()
    }, false)
  }

  render () {

    const {
      node: {
        props: {
          app: {
            state: {
              scale
            }
          }
        }
      },
      ports,
      processKey,
      menu,
      options,
      triggerHideContext,
      icon,
      label,
      nodeWidth,
      nodeHeight,
      highlightPort,
      deltaX,
      deltaY,
      x,
      y
    } = this.props

    const inportsOptions = {
      ...Config.nodeMenu.inports,
      ports: ports.inports,
      isIn: true,
      scale,
      processKey,
      deltaX,
      deltaY,
      nodeWidth,
      nodeHeight,
      highlightPort
    }

    const inports = createNodeMenuInports(inportsOptions)

    const outportsOptions = {
      ...Config.nodeMenu.outports,
      ports: ports.outports,
      isIn: false,
      scale,
      processKey,
      deltaX,
      deltaY,
      nodeWidth,
      nodeHeight,
      highlightPort
    }

    const outports = createNodeMenuOutports(outportsOptions)

    const menuOptions = {
      ...Config.nodeMenu.menu,
      menu,
      options,
      triggerHideContext,
      icon,
      label
    }

    const nodeMenu = createNodeMenuMenu(menuOptions)

    const children = [
      inports, outports, nodeMenu
    ]

    const containerOptions = {
      ...Config.nodeMenu.container,
      transform: 'translate(' + x + ',' + y + ')',
      children: children
    }

    return createNodeMenuGroup(containerOptions)
  }
}
