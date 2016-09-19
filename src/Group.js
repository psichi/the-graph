import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Menu from './Menu'
import Config from './Config'
import {
  GroupBoxRect,
  GroupLabelText,
  GroupDescriptionText,
  GroupGroup
} from './factories/group'

// Group view
export default class TheGraphGroup extends Component {
  static propTypes = {
    app: PropTypes.shape({
      menuShown: PropTypes.bool
    }),
    label: PropTypes.string,
    graph: PropTypes.object,
    item: PropTypes.object,
    color: PropTypes.number,
    description: PropTypes.string,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number,
    isSelectionGroup: PropTypes.bool,
    showContext: PropTypes.func,
    triggerMoveGroup: PropTypes.bool
  }

  constructor (props, context) {
    super(props, context)

    this.onTrack = this.onTrack.bind(this)
    this.onTrackStart = this.onTrackStart.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.dontPan = this.dontPan.bind(this)
    this.showContext = this.showContext.bind(this)
  }
  componentDidMount () {
    const {box: boxRef, label: labelRef} = this.refs
    const {isSelectionGroup, showContext} = this.props

    // Move group
    if (isSelectionGroup) {
      // Drag selection by bg
      findDOMNode(boxRef).addEventListener('trackstart', this.onTrackStart)
    } else {
      findDOMNode(labelRef).addEventListener('trackstart', this.onTrackStart)
    }

    const domNode = findDOMNode(this)

    // Don't pan under menu
    domNode.addEventListener('trackstart', this.dontPan)

    // Context menu
    if (showContext) {
      domNode.addEventListener('contextmenu', this.showContext)
      domNode.addEventListener('hold', this.showContext)
    }
  }

  componentWillUnmount () {
    const {showContext, isSelectionGroup} = this.props
    const {box: boxRef, label: labelRef} = this.refs

    if (isSelectionGroup) {
      findDOMNode(boxRef).removeEventListener('trackstart', this.onTrackStart)
    } else {
      findDOMNode(labelRef).removeEventListener('trackstart', this.onTrackStart)
    }

    const domNode = findDOMNode(this)

    domNode.removeEventListener('trackstart', this.dontPan)

    if (showContext) {
      domNode.removeEventListener('contextmenu', this.showContext)
      domNode.removeEventListener('hold', this.showContext)
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

    const menuOptions = {
      menu,
      options,
      label,
      triggerHideContext
    }

    return <Menu {...menuOptions} />
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

    const {graph, isSelectionGroup, triggerMoveGroup, item: {nodes}} = this.props
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

    graph.endTransaction('movegroup')
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

    const labelTextOptions = {
      ...Config.group.labelText,
      x: x + Config.base.config.nodeRadius,
      y: y + 9
    }

    const descriptionTextOptions = {
      ...Config.group.descriptionText,
      x: x + Config.base.nodeRadius,
      y: y + 24
    }

    const containerOptions = {
      ...Config.group.container
    }

    return (
      <GroupGroup {...containerOptions}>
        <GroupBoxRect {...boxRectOptions} />
        <GroupLabelText {...labelTextOptions}>
          {label}
        </GroupLabelText>
        <GroupDescriptionText {...descriptionTextOptions}>
          {description}
        </GroupDescriptionText>
      </GroupGroup>
    )
  }
}
