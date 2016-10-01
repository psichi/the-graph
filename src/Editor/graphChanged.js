// is not executed now.
export default function graphChanged(oldGraph, newGraph) {
  if (oldGraph && oldGraph.removeListener) {
    oldGraph.removeListener('endTransaction', this.fireChanged)
  }
  // Listen for graph changes
  this.graph.on('endTransaction', this.fireChanged)

  // Listen for autolayout changes
  if (this.autolayout) {
    this.graph.on('addNode', this.triggerAutolayout)
    this.graph.on('removeNode', this.triggerAutolayout)
    this.graph.on('addInport', this.triggerAutolayout)
    this.graph.on('removeInport', this.triggerAutolayout)
    this.graph.on('addOutport', this.triggerAutolayout)
    this.graph.on('removeOutport', this.triggerAutolayout)
    this.graph.on('addEdge', this.triggerAutolayout)
    this.graph.on('removeEdge', this.triggerAutolayout)
  }

  if (this.refs.appView) {
    // Remove previous instance
    ReactDOM.unmountComponentAtNode(this.$.svgcontainer)
  }

  // Setup app
  this.$.svgcontainer.innerHTML = ''

  this.refs.appView = ReactDOM.render(
    App({
      graph: this.graph,
      width: this.width,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      height: this.height,
      library: this.library,
      menus: this.menus,
      editable: this.editable,
      onEdgeSelection: this.invokeEdgeSelection,
      onNodeSelection: this.invokeNodeSelection,
      onPanScale: this.invokePanScale,
      getMenuDef: this.getMenuDef,
      displaySelectionGroup: this.displaySelectionGroup,
      forceSelection: this.forceSelection,
      offsetY: this.offsetY,
      offsetX: this.offsetX
    }),
    this.$.svgcontainer
  )

  // this.graphView = this.refs.appView.refs.graph
}
