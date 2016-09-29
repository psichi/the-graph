import React from 'react'
import Config from '../Config'
import {
  GroupBoxRect,
  GroupLabelText,
  GroupDescriptionText,
  GroupGroup
} from '../factories/group'

export default function render() {
  const {
    isSelectionGroup,
    color: colorProp,
    description,
    label,
    minX,
    maxX,
    minY,
    maxY
  } = this.props

  const x = minX - Config.base.config.nodeWidth / 2
  const y = minY - Config.base.config.nodeHeight / 2
  const color = colorProp || 0
  const selection = (isSelectionGroup ? ' selection drag' : '')
  const boxRectOptions = {
    ...Config.group.boxRect,
    x,
    y,
    width: maxX - x + Config.base.config.nodeWidth * 0.5,
    height: maxY - y + Config.base.config.nodeHeight * 0.75,
    className: `group-box color${color}${selection}`
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
