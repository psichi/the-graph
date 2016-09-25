// what was originally web component the-graph.html
import React, { Component, PropTypes } from 'react'
import App from './App'

export default class TheEditor extends Component {
  appView = null
  graphView = null
  selectedNodesHash = {}
  autolayouter = null
  debounceLibraryRefeshTimer = null
  pan = [0, 0]

  selectedNodes = []
  selectedEdges = []
  animatedEdges = []
  scale = 1
  errorNodes = {}

  static propTypes = {
    graph: PropTypes.object,
    menus: PropTypes.object,
    library: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    autolayout: PropTypes.bool,
    theme: PropTypes.string,
    editable: PropTypes.bool,
    getMenuDef: PropTypes.func,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    displaySelectionGroup: PropTypes.bool,
    forceSelection: PropTypes.bool,
    offsetY: PropTypes.number,
    offsetX: PropTypes.number,
    'touch-action': PropTypes.string,
    grid: PropTypes.number,
    snap: PropTypes.number
  }

  static defaultProps = {
    theme: 'dark',
    graph: null,
    menus: null,
    minZoom: 0.15,
    maxZoom: 15,
    grid: 72,
    snap: 36,
    displaySelectionGroup: true,
    forceSelection: false,
    offsetY: null,
    offsetX: null,
    width: 800,
    height: 600,
    editable: true,
    autolayout: false,
    library: {},
    'touch-action': 'none'
  }

  constructor(props, context) {
    super(props, context)

    this.invokeEdgeSelection = this.invokeEdgeSelection.bind(this)
    this.invokeNodeSelection = this.invokeNodeSelection.bind(this)
    this.invokePanScale = this.invokePanScale.bind(this)
    this.triggerAutoLayout = this.triggerAutolayout.bind(this)
    this.fireChanged = this.fireChanged.bind(this)
  }

  // note is now in graph where it probably belongs.
  componentDidMount() {
    // not necessary..
    // this.themeChanged();
  }

  fire(type, event) {
    console.log('TODO: FIRE %s', type, event)
  }

  // is not executed now.
  //
  graphChanged(oldGraph, newGraph) {
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

  // this should update and be within state
  invokePanScale(x, y, scale) {
    const { onPanScale } = this.props

    this.pan[0] = x
    this.pan[1] = y
    this.scale = scale

    if (onPanScale) {
      onPanScale({ x, y, scale })
    }
  }

  invokeEdgeSelection(itemKey, item, toggle) {
    const { onEdgeSelection } = this.props

    if (itemKey === undefined) {
      if (this.selectedEdges.length > 0) {
        this.selectedEdges = []
      }
      this.fire('edges', this.selectedEdges)
      return
    }
    if (toggle) {
      const index = this.selectedEdges.indexOf(item)
      const isSelected = (index !== -1)
      const shallowClone = this.selectedEdges.slice()
      if (isSelected) {
        shallowClone.splice(index, 1)
        this.selectedEdges = shallowClone
      } else {
        shallowClone.push(item)
        this.selectedEdges = shallowClone
      }
    } else {
      this.selectedEdges = [item]
    }

    if (onEdgeSelection) {
      onEdgeSelection(this.selectedEdges)
    }

    this.fire('edges', this.selectedEdges);
  }

  invokeNodeSelection(itemKey, item, toggle) {
    const { onNodeSelection } = this.props

    if (itemKey === undefined) {
      this.selectedNodes = []
    } else if (toggle) {
      const index = this.selectedNodes.indexOf(item)
      const isSelected = (index !== -1)
      if (isSelected) {
        this.selectedNodes.splice(index, 1)
      } else {
        this.selectedNodes.push(item)
      }
    } else {
      this.selectedNodes = [item]
    }

    this.selectedNodesChanged()

    if (onNodeSelection) {
      onNodeSelection(this.selectedNodes)
    }

    this.fire('nodes', this.selectedNodes);
  }

  selectedNodesChanged() {
    const selectedNodesHash = {}
    for (let i = 0, len = this.selectedNodes.length; i < len; i++) {
      selectedNodesHash[this.selectedNodes[i].id] = true
    }
    this.selectedNodesHash = selectedNodesHash

    this.selectedNodesHashChanged()

    this.fire('nodes', this.selectedNodes);
  }

  selectedNodesHashChanged() {
    if (!this.refs.appView.refs.graph) { return }

    this.refs.appView.refs.graph.setSelectedNodes(this.selectedNodesHash)
  }

  errorNodesChanged() {
    if (!this.refs.appView.refs.graph) { return }

    this.refs.appView.refs.graph.setErrorNodes(this.errorNodes)
  }

  selectedEdgesChanged() {
    if (!this.refs.appView.refs.graph) { return }

    this.refs.appView.refs.graph.setSelectedEdges(this.selectedEdges)

    this.fire('edges', this.selectedEdges)
  }

  animatedEdgesChanged() {
    if (!this.refs.appView.refs.graph) { return }

    this.refs.appView.refs.graph.setAnimatedEdges(this.animatedEdges)
  }

  fireChanged(event) {
    this.fire('changed', this)
  }

  autolayoutChanged() {
    if (!this.graph) { return }
    // Only listen to changes that affect layout
    if (this.autolayout) {
      this.graph.on('addNode', this.triggerAutolayou)
      this.graph.on('removeNode', this.triggerAutolayout)
      this.graph.on('addInport', this.triggerAutolayout)
      this.graph.on('removeInport', this.triggerAutolayout)
      this.graph.on('addOutport', this.triggerAutolayout)
      this.graph.on('removeOutport', this.triggerAutolayout)
      this.graph.on('addEdge', this.triggerAutolayout)
      this.graph.on('removeEdge', this.triggerAutolayout)
    } else {
      this.graph.removeListener('addNode', this.triggerAutolayout)
      this.graph.removeListener('removeNode', this.triggerAutolayout)
      this.graph.removeListener('addInport', this.triggerAutolayout)
      this.graph.removeListener('removeInport', this.triggerAutolayout)
      this.graph.removeListener('addOutport', this.triggerAutolayout)
      this.graph.removeListener('removeOutport', this.triggerAutolayout)
      this.graph.removeListener('addEdge', this.triggerAutolayout)
      this.graph.removeListener('removeEdge', this.triggerAutolayout)
    }
  }

  triggerAutolayout(event) {
    const graph = this.graph
    const portInfo = this.refs.appView.refs.graph ? this.appview.refs.graph.portInfo : null
    // Calls the autolayouter
    this.autolayouter.layout({
      graph,
      portInfo,
      direction: 'RIGHT',
      options: {
        intCoordinates: true,
        algorithm: 'de.cau.cs.kieler.klay.layered',
        layoutHierarchy: true,
        spacing: 36,
        borderSpacing: 20,
        edgeSpacingFactor: 0.2,
        inLayerSpacingFactor: 2.0,
        nodePlace: 'BRANDES_KOEPF',
        nodeLayering: 'NETWORK_SIMPLEX',
        edgeRouting: 'POLYLINE',
        crossMin: 'LAYER_SWEEP',
        direction: 'RIGHT'
      }
    })
  }

  applyAutolayout(layoutedKGraph) {
    this.graph.startTransaction('autolayout')

    // Update original graph nodes with the new coordinates from KIELER graph
    const children = layoutedKGraph.children.slice()

    let i, len
    for (i = 0, len = children.length; i < len; i++) {
      const klayNode = children[i]
      const nofloNode = this.graph.getNode(klayNode.id)

      // Encode nodes inside groups
      if (klayNode.children) {
        const klayChildren = klayNode.children
        let idx
        for (idx in klayChildren) {
          const klayChild = klayChildren[idx]
          if (klayChild.id) {
            this.graph.setNodeMetadata(klayChild.id, {
              x: Math.round((klayNode.x + klayChild.x) / this.snap) * this.snap,
              y: Math.round((klayNode.y + klayChild.y) / this.snap) * this.snap
            })
          }
        }
      }

      // Encode nodes outside groups
      if (nofloNode) {
        this.graph.setNodeMetadata(klayNode.id, {
          x: Math.round(klayNode.x / this.snap) * this.snap,
          y: Math.round(klayNode.y / this.snap) * this.snap
        })
      } else {
        // Find inport or outport
        const idSplit = klayNode.id.split(':::')
        const expDirection = idSplit[0]
        const expKey = idSplit[1]
        if (expDirection === 'inport' && this.graph.inports[expKey]) {
          this.graph.setInportMetadata(expKey, {
            x: Math.round(klayNode.x / this.snap) * this.snap,
            y: Math.round(klayNode.y / this.snap) * this.snap
          })
        } else if (expDirection === 'outport' && this.graph.outports[expKey]) {
          this.graph.setOutportMetadata(expKey, {
            x: Math.round(klayNode.x / this.snap) * this.snap,
            y: Math.round(klayNode.y / this.snap) * this.snap
          })
        }
      }
    }

    this.graph.endTransaction('autolayout')

    // Fit to window
    this.triggerFit()
  }

  triggerFit() {
    if (this.refs.appView) {
      this.refs.appView.triggerFit()
    }
  }

  widthChanged() {
    if (!this.refs.appView) { return }
    this.refs.appView.setState({
      width: this.width
    })
  }

  heightChanged() {
    if (!this.refs.appView) { return }
    this.refs.appView.setState({
      height: this.height
    })
  }

  updateIcon(nodeId, icon) {
    if (!this.refs.appView.refs.graph) { return }
    this.refs.appView.refs.graph.updateIcon(nodeId, icon)
  }

  rerender(options) {
    // This is throttled with rAF internally
    if (!this.refs.appView.refs.graph) { return }
    this.refs.appView.refs.graph.markDirty(options)
  }

  addNode(id, component, metadata) {
    if (!this.graph) { return }
    this.graph.addNode(id, component, metadata)
  }

  getPan() {
    if (!this.refs.appView) {
      return [0, 0]
    }
    return [this.refs.appView.state.x, this.refs.appView.state.y]
  }

  panChanged() {
    // Send pan back to React
    if (!this.refs.appView) { return }
    this.refs.appView.setState({
      x: this.pan[0],
      y: this.pan[1]
    })
  }

  getScale() {
    if (!this.refs.appView) {
      return 1
    }
    return this.refs.appView.state.scale
  }

  displaySelectionGroupChanged() {
    if (!this.refs.appView.refs.graph) { return }
    this.refs.appView.refs.graph.setState({
      displaySelectionGroup: this.displaySelectionGroup
    })
  }

  forceSelectionChanged() {
    if (!this.refs.appView.refs.graph) { return }
    this.refs.appView.refs.graph.setState({
      forceSelection: this.forceSelection
    })
  }

  focusNode(node) {
    this.refs.appView.focusNode(node)
  }

  menusChanged() {
    // Only if the object itself changes,
    // otherwise builds menu from reference every time menu shown
    if (!this.refs.appView) { return }
    this.refs.appView.setProps({ menus: this.menus })
  }

  debounceLibraryRefesh() {
    // Breaking the "no debounce" rule, this fixes #76 for subgraphs
    if (this.debounceLibraryRefeshTimer) {
      clearTimeout(this.debounceLibraryRefeshTimer)
    }
    this.debounceLibraryRefeshTimer = setTimeout(() => {
      this.rerender({ libraryDirty: true })
    }, 200)
  }

  getComponent(name) {
    return this.library[name]
  }

  render() {
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
      offsetX
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
      onPanScale: this.invokePanScale,
      getMenuDef,
      displaySelectionGroup,
      forceSelection,
      offsetY,
      offsetX
    }

    return <App {...appOptions} />
  }
}

/* Stuff which does not belong in the editor, but higher up
 mergeComponentDefinition (component, definition) {
 // In cases where a component / subgraph ports change,
 // we don't want the connections hanging in middle of node
 // TODO visually indicate that port is a ghost
 if (component === definition) {
 return definition;
 }
 var _i, _j, _len, _len1, exists;
 var cInports = component.inports;
 var dInports = definition.inports;

 if (cInports !== dInports) {
 for (_i = 0, _len = cInports.length; _i < _len; _i++) {
 var cInport = cInports[_i];
 exists = false;
 for (_j = 0, _len1 = dInports.length; _j < _len1; _j++) {
 var dInport = dInports[_j];
 if (cInport.name === dInport.name) {
 exists = true;
 }
 }
 if (!exists) {
 dInports.push(cInport);
 }
 }
 }

 var cOutports = component.outports;
 var dOutports = definition.outports;

 if (cOutports !== dOutports) {
 for (_i = 0, _len = cOutports.length; _i < _len; _i++) {
 var cOutport = cOutports[_i];
 exists = false;
 for (_j = 0, _len1 = dOutports.length; _j < _len1; _j++) {
 var dOutport = dOutports[_j];
 if (cOutport.name === dOutport.name) {
 exists = true;
 }
 }
 if (!exists) {
 dOutports.push(cOutport);
 }
 }
 }

 if (definition.icon !== 'cog') {
 // Use the latest icon given
 component.icon = definition.icon;
 } else {
 // we should use the icon from the library
 definition.icon = component.icon;
 }
 // a component could also define a svg icon
 definition.iconsvg = component.iconsvg;

 return definition;
 }

 registerComponent (definition, generated) {
 var component = this.library[definition.name];
 var def = definition;
 if (component) {
 if (generated) {
 // Don't override real one with generated dummy
 return;
 }
 def = this.mergeComponentDefinition(component, definition);
 }
 this.library[definition.name] = def;
 // So changes are rendered
 this.debounceLibraryRefesh();
 }
 toJSON () {
 if (!this.graph) { return {}; }
 return this.graph.toJSON();
 }
 themeChanged () {
 this.$.svgcontainer.className = "the-graph-"+this.theme;
 }

 */
