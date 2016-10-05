import React from 'react'
import App from '../App'

export default function render() {
  const {
    graph,
    width,
    minZoom,
    maxZoom,
    height,
    library,
    menus,
    editable,
    displaySelectionGroup,
    getMenuDef,
    forceSelection,
    offsetY,
    offsetX,
    onEdgeStart,
    onEdgeDraw,
    onEdgeDrop
  } = this.props

  const appOptions = {
    ref: 'appView',
    graph,
    width,
    minZoom,
    maxZoom,
    height,
    library,
    menus,
    editable,
    onEdgeSelection: this.invokeEdgeSelection,
    onNodeSelection: this.invokeNodeSelection,
    onEdgeStart,
    onEdgeDraw,
    onEdgeDrop,
    onPanScale: this.invokePanScale,
    getMenuDef,
    displaySelectionGroup,
    forceSelection,
    offsetY,
    offsetX
  }

  return <App {...appOptions} />
}
