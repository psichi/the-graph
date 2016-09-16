import React, {Component} from 'react'

export default class TheGraphSVGImage extends Component {
  render () {
    const {className, src, x, y, width, height} = this.props

    let html

    html = '<image '
    html = html + 'xlink:href="' + src + '"'
    html = html + 'x="' + x + '"'
    html = html + 'y="' + y + '"'
    html = html + 'width="' + width + '"'
    html = html + 'height="' + height + '"'
    html = html + '/>'

    const groupOptions = {
      className,
      dangerouslySetInnerHTML: {__html: html}
    }

    return (
      <g {...groupOptions} />
    )
  }
}
