import React, {Component, PropTypes} from 'react'

export default class TheGraphTextBG extends Component {
  static propTypes = {
    text: PropTypes.string,
    height: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    halign: PropTypes.string,
    className: PropTypes.string,
    textClassName: PropTypes.string
  }

  render () {
    const {height, x: propX, y: propY, halign, className, textClassName} = this.props
    let {text} = this.props

    if (!text) {
      text = ''
    }

    const width = text.length * height * 2 / 3
    const radius = height / 2

    const y = propY - height / 2
    let x = propX

    if (halign === 'center') {
      x -= width / 2
    }

    if (halign === 'right') {
      x -= width
    }

    const bgOptions = {
      className: (className ? className : 'text-bg')
    }

    const bgRectOptions = {
      className: 'text-bg-rect',
      x,
      y,
      rx: radius,
      ry: radius,
      height: height * 1.1,
      width
    }

    const bgTextOptions = {
      className: (textClassName ? textClassName : 'text-bg-text'),
      x: propX,
      y: propY
    }

    return (
      <g {...bgOptions} >
        <rect {...bgRectOptions} />
        <text {...bgTextOptions}>
          {text}
        </text>
      </g>
    )
  }
}
