import React, { Component, PropTypes } from 'react'
import Config from './Config'
import {
  TooltipGroup,
  TooltipRect,
  TooltipText
} from './factories/tooltip'

export default class TheGraphTooltip extends Component {
  static defaultProps = {
    label: '',
    x: 0,
    y: 0,
    visible: false
  }

  static propTypes = {
    label: PropTypes.string,
    visible: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number
  }

  render() {
    const { label, visible, x, y } = this.props

    const rectOptions = {
      ...Config.tooltip.rect,
      width: label.length * 6
    }

    const textOptions = {
      ...Config.tooltip.text
    }

    const containerOptions = {
      ...Config.tooltip.container,
      className: `tooltip${(visible ? '' : ' hidden')}`,
      transform: `translate(${x},${y})`
    }

    return (
      <TooltipGroup {...containerOptions}>
        <TooltipRect {...rectOptions} />
        <TooltipText {...textOptions}>
          {label}
        </TooltipText>
      </TooltipGroup>
    )
  }
}
