import React from 'react'
import Menu from '../Menu'

export default function getContext(menu, options, triggerHideContext) {
  const { label } = this.props

  const menuOptions = {
    menu,
    options,
    label,
    triggerHideContext
  }

  return <Menu {...menuOptions} />
}

