import React, {Component} from 'react'

export default class TheGraphTextBG extends Component {
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
      y: propY,
      children: text
    }

    return (
      <g {...bgOptions} >
        <rect {...bgRectOptions} />
        <text {...bgTextOptions} />
      </g>
    )

    /*
     return ReactDOM.g(
     {
     className: (this.props.className ? this.props.className : 'text-bg'),
     },
     ReactDOM.rect({
     className: 'text-bg-rect',
     x: x,
     y: y,
     rx: radius,
     ry: radius,
     height: height * 1.1,
     width: width
     }),
     ReactDOM.text({
     className: (this.props.textClassName ? this.props.textClassName : 'text-bg-text'),
     x: this.props.x,
     y: this.props.y,
     children: text
     })
     );
     */
  }
}
