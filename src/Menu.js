import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {
  createMenuSlice,
  createMenuCircleXPath,
  createMenuOutlineCircle,
  createMenuLabelText,
  createMenuMiddleIconRect,
  createMenuMiddleIconText,
  createMenuGroup
} from './factories/menu'

export default class TheGraphMenu extends Component {
  radius = Config.menu.radius

  static propTypes = {
    menu: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    label: PropTypes.string,
    icon: PropTypes.string,
    iconColor: PropTypes.string
  }

  constructor (props, context) {
    super(props, context)

    // Use these in CSS for cursor and hover, and to attach listeners
    this.state = {
      n4tappable: (this.props.menu.n4 && this.props.menu.n4.action),
      s4tappable: (this.props.menu.s4 && this.props.menu.s4.action),
      e4tappable: (this.props.menu.e4 && this.props.menu.e4.action),
      w4tappable: (this.props.menu.w4 && this.props.menu.w4.action)
    }

    this.onTapN4 = this.onTapN4.bind(this)
    this.onTapS4 = this.onTapS4.bind(this)
    this.onTapE4 = this.onTapE4.bind(this)
    this.onTapW4 = this.onTapW4.bind(this)
    this.onContextMenu = this.onContextMenu.bind(this)
  }

  onTapN4 () {
    const {options, menu: {n4: action}, triggerHideContext} = this.props

    action(options.graph, options.itemKey, options.item)

    triggerHideContext()
  }

  onTapS4 () {
    const {options, menu: {s4: action}, triggerHideContext} = this.props

    action(options.graph, options.itemKey, options.item)

    triggerHideContext()
  }

  onTapE4 () {
    const {options, menu: {e4: action}, triggerHideContext} = this.props

    action(options.graph, options.itemKey, options.item)

    triggerHideContext()
  }

  onTapW4 () {
    const {options, menu: {w4: action}, triggerHideContext} = this.props

    action(options.graph, options.itemKey, options.item)

    triggerHideContext()
  }

  componentDidMount () {
    if (this.state.n4tappable) {
      this.refs.n4.addEventListener('up', this.onTapN4)
    }

    // refs are not available yet.
    if (this.state.s4tappable) {
      alert('2')
      // refs are empty
      console.log('refs', this.refs)
      // hm ok this ref depends on what config?
      this.refs.s4.addEventListener('up', this.onTapS4);
    }
    if (this.state.e4tappable) {
      this.refs.e4.addEventListener('up', this.onTapE4);
    }
    if (this.state.w4tappable) {
      this.refs.w4.addEventListener('up', this.onTapW4);
    }

    // Prevent context menu
    const {addEventListener} = findDOMNode(this)

    addEventListener('contextmenu', this.onContextMenu, false)
  }

  componentWillUnmount () {
    const {removeEventListener} = findDOMNode(this)

    removeEventListener('contextmenu', this.onContextMenu)
  }

  onContextMenu (event) {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  getPosition () {
    const {x, y, options: {x: optionX, y: optionY}} = this.props

    return {
      x: isNaN(x) ? optionX || 0 : x,
      y: isNaN(y) ? optionY || 0 : y
    }
  }

  render () {
    const {icon, iconColor: iconColorProp, label, menu} = this.props
    const position = this.getPosition()

    const circleXOptions = {
      ...Config.menu.circleXPath
    }

    const outlineCircleOptions = {
      ...Config.menu.outlineCircle,
      r: this.radius
    }

    const children = [
      // Directional slices
      createMenuSlice(this, { direction: 'n4' }),
      createMenuSlice(this, { direction: 's4' }),
      createMenuSlice(this, { direction: 'e4' }),
      createMenuSlice(this, { direction: 'w4' }),
      // Outline and X
      createMenuCircleXPath(circleXOptions),
      createMenuOutlineCircle(outlineCircleOptions)
    ]

    // Menu label
    if (label || menu.icon) {
      const labelTextOptions = {
        ...Config.menu.labelText,
        x: 0,
        y: 0 - this.radius - 15,
        children: (label ? label : menu.label)
      }

      children.push(createMenuLabelText(labelTextOptions))
    }

    // Middle icon
    if (icon || menu.icon) {
      const iconColor = (iconColorProp !== undefined ? iconColorProp : menu.iconColor)
      let iconStyle

      iconStyle = ''

      if (iconColor) {
        iconStyle = ' fill route' + iconColor
      }

      const middleIconRectOptions = {
        ...Config.menu.iconRect
      }

      const middleIcon = createMenuMiddleIconRect(middleIconRectOptions)

      const middleIconTextOptions = {
        ...Config.menu.iconText,
        className: 'icon context-node-icon' + iconStyle,
        children: Config.FONT_AWESOME[ (icon ? icon : menu.icon) ]
      }

      const iconText = createMenuMiddleIconText(middleIconTextOptions)

      children.push(middleIcon, iconText)
    }

    const containerOptions = {
      ...Config.menu.container,
      transform: 'translate(' + position.x + ',' + position.y + ')',
      children: children
    }

    return createMenuGroup(containerOptions)
  }
}
