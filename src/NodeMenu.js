import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {
  NodeMenuGroup,
  NodeMenuInports,
  NodeMenuMenu,
  NodeMenuOutports
} from './factories/nodeMenu'

export default class TheGraphNodeMenu extends Component {
  radius = 72

  static propTypes = {
    node: PropTypes.object,
    ports: PropTypes.object,
    processKey: PropTypes.string,
    menu: PropTypes.object,
    options: PropTypes.object,
    triggerHideContext: PropTypes.bool,
    icon: PropTypes.string,
    label: PropTypes.string,
    nodeWidth: PropTypes.number,
    nodeHeight: PropTypes.number,
    highlightPort: PropTypes.bool,
    deltaX: PropTypes.number,
    deltaY: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }

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

    const menuOptions = {
      ...Config.nodeMenu.menu,
      menu,
      options,
      triggerHideContext,
      icon,
      label
    }

    const containerOptions = {
      ...Config.nodeMenu.container,
      transform: `translate(${x},${y})`
    }

    return (
      <NodeMenuGroup {...containerOptions}>
        <NodeMenuInports {...inportsOptions} />
        <NodeMenuOutports {...outportsOptions} />
        <NodeMenuMenu {...menuOptions} />
      </NodeMenuGroup>
    )
  }
}
