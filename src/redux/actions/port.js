// PORT
export const PORT_TRACK_END = 'Port/TRACK_END' // dispatch in port

export function onEdgeStart(event) {
  return {
    type: 'Edge/START',
    payload: event
  }
}

export function onEdgeDraw(event) {
  return {
    type: 'Edge/DRAW',
    payload: event
  }
}

export function onEdgeDrop(event) {
  return {
    type: 'Edge/DROP',
    payload: event
  }
}

