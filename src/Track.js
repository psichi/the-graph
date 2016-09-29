import React, {
  Children,
  cloneElement,
  Component,
  PropTypes
} from 'react'
import { findDOMNode } from 'react-dom'

function getPointerId() {
  return 1
}

/*
p.tracking
p.downEvent.pageX
p.downEvent.pageY
*/

function log(type, inEvent) {
  // console.log('EVENT %s', type, Object.keys(inEvent))
}

function clampDir(inDelta) {
  return inDelta > 0 ? 1 : -1
}

function calcPositionDelta(inA, inB) {
  let x = 0
  let y = 0

  if (inA && inB) {
    x = inB.pageX - inA.pageX
    y = inB.pageY - inA.pageY
  }

  return { x, y }
}

export default class Track extends Component {
  WIGGLE_THRESHOLD = 4

  pointermap = new Map()

  // just add the equivalent as props

  events = {
    /*
    trackStart: ['pointerdown', 'mousedown', 'touchdown'],
    track: ['pointermove', 'mousemove', 'touchmove'],
    trackEnd: ['pointerup', 'mouseup', 'touchend'],
    */
    pointerdown: ['pointerdown', 'mousedown', 'touchdown'],
    pointermove: ['pointermove', 'mousemove', 'touchmove'],
    pointerup: ['pointerup', 'mouseup', 'touchend'],
    cancel: ['pointercancel'] // TODO
  }

  static defaultProps = {
    onTrack() {},
    onTrackStart() {},
    onTrackEnd() {},
    container: document
  }

  static propTypes = {
    onTrack: PropTypes.func,
    onTrackStart: PropTypes.func,
    onTrackEnd: PropTypes.func,
    container: PropTypes.object
  }

  constructor(props, context) {
    super(props, context)

    this.pointerdown = this.pointerdown.bind(this)
    this.pointerup = this.pointerup.bind(this)
    this.pointermove = this.pointermove.bind(this)
  }

  render() {
    // const {children, onTrack, onTrackEnd, onTrackStart} = this.props
    const { children } = this.props
    const { onTrack, onTrackEnd, onTrackStart } = this

    const clone = cloneElement(Children.only(children), {
      onMouseDown: this.pointerdown,
      onTouchStart: this.pointerdown
      /*
      onMouseMove: this.pointermove,
      onTouchMove: this.pointermove,
      onMouseUp: this.pointerup,
      onTouchEnd: this.pointerup
      */
    })

    return clone
  }

  fireTrack(inType, inEvent, inTrackingData) {
    const t = inTrackingData
    const d = calcPositionDelta(t.downEvent, inEvent)
    const dd = calcPositionDelta(t.lastMoveEvent, inEvent)

    if (dd.x) {
      t.xDirection = clampDir(dd.x)
    }

    if (dd.y) {
      t.yDirection = clampDir(dd.y)
    }

    const trackData = {
      dx: d.x,
      dy: d.y,
      ddx: dd.x,
      ddy: dd.y,
      clientX: inEvent.clientX,
      clientY: inEvent.clientY,
      pageX: inEvent.pageX,
      pageY: inEvent.pageY,
      screenX: inEvent.screenX,
      screenY: inEvent.screenY,
      xDirection: t.xDirection,
      yDirection: t.yDirection,
      trackInfo: t.trackInfo,
      relatedTarget: inEvent.target,
      pointerType: inEvent.pointerType,
      pointerId: getPointerId(inEvent.pointerId)
    }

    // const e = dispatcher.makeEvent(inType, trackData)

    t.lastMoveEvent = inEvent

    // dispatcher.dispatchEvent(e, t.downTarget)
    this.props[inType](inEvent, trackData)
  }

  pointerdown(inEvent) {
    log('pointerdown', inEvent)
    inEvent.persist()
    inEvent.stopPropagation()
    // if (inEvent.isPrimary && (inEvent.pointerType === 'mouse' ? inEvent.buttons === 1 : true)) {
    const p = {
      downEvent: inEvent,
      downTarget: inEvent.target,
      trackInfo: {},
      lastMoveEvent: null,
      xDirection: 0,
      yDirection: 0,
      tracking: false
    }

    this.pointermap.set(getPointerId(inEvent), p)

    document.addEventListener('mouseup', this.pointerup)
    document.addEventListener('mousemove', this.pointermove)
    // }
  }

  pointermove(inEvent) {
    log('pointermove', inEvent)
    const p = this.pointermap.get(getPointerId(inEvent.pointerId))

    if (p) {
      if (!p.tracking) {
        const d = calcPositionDelta(p.downEvent, inEvent)
        const move = d.x * d.x + d.y * d.y

        // start tracking only if finger moves more than WIGGLE_THRESHOLD
        if (move > this.WIGGLE_THRESHOLD) {
          p.tracking = true
          this.fireTrack('onTrackStart', p.downEvent, p)
          this.fireTrack('onTrack', inEvent, p)
        }
      } else {
        this.fireTrack('onTrack', inEvent, p)
      }
    }
  }

  pointerup(inEvent) {
    log('pointerup', inEvent)
    const p = this.pointermap.get(getPointerId(inEvent.pointerId))

    if (p) {
      if (p.tracking) {
        this.fireTrack('onTrackEnd', inEvent, p)
      }
      this.pointermap.delete(getPointerId(inEvent.pointerId))
    }

    document.removeEventListener('mouseup', this.pointerup)
    document.removeEventListener('mousemove', this.pointermove)
  }

  pointercancel(inEvent) {
    log('pointercancel', inEvent)
    this.pointerup(inEvent)
  }
}
