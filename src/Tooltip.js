import React, {Component} from 'react'
import Config from './Config'
import {
  createTooltipGroup,
  createTooltipRect,
  createTooltipText
} from './factories/tooltip'

// Port view
export default class TheGraphTooltip extends Component {
  render () {
    const {label, visible, x, y} = this.props

    const rectOptions = {
      ...Config.tooltip.rect,
      width: label.length * 6
    }

    const rect = createTooltipRect(rectOptions)

    const textOptions = {
      ...Config.tooltip.text,
      children: label
    }

    const text = createTooltipText(textOptions)

    const containerContents = [rect, text]

    const containerOptions = {
      ...Config.tooltip.container,
      className: 'tooltip' + (visible ? '' : ' hidden'),
      transform: 'translate(' + x + ',' + y + ')'

    }

    return createTooltipGroup(containerOptions, containerContents)
  }
}
