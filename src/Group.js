import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Menu from './Menu'
import Config from './Config'
import {
  createGroupBoxRect,
  createGroupLabelText,
  createGroupDescriptionText,
  createGroupGroup
} from './factories/group'

// Group view
export default class TheGraphGroup extends Component {
  constructor (props, context) {
    super(props, context)

    this.onTrack = this.onTrack.bind(this)
    this.onTrackStart = this.onTrackStart.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.dontPan = this.dontPan.bind(this)
    this.showContext = this.showContext.bind(this)
  }
  componentDidMount () {
    // Move group
    if (this.props.isSelectionGroup) {
      // Drag selection by bg
      findDOMNode(this.refs.box).addEventListener('trackstart', this.onTrackStart)
    } else {
      findDOMNode(this.refs.label).addEventListener('trackstart', this.onTrackStart)
    }

    const domNode = findDOMNode(this)

    // Don't pan under menu
    domNode.addEventListener('trackstart', this.dontPan)

    // Context menu
    if (this.props.showContext) {
      domNode.addEventListener('contextmenu', this.showContext)
      domNode.addEventListener('hold', this.showContext)
    }
  }
  showContext (event) {
    // Don't show native context menu
    event.preventDefault()

    // Don't tap graph on hold event
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    const {graph, label: itemKey, item, isSelectionGroup, showContext} = this.props

    // Get mouse position
    const x = event.x || event.clientX || 0
    const y = event.y || event.clientY || 0

    // App.showContext
    showContext({
      element: this,
      type: (isSelectionGroup ? 'selection' : 'group'),
      x,
      y,
      graph,
      itemKey,
      item
    })
  }
  getContext (menu, options, triggerHideContext) {
    const {label} = this.props

    return Menu({
      menu,
      options,
      label,
      triggerHideContext
    })
  }

  dontPan (event) {
    const {app: {menuShown}} = this.props
    // Don't drag under menu
    if (menuShown) {
      event.stopPropagation()
    }
  }

  onTrackStart (event) {
    // Don't drag graph
    event.stopPropagation()

    const {graph, isSelectionGroup} = this.props
    const {box, label} = this.refs

    if (isSelectionGroup) {
      const boxEl = findDOMNode(box)

      boxEl.addEventListener('track', this.onTrack)
      boxEl.addEventListener('trackend', this.onTrackEnd)
    } else {
      const labelEl = findDOMNode(label)

      labelEl.addEventListener('track', this.onTrack)
      labelEl.addEventListener('trackend', this.onTrackEnd)
    }

    graph.startTransaction('movegroup')
  }

  onTrack (event) {
    // Don't fire on graph
    event.stopPropagation()

    const {scale, triggerMoveGroup, item: {nodes}} = this.props

    const deltaX = Math.round(event.ddx / scale)
    const deltaY = Math.round(event.ddy / scale)

    triggerMoveGroup(nodes, deltaX, deltaY)
  }

  onTrackEnd (event) {
    // Don't fire on graph
    event.stopPropagation()

    // Don't tap graph (deselect)
    event.preventTap()

    const {isSelectionGroup, triggerMoveGroup, item: {nodes}} = this.props
    const {box, label} = this.refs

    // Snap to grid
    triggerMoveGroup(nodes)

    if (isSelectionGroup) {
      const boxEl = findDOMNode(box)

      boxEl.removeEventListener('track', this.onTrack)
      boxEl.removeEventListener('trackend', this.onTrackEnd)
    } else {
      const labelEl = findDOMNode(label)

      labelEl.removeEventListener('track', this.onTrack)
      labelEL.removeEventListener('trackend', this.onTrackEnd)
    }

    this.props.graph.endTransaction('movegroup')
  }
  render () {
    const {isSelectionGroup, color: colorProp, description, label, minX, maxX, minY, maxY} = this.props

    const x = minX - Config.base.config.nodeWidth / 2
    const y = minY - Config.base.config.nodeHeight / 2
    const color = (colorProp ? colorProp : 0)
    const selection = (isSelectionGroup ? ' selection drag' : '')
    const boxRectOptions = {
      ...Config.group.boxRect,
      x,
      y,
      width: maxX - x + Config.base.config.nodeWidth * 0.5,
      height: maxY - y + Config.base.config.nodeHeight * 0.75,
      className: 'group-box color' + color + selection
    }

    const boxRect = createGroupBoxRect(boxRectOptions)

    const labelTextOptions = {
      ...Config.group.labelText,
      x: x + Config.base.config.nodeRadius,
      y: y + 9,
      children: label
    }

    const labelText = createGroupLabelText(labelTextOptions)

    const descriptionTextOptions = {
      ...Config.group.descriptionText,
      x: x + Config.base.nodeRadius,
      y: y + 24,
      children: description
    }

    const descriptionText = createGroupDescriptionText(descriptionTextOptions)

    const groupContents = [
      boxRect,
      labelText,
      descriptionText
    ]

    const containerOptions = {
      ...Config.group.container
    }

    return createGroupGroup(containerOptions, groupContents)
  }
}
