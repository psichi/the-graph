import React from 'react'
import { findDOMNode } from 'react-dom'
import Config from '../Config'
import Track from '../Track'

import {
  AppGraph,
  AppSvgGroup,
  AppModalGroup,
  AppSvg,
  AppCanvas,
  AppContainer,
  AppTooltip
} from '../factories/app'

export default function render() {
  // console.timeEnd('App.render');
  // console.time('App.render');
  const {
    graph,
    library,
    getMenuDef,
    onNodeSelection,
    onEdgeSelection,
    theme,
    onEdgeStart,
    onEdgeDraw,
    onEdgeDrop
  } = this.props
  const { scale, x, y, tooltip, tooltipX, tooltipY, tooltipVisible, width, height } = this.state

  if (!this.layoutReady) {
    // first render is still empty, would prefer if first render
    // occurs when autolayout is done.
    // which would be possible if layout was not triggered from within the app.
    return null
  }

  const transform = `matrix(${scale},0,0,${scale},${x},${y})`

  const scaleClass = scale > Config.base.zbpBig ? 'big' : (scale > Config.base.zbpNormal ? 'normal' : 'small')

  const contextModal = this.getContextModal()

  const graphElementOptions = {
    ...Config.app.graph,
    graph,
    scale,
    app: this,
    library,
    onNodeSelection,
    onEdgeSelection,
    onEdgeStart,
    onEdgeDraw,
    onEdgeDrop,
    showContext: this.showContext
  }

  const svgGroupOptions = {
    ...Config.app.svgGroup,
    transform
  }

  const tooltipOptions = {
    ...Config.app.tooltip,
    x: tooltipX,
    y: tooltipY,
    visible: tooltipVisible,
    label: tooltip
  }

  const modalGroupOptions = {
    ...Config.app.modal
  }

  const svgOptions = {
    ...Config.app.svg,
    width,
    height
  }

  const canvasOptions = {
    ...Config.app.canvas,
    width,
    height
  }

  const containerOptions = {
    ...Config.app.container,
    style: {
      width,
      height
    }
  }

  containerOptions.className += ` ${scaleClass}`

  const themeWrapperOptions = {
    id: 'svgcontainer',
    className: theme
  }

  delete canvasOptions.ref

  return (
    <Track onTrack={this.onTrack}>
      <div {...themeWrapperOptions} onWheel={this.onWheel}>
        <AppContainer {...containerOptions}>
          <canvas {...canvasOptions} ref={this.setBgContext} />
          <AppSvg {...svgOptions}>
            <AppSvgGroup {...svgGroupOptions}>
              <AppGraph {...graphElementOptions} />
            </AppSvgGroup>
            <AppTooltip {...tooltipOptions} />
            <AppModalGroup {...modalGroupOptions}>
              {contextModal}
            </AppModalGroup>
          </AppSvg>
        </AppContainer>
      </div>
    </Track>
  )
}
