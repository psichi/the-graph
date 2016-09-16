import Config from '../../Config'
import {arcs} from '../../utils'
import {
  createMenuSliceArcPath,
  createMenuSliceIconText,
  createMenuSliceLabelText,
  createMenuSliceIconLabelText,
  createMenuGroup
} from './'

export default function createMenuSlice (menu, options) {
  const {direction} = options
  const arcPathOptions = {
    ...Config.menu.arcPath,
    d: arcs[direction]
  }

  const children = [
    createMenuSliceArcPath(arcPathOptions)
  ]

  if (menu.props.menu[direction]) {
    const slice = menu.props.menu[direction]

    if (slice.icon) {
      const sliceIconTextOptions = {
        ...Config.menu.sliceIconText,
        x: Config.menu.positions[direction + 'IconX'],
        y: Config.menu.positions[direction + 'IconY'],
        children: Config.FONT_AWESOME[ slice.icon ]
      }

      children.push(createMenuSliceIconText(sliceIconTextOptions))
    }
    if (slice.label) {
      const sliceLabelTextOptions = {
        ...Config.menu.sliceLabelText,
        x: Config.menu.positions[direction + 'IconX'],
        y: Config.menu.positions[direction + 'IconY'],
        children: slice.label
      }

      children.push(createMenuSliceLabelText(sliceLabelTextOptions))
    }
    if (slice.iconLabel) {
      const sliceIconLabelTextOptions = {
        ...Config.menu.sliceIconLabelText,
        x: Config.menu.positions[direction + 'LabelX'],
        y: Config.menu.positions[direction + 'LabelY'],
        children: slice.iconLabel
      }

      children.push(createMenuSliceIconLabelText(sliceIconLabelTextOptions))
    }
  }

  const containerOptions = {
    ...Config.menu.container,
    ref: direction,
    className: 'context-slice context-node-info' + (menu.state[direction + 'tappable'] ? ' click' : ''),
    children
  }

  return createMenuGroup(containerOptions)
}
