import React, {Component, PropTypes} from 'react'
import Config from '../../Config'
import {arcs} from '../../utils'
import {
  MenuSliceArcPath,
  MenuSliceIconText,
  MenuSliceLabelText,
  MenuSliceIconLabelText,
  MenuGroup
} from './'

export default class MenuSlice extends Component {
  constructor (props, context) {
    super(props, context)

    this.onTap = this.onTap.bind(this)
  }

  static propTypes = {
    menu: PropTypes.object.isRequired,
    direction: PropTypes.string.isRequired,
    tappable: PropTypes.bool.isRequired,
    onTap: PropTypes.func.isRequired,

    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    iconLabel: PropTypes.string.isRequired,

    positions: PropTypes.shape({
      IconX: PropTypes.number.isRequired,
      IconY: PropTypes.number.isRequired,
      LabelX: PropTypes.number.isRequired,
      LabelY: PropTypes.number.isRequired
    }).isRequired
  }

  onTap () {
    const {direction, onTap} = this.props

    onTap(direction)
  }

  // this should not use config.
  // Config can move to Menu/MenuGroup
  renderIcon (icon) {
    if (icon) {
      const {positions} = this.props

      const sliceIconTextOptions = {
        ...Config.menu.sliceIconText,
        x: positions.IconX,
        y: positions.IconY
      }

      return (
        <MenuSliceIconText {...sliceIconTextOptions}>
          {Config.FONT_AWESOME[icon]}
        </MenuSliceIconText>
      )
    }

    return null
  }

  renderLabel (label) {
    if (label) {
      const {positions} = this.props

      const sliceLabelTextOptions = {
        ...Config.menu.sliceLabelText,
        x: positions.IconX,
        y: positions.IconY
      }

      return (
        <MenuSliceLabelText {...sliceLabelTextOptions}>
          {label}
        </MenuSliceLabelText>
      )
    }

    return null
  }

  renderIconLabel (iconLabel) {
    if (iconLabel) {
      const {positions} = this.props

      const sliceIconLabelTextOptions = {
        ...Config.menu.sliceIconLabelText,
        x: positions.LabelX,
        y: positions.LabelY
      }

      return (
        <MenuSliceIconLabelText {...sliceIconLabelTextOptions}>
          {iconLabel}
        </MenuSliceIconLabelText>
      )
    }

    return null
  }

  render () {
    const {direction, menu, tappable} = this.props

    const arcPathOptions = {
      ...Config.menu.arcPath,
      d: arcs[direction]
    }

    let menuIcon
    let menuLabel
    let menuIconLabel

    if (menu[direction]) {
      const {icon, label, iconLabel} = menu[direction]

      menuIcon = this.renderIcon(icon)
      menuLabel = this.renderLabel(label)
      menuIconLabel = this.renderIconLabel(iconLabel)
    }

    const click = (tappable ? ' click' : '')

    const containerOptions = {
      ...Config.menu.container,
      className: `context-slice context-node-info${click}`
    }

    return (
      <MenuGroup onClick={this.onTap} {...containerOptions}>
        <MenuSliceArcPath {...arcPathOptions} />
        {menuIcon}
        {menuLabel}
        {menuIconLabel}
      </MenuGroup>
    )
  }
}
