import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {
  MenuSlice,
  MenuCircleXPath,
  MenuOutlineCircle,
  MenuLabelText,
  MenuMiddleIconRect,
  MenuMiddleIconText,
  MenuGroup
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

    this.onTap.bind(this)

    this.onContextMenu = this.onContextMenu.bind(this)
  }

  onTap (direction) {
    const {options, menu, triggerHideContext} = this.props
    const action = menu[direction]

    action(options.graph, options.itemKey, options.item)

    triggerHideContext()
  }

  componentDidMount () {
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

  renderMenuLabelText (label, menu) {
    if (label || menu.icon) {
      const labelTextOptions = {
        ...Config.menu.labelText,
        x: 0,
        y: 0 - this.radius - 15
      }

      const text = (label ? label : menu.label)

      return (
        <MenuLabelText {...labelTextOptions}>
          {text}
        </MenuLabelText>
      )
    }

    return null
  }

  renderMenuMiddleIcon (icon, menu) {
    if (icon || menu.icon) {
      const {iconColor: iconColorProp} = this.props
      const iconColor = (iconColorProp !== undefined ? iconColorProp : menu.iconColor)
      let iconStyle

      iconStyle = ''

      if (iconColor) {
        iconStyle = ` fill route${iconColor}`
      }

      const middleIconRectOptions = {
        ...Config.menu.iconRect
      }


      const middleIconTextOptions = {
        ...Config.menu.iconText,
        className: `icon context-node-icon${iconStyle}`
      }

      const iconText = Config.FONT_AWESOME[(icon ? icon : menu.icon)]

      return [
        <MenuMiddleIconRect {...middleIconRectOptions} />,
        <MenuMiddleIconText {...middleIconTextOptions}>
          {iconText}
        </MenuMiddleIconText>
      ]
    }

    return null
  }

  render () {
    const {icon, label, menu} = this.props
    const {n4tappable, s4tappable, e4tappable, w4tappable} = this.state
    const position = this.getPosition()

    const circleXOptions = {
      ...Config.menu.circleXPath
    }

    const outlineCircleOptions = {
      ...Config.menu.outlineCircle,
      r: this.radius
    }

    const {menu: {positions}} = Config

    // Menu label
    const menuLabelText = this.renderMenuLabelText(label, menu)

    // Middle icon
    const menuMiddleIcon = this.renderMenuMiddleIcon(icon, menu)

    const containerOptions = {
      ...Config.menu.container,
      transform: `translate(${position.x},${position.y})`
    }

    return (
      <MenuGroup {...containerOptions}>
        // Directional slices
        <MenuSlice direction="n4" positions={positions.n4} onTap={this.onTap} tappable={n4tappable} menu={menu} />,
        <MenuSlice direction="s4" positions={positions.s4} onTap={this.onTap} tappable={s4tappable} menu={menu} />,
        <MenuSlice direction="e4" positions={positions.e4} onTap={this.onTap} tappable={e4tappable} menu={menu} />,
        <MenuSlice direction="w4" positions={positions.w4} onTap={this.onTap} tappable={w4tappable} menu={menu} />,
        <MenuCircleXPath {...circleXOptions} />,
        <MenuOutlineCircle {...outlineCircleOptions} />
        {menuLabelText}
        {menuMiddleIcon}
      </MenuGroup>
    )
  }
}
