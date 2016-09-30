// APP
export const APP_UNSELECT_ALL = 'App/UNSELECT_ALL'
export const APP_TRACK_START = 'App/TRACK_START'
export const APP_TRANSFORM_START = 'App/TRANSFORM_START'
export const APP_TRANSFORM = 'App/TRANSFORM'
export const APP_TRANSFORM_END = 'App/TRANSFORM_END'
export const APP_WHEEL = 'App/WHEEL'
export const APP_CHANGE_TOOLTIP = 'App/CHANGE_TOOLTIP'
export const APP_HIDE_TOOLTIP = 'App/HIDE_TOOLTIP'
export const APP_SHOW_CONTEXT = 'App/SHOW_CONTEXT'
export const APP_HIDE_CONTEXT = 'App/HIDE_CONTEXT'
export const APP_KEY_DOWN = 'App/KEY_DOWN'
export const APP_KEY_UP = 'App/KEY_UP'
export const APP_AUTOLAYOUT = 'App/AUTOLAYOUT'

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

export function onPanScale(event) {
  return {
    type: 'App/PAN_SCALE',
    payload: event
  }
}
