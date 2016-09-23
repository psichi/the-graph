import base from './base'

export default {
  radius: 72,
  positions: {
    n4: {
      IconX: 0,
      IconY: -52,
      LabelX: 0,
      LabelY: -35
    },
    s4: {
      IconX: 0,
      IconY: 52,
      LabelX: 0,
      LabelY: 35
    },
    e4: {
      IconX: 45,
      IconY: -5,
      LabelX: 45,
      LabelY: 15
    },
    w4: {
      IconX: -45,
      IconY: -5,
      LabelX: -45,
      LabelY: 15
    }
  },
  container: {
    className: 'context-menu'
  },
  arcPath: {
    className: 'context-arc context-node-info-bg'
  },
  sliceIconText: {
    className: 'icon context-icon context-node-info-icon'
  },
  sliceLabelText: {
    className: 'context-arc-label'
  },
  sliceIconLabelText: {
    className: 'context-arc-icon-label'
  },
  circleXPath: {
    className: 'context-circle-x',
    d: 'M -51 -51 L 51 51 M -51 51 L 51 -51'
  },
  outlineCircle: {
    className: 'context-circle'
  },
  labelText: {
    className: 'context-node-label'
  },
  iconRect: {
    className: 'context-node-rect',
    x: -24,
    y: -24,
    width: 48,
    height: 48,
    rx: base.nodeRadius,
    ry: base.nodeRadius
  }
}
