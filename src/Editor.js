// what was originally web component the-graph.html
import React, { Component, PropTypes } from 'react'

import {
  addNode,
  animatedEdgesChanged,
  applyAutolayout,
  autolayoutChanged,
  componentDidMount,
  debounceLibraryRefresh,
  displaySelectionGroupChanged,
  errorNodesChanged,
  fire,
  fireChanged,
  focusNode,
  forceSelectionChanged,
  getComponent,
  getPan,
  getScale,
  graphChanged,
  heightChanged,
  invokeEdgeSelection,
  invokeNodeSelection,
  invokePanScale,
  menusChanged,
  panChanged,
  render,
  rerender,
  selectedEdgesChanged,
  selectedNodesChanged,
  selectedNodesHashChanged,
  triggerAutolayout,
  triggerFit,
  updateIcon,
  widthChanged,
} from './Editor/'

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

  addNode = this::addNode
  animatedEdgesChanged = this::animatedEdgesChanged
  applyAutolayout = this::applyAutolayout
  autolayoutChanged = this::autolayoutChanged
  componentDidMount = this::componentDidMount
  debounceLibraryRefresh = this::debounceLibraryRefresh
  displaySelectionGroupChanged = this::displaySelectionGroupChanged
  errorNodesChanged = this::errorNodesChanged
  fire = this::fire
  fireChanged = this::fireChanged
  focusNode = this::focusNode
  forceSelectionChanged = this::forceSelectionChanged
  getComponent = this::getComponent
  getPan = this::getPan
  getScale = this::getScale
  graphChanged = this::graphChanged
  heightChanged = this::heightChanged
  invokeEdgeSelection = this::invokeEdgeSelection
  invokeNodeSelection = this::invokeNodeSelection
  invokePanScale = this::invokePanScale
  menusChanged = this::menusChanged
  panChanged = this::panChanged
  render = this::render
  rerender = this::rerender
  selectedEdgesChanged = this::selectedEdgesChanged
  selectedNodesChanged = this::selectedNodesChanged
  selectedNodesHashChanged = this::selectedNodesHashChanged
  triggerAutolayout = this::triggerAutolayout
  triggerFit = this::triggerFit
  updateIcon = this::updateIcon
  widthChanged = this::widthChanged
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
