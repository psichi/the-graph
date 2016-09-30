// GRAPH
export const GRAPH_ADD_EDGE = 'Graph/ADD_EDGE'
export const GRAPH_CANCEL_PREVIEW = 'Graph/CANCEL_PREVIEW'
export const GRAPH_ANIMATE_EDGES = 'Graph/ANIMATE_EDGES'
export const GRAPH_SELECT_EDGES = 'Graph/SELECT_EDGES'
export const GRAPH_SELECT_NODES = 'Graph/SELECT_NODES'
export const GRAPH_SET_ERROR_NODES = 'Graph/SET_ERROR_NODES'
export const GRAPH_ADD_NODE = 'Graph/ADD_NODE'
export const GRAPH_REMOVE_NODE = 'Graph/REMOVE_NODE'
export const GRAPH_ADD_INPORT = 'Graph/ADD_INPORT'
export const GRAPH_REMOVE_INPORT = 'Graph/REMOVE_INPORT'
export const GRAPH_ADD_OUTPORT = 'Graph/ADD_OUTPORT'
export const GRAPH_REMOVE_OUTPORT = 'Graph/REMOVE_OUTPORT'
export const GRAPH_REMOVE_EDGE = 'Graph/REMOVE_EDGE'

export function showContext(event) {
  return {
    type: 'App/SHOW_CONTEXT',
    payload: event
  }
}

export function onNodeSelection(event) {
  return {
    type: 'Node/SELECTION',
    payload: event
  }
}

export function onEdgeSelection(event) {
  return {
    type: 'Edge/SELECTION',
    payload: event
  }
}
