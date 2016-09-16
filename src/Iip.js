import React, {Component} from 'react'
import Config from './Config'
import {
  IIPPath,
  IIPText,
  IIPContainer
} from './factories/iip'

// Edge view
export default class TheGraphIIP extends Component {
  static propTypes: {
    x: PropTypes.number,
    y: PropTypes.number,
    label: PropTypes.string
  }

  shouldComponentUpdate (nextProps) {
    const {x, y, label} = this.props

    // Only re-render if changed
    return (
      nextProps.x !== x ||
      nextProps.y !== y ||
      nextProps.label !== label
    )
  }

  render () {
    const {x, y, label: title} = this.props

    const path = [
      'M', x, y,
      'L', x - 10, y
    ].join(' ')

    // Make a string
    let text

    // TODO make this smarter with ZUI
    text = title + ' '
    if (text.length > 12) {
      text = text.slice(0, 9) + '...'
    }

    const pathOptions = {
      ...Config.iip.path,
      d: path
    }

    const textOptions = {
      ...Config.iip.text,
      x: x - 10,
      y: y,
      text
    }

    const containerOptions = {
      ...Config.iip.container,
      title
    }

    return (
      <IIPContainer {...containerOptions}>
        <IIPPath {...pathOptions} />
        <IIPText {...textOptions} />
      </IIPContainer>
    )
  }
}
