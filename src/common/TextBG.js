import React, {Component} from 'react'

export default class TheGraphTextBG extends Component {
  render () {
    var text = this.props.text
    if (!text) {
      text = ''
    }
    var height = this.props.height
    var width = text.length * this.props.height * 2 / 3
    var radius = this.props.height / 2

    var textAnchor = 'start'
    var dominantBaseline = 'central'
    var x = this.props.x
    var y = this.props.y - height / 2

    if (this.props.halign === 'center') {
      x -= width / 2
      textAnchor = 'middle'
    }
    if (this.props.halign === 'right') {
      x -= width
      textAnchor = 'end'
    }

    const bgOptions = {
      className: (this.props.className ? this.props.className : 'text-bg')
    }

    const bgRectOptions = {
      className: 'text-bg-rect',
      x: x,
      y: y,
      rx: radius,
      ry: radius,
      height: height * 1.1,
      width: width
    }

    const bgTextOptions = {
      className: (this.props.textClassName ? this.props.textClassName : 'text-bg-text'),
      x: this.props.x,
      y: this.props.y,
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
