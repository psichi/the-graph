// NODE
export const NODE_KEY_DOWN = 'Node/KEY_DOWN'
export const NODE_KEY_UP = 'Node/KEY_UP'
export const NODE_SHOW_CONTEXT = 'Node/SHOW_CONTEXT'
export const NODE_SELECTION = 'Node/SELECTION'
export const NODE_TRACK_START = 'Node/TRACK_START'
export const NODE_TRACK = 'Node/TRACK'
export const NODE_TRACK_END = 'Node/TRACK_END'

export function showContext(event) {
  return {
    type: 'Node/SHOW_CONTEXT',
    payload: event
  }
}

export function onTrack(event) {
  return {
    type: 'Node/TRACK',
    payload: event
  }
}

export function onTrackStart(event) {
  return {
    type: 'Node/TRACK_START',
    payload: event
  }
}

export function onTrackEnd(event) {
  return {
    type: 'Node/TRACK_END',
    payload: event
  }
}

export function onNodeSelection(event) {
  return {
    type: 'Node/SELECTION',
    payload: event
  }
}
