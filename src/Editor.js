// what was originally web component the-graph.html
import React, { Component, PropTypes } from 'react'
import App from './App'

/*
// not sure yet, the editor probably must be about 1 graph.
// then you can integrate many editors within a UI
// so the Editor component should not do more then is needed.

must find out what is listening to the fires and how it is used.
we cannot emit from a react comopnent so it will be a custom dispatch action.

Updating the library etc, is also not part of the editor.
The only task of this editor is to add more functionality to the Graph.
the Graph is meant for displaying a graph.
The editor adds the in-graph functionality.

Basically we do not fire, we will just receive updates from outside.

Not sure what this code is doing.
Most is Polymer wrapping.

I want to convert it to an easy entry point to just mount the editor @root
It also dives into the Graph view to manually call methods.
In able to bring the code to life, there needs to be a nav equivalent in react.
Which is already out of the scope of this React Component.
*/
export default class TheEditor extends Component {
  appView = null
  graphView = null
  selectedNodesHash = {}
  autolayouter = null
  debounceLibraryRefeshTimer = null

  static propTypes = {
    graph: PropTypes.object,
    menus: PropTypes.object,
    library: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    autolayout: PropTypes.bool,
    theme: PropTypes.string,
    editable: PropTypes.bool,
    selectedNodes: PropTypes.array,
    errorNodes: PropTypes.object,
    selectedEdges: PropTypes.array,
    animatedEdges: PropTypes.array,
    getMenuDef: PropTypes.func,
    'pan scale maxZoom': PropTypes.object, // not sure
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    scale: PropTypes.number,
    displaySelectionGroup: PropTypes.bool,
    forceSelection: PropTypes.bool,
    offsetY: PropTypes.number,
    offsetX: PropTypes.number,
    'touch-action': Proptype.string,
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
    selectedNodes: [],
    selectedEdges: [],
    animatedEdges: [],
    errorNodes: {},
    offsetY: null,
    offsetX: null,
    width: 800,
    height: 600,
    editable: true,
    autolayout: false,
    library: {},
    pan: [0, 0],
    scale: 1,
    'touch-action': 'none'
  }

  constructor(props, context) {
    super(props, context)

    this.invokeEdgeSelection = this.invokeEdgeSelection.bind(this)
    this.invokeNodeSelection = this.invokeNodeSelection.bind(this)
    this.invokePanScale = this.invokePanScale.bind(this)
  }

  // note is now in graph where it probably belongs.
  componentDidMount() {
    /*
     // Initializes the autolayouter
     this.autolayouter = klayNoflo.init({
     onSuccess: this.applyAutolayout.bind(this),
     workerScript: "../bower_components/klayjs/klay.js"
     });
     */

    // not necessary..
    // this.themeChanged();
  }

  // can be done with on Props will changed
  // however all this should not happen.
  // if a graph changes the whole editor is removed and a new graph editor will be added.
  // so only make sure these events are installed when mounted.
  // and remove the events when unmounted, easy..
  graphChanged(oldGraph, newGraph) {
    if (oldGraph && oldGraph.removeListener) {
      oldGraph.removeListener('endTransaction', this.fireChanged)
    }
    // Listen for graph changes
    this.graph.on('endTransaction', this.fireChanged.bind(this))

    // Listen for autolayout changes
    if (this.autolayout) {
      this.graph.on('addNode', this.triggerAutolayout.bind(this))
      this.graph.on('removeNode', this.triggerAutolayout.bind(this))
      this.graph.on('addInport', this.triggerAutolayout.bind(this))
      this.graph.on('removeInport', this.triggerAutolayout.bind(this))
      this.graph.on('addOutport', this.triggerAutolayout.bind(this))
      this.graph.on('removeOutport', this.triggerAutolayout.bind(this))
      this.graph.on('addEdge', this.triggerAutolayout.bind(this))
      this.graph.on('removeEdge', this.triggerAutolayout.bind(this))
    }

    if (this.appView) {
      // Remove previous instance
      ReactDOM.unmountComponentAtNode(this.$.svgcontainer)
    }

    // Setup app
    this.$.svgcontainer.innerHTML = ''

    this.appView = ReactDOM.render(
      App({
        graph: this.graph,
        width: this.width,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        height: this.height,
        library: this.library,
        menus: this.menus,
        editable: this.editable,
        onEdgeSelection: this.invokeEdgeSelection.bind(this),
        onNodeSelection: this.invokeNodeSelection.bind(this),
        onPanScale: this.invokePanScale.bind(this),
        getMenuDef: this.getMenuDef,
        displaySelectionGroup: this.displaySelectionGroup,
        forceSelection: this.forceSelection,
        offsetY: this.offsetY,
        offsetX: this.offsetX
      }),
      this.$.svgcontainer
    )
    this.graphView = this.appView.refs.graph
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

  // who is listening for this?
  // a higher level component.
  // so basically this should already use redux.
  // however we do not want to make that choice here.
  // we can make another onEdgeSelection going into editor.
  // which will receive what fire receives.
  // then the outcomponent can choose to send them as redux action. (solved)
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
    // this.fire('edges', this.selectedEdges);
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
    // this.fire('nodes', this.selectedNodes);
  }

  selectedNodesChanged() {
    const selectedNodesHash = {}
    for (let i = 0, len = this.selectedNodes.length; i < len; i++) {
      selectedNodesHash[this.selectedNodes[i].id] = true
    }
    this.selectedNodesHash = selectedNodesHash

    this.selectedNodesHashChanged()
    // this.fire('nodes', this.selectedNodes);
  }

  selectedNodesHashChanged() {
    if (!this.graphView) { return }
    this.graphView.setSelectedNodes(this.selectedNodesHash)
  }

  errorNodesChanged() {
    if (!this.graphView) { return }
    this.graphView.setErrorNodes(this.errorNodes)
  }

  selectedEdgesChanged() {
    if (!this.graphView) { return }
    this.graphView.setSelectedEdges(this.selectedEdges)
    this.fire('edges', this.selectedEdges)
  }

  animatedEdgesChanged() {
    if (!this.graphView) { return }
    this.graphView.setAnimatedEdges(this.animatedEdges)
  }

  fireChanged(event) {
    this.fire('changed', this)
  }

  autolayoutChanged() {
    if (!this.graph) { return }
    // Only listen to changes that affect layout
    if (this.autolayout) {
      this.graph.on('addNode', this.triggerAutolayout.bind(this))
      this.graph.on('removeNode', this.triggerAutolayout.bind(this))
      this.graph.on('addInport', this.triggerAutolayout.bind(this))
      this.graph.on('removeInport', this.triggerAutolayout.bind(this))
      this.graph.on('addOutport', this.triggerAutolayout.bind(this))
      this.graph.on('removeOutport', this.triggerAutolayout.bind(this))
      this.graph.on('addEdge', this.triggerAutolayout.bind(this))
      this.graph.on('removeEdge', this.triggerAutolayout.bind(this))
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
    const portInfo = this.graphView ? this.graphView.portInfo : null
    // Calls the autolayouter
    this.autolayouter.layout({
      'graph': graph,
      'portInfo': portInfo,
      'direction': 'RIGHT',
      'options': {
        'intCoordinates': true,
        'algorithm': 'de.cau.cs.kieler.klay.layered',
        'layoutHierarchy': true,
        'spacing': 36,
        'borderSpacing': 20,
        'edgeSpacingFactor': 0.2,
        'inLayerSpacingFactor': 2.0,
        'nodePlace': 'BRANDES_KOEPF',
        'nodeLayering': 'NETWORK_SIMPLEX',
        'edgeRouting': 'POLYLINE',
        'crossMin': 'LAYER_SWEEP',
        'direction': 'RIGHT'
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
    if (this.appView) {
      this.appView.triggerFit()
    }
  }

  widthChanged() {
    if (!this.appView) { return }
    this.appView.setState({
      width: this.width
    })
  }

  heightChanged() {
    if (!this.appView) { return }
    this.appView.setState({
      height: this.height
    })
  }

  updateIcon(nodeId, icon) {
    if (!this.graphView) { return }
    this.graphView.updateIcon(nodeId, icon)
  }

  rerender(options) {
    // This is throttled with rAF internally
    if (!this.graphView) { return }
    this.graphView.markDirty(options)
  }

  addNode(id, component, metadata) {
    if (!this.graph) { return }
    this.graph.addNode(id, component, metadata)
  }

  getPan() {
    if (!this.appView) {
      return [0, 0]
    }
    return [this.appView.state.x, this.appView.state.y]
  }

  panChanged() {
    // Send pan back to React
    if (!this.appView) { return }
    this.appView.setState({
      x: this.pan[0],
      y: this.pan[1]
    })
  }

  getScale() {
    if (!this.appView) {
      return 1
    }
    return this.appView.state.scale
  }

  displaySelectionGroupChanged() {
    if (!this.graphView) { return }
    this.graphView.setState({
      displaySelectionGroup: this.displaySelectionGroup
    })
  }

  forceSelectionChanged() {
    if (!this.graphView) { return }
    this.graphView.setState({
      forceSelection: this.forceSelection
    })
  }

  focusNode(node) {
    this.appView.focusNode(node)
  }

  menusChanged() {
    // Only if the object itself changes,
    // otherwise builds menu from reference every time menu shown
    if (!this.appView) { return }
    this.appView.setProps({ menus: this.menus })
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

    // do not create svg, svg belongs to graph, yet it will need our theme.
    return (
      <svg {...svgOptions}>
        <App {...appOptions} />
      </svg>
    )
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
