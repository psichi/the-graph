import React from 'react'
import Config from '../Config'
import {
  NodeIconSVG,
  NodeIconText
} from '../factories/node'

export default function createIconContent() {
  const { iconsvg, width, height } = this.props

  // Node Icon
  let icon = Config.FONT_AWESOME[this.props.icon]

  if (!icon) {
    icon = Config.FONT_AWESOME.cog
  }

  if (iconsvg && iconsvg !== '') {
    const iconSVGOptions = {
      ...Config.node.iconsvg,
      src: iconsvg,
      x: Config.base.config.nodeRadius - 4,
      y: Config.base.config.nodeRadius - 4,
      width: width - 10,
      height: height - 10
    }

    return <NodeIconSVG {...iconSVGOptions} />
  } else {
    const iconOptions = {
      ...Config.node.icon,
      x: width / 2,
      y: height / 2,
      children: icon
    }

    return <NodeIconText {...iconOptions} />
  }
}
