import React from 'react'
import Menu from '../Menu'

export default function getContext(menu, options, hide) {
  const menuOptions = {
    menu,
    options,
    triggerHideContext: hide,
    label: this.props.label,
    iconColor: this.props.route
  }

  return <Menu {...menuOptions} />
}
