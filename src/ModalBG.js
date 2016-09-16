import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Config from './Config'
import {
  createModalBackgroundGroup,
  createModalBackgroundRect
} from './factories/modalBG'

export default class TheGraphModalBG extends Component {
  constructor (props, context) {
    super(props, context)

    this.onDown = this.onDown.bind(this)
  }
  componentDidMount () {
    const domNode = findDOMNode(this)

    // Right-click on another item will show its menu
    domNode.addEventListener('down', this.onDown)
  }

  onDown (event) {
    const {rect} = this.refs

    // Only if outside of menu
    if (event && event.target === rect) {
      this.hideModal()
    }
  }

  hideModal (/* event */) {
    this.props.triggerHideContext()
  }

  render () {
    const {width, height, children} = this.props

    const rectOptions = {
      ...Config.modalBG.rect,
      width,
      height
    }

    const containerOptions = {
      ...Config.modalBG.container
    }

    const rect = createModalBackgroundRect(rectOptions)

    const containerContents = [rect, children]

    return createModalBackgroundGroup(containerOptions, containerContents)
  }
};
