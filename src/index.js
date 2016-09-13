import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../themes/the-graph-dark.css';

const graph = {
  nodes: []
}

const props = {
  graph,
  width: 800,
  minZoom: 0.15,
  maxZoom: 15,
  height: 600,
  library: null,
  menus: null,
  editable: true,
  onEdgeSelection: () => {},
  onNodeSelection: () => {},
  onPanScale: () => {},
  getMenuDef: () => {},
  displaySelectionGroup: () => {},
  forceSelection: false,
  offsetY: null,
  offsetX: null
}

ReactDOM.render(
  <App {...props} />,
  document.getElementById('root')
);

