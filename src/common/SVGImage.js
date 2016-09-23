import React, { Component, PropTypes } from 'react'

export default class TheGraphSVGImage extends Component {
  static propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  }

  render() {
    const { className, src, x, y, width, height } = this.props

    const html = `<image xlink:href="${src}" x="${x}" y="${y}" width="${width}" height="${height}"/>`

    const groupOptions = {
      className,
      dangerouslySetInnerHTML: { __html: html }
    }

    return (
      <g {...groupOptions} />
    )
  }
}
