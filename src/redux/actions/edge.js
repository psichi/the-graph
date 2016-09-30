// EDGE
export const EDGE_START = 'Edge/START' // dispatch in port
export const EDGE_DROP = 'Edge/DROP' // dispatch in port
export const EDGE_SHOW_CONTEXT = 'Edge/SHOW_CONTEXT'
export const EDGE_SELECTION = 'Edge/SELECTION'
export const EDGE_TRACK_START = 'Edge/TRACK_START'

export function onEdgeSelection(event) {
  return {
    type: 'Edge/SELECTION',
    payload: event
  }
}
