import React, {Component} from 'react'

export default class TheGraphSVGImage extends Component {
  render () {
    var html = '<image '
    html = html + 'xlink:href="' + this.props.src + '"'
    html = html + 'x="' + this.props.x + '"'
    html = html + 'y="' + this.props.y + '"'
    html = html + 'width="' + this.props.width + '"'
    html = html + 'height="' + this.props.height + '"'
    html = html + '/>'

    const groupOptions = {
      className: this.props.className,
      dangerouslySetInnerHTML: {__html: html}
    }

    console.log('SVG Image', this.props, groupOptions)
    return (
      <g {...groupOptions} />
    )
  }
}
