import React, {
  Children,
  cloneElement,
  Component,
  PropTypes
} from 'react'
import {findDOMNode} from 'react-dom'

// probably better do something with react-tap-event plugin

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

  return {x, y}
}

export default class Track extends Component {
  WIGGLE_THRESHOLD = 4

  pointermap = new Map()

  // just add the equivalent as props

  events = {
    trackStart: ['pointerdown', 'mousedown', 'touchdown'],
    track: ['pointermove','mousemove', 'touchmove'],
    trackEnd: ['pointerup', 'mouseup', 'touchend'],
    cancel: ['pointercancel'] // TODO
  }

  static propTypes = {
    onTrack: PropTypes.func,
    onTrackStart: PropTypes.func,
    onTrackEnd: PropTypes.func
  }

  constructor (props, context) {
    super(props, context)

    this.onTrack = this.onTrack.bind(this)
    this.onTrackStart = this.onTrackStart.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
  }

  componentDidMount() {
    const domNode = findDOMNode(this)

    Object.keys(this.events).forEach((handler) => {
      this.events[handler].forEach((eventName) => {
        domNode.addEventListener(eventName, this[handler])
      })
    })
  }

  componentWillUnmount() {
    const domNode = findDOMNode(this)

    Object.keys(this.events).forEach((handler) => {
      this.events[handler].forEach((eventName) => {
        domNode.addEventListener(eventName, this[handler])
      })
    })
  }

  onTrack(event) {
    event.stopPropagation()
    console.log('Track!', event)

    // event normalization
    if (this.props.onTrack) {
      this.props.onTrack(event)
    }
  }

  onTrackStart(type) {
    return (event) => {
      console.log('Track start! %s', type, event)

      if (this.props.onTrackStart) {
        this.props.onTrackStart(event)
      }

        // incorrect still, but whatever first test mouse
      if (this.props.onTrack) {
        document.addEventListener(`mousemove`, this.onTrack)
      }

      if (this.props.onTrackEnd) {
        document.addEventListener(`mouseup`, this.onTrackEnd)
      }
    }
  }

  onTrackEnd(event) {
    event.stopPropagation()
    console.log('Track end!', event)

    if (this.props.onTrack) {
      document.removeEventListener(`mousemove`, this.onTrack)
    }

    if (this.props.onTrackEnd) {
      document.removeEventListener(`mouseup`, this.onTrackEnd)
      this.props.onTrackEnd(event)
    }
  }

  render() {
    // const {children, onTrack, onTrackEnd, onTrackStart} = this.props
    const {children} = this.props
    const {onTrack, onTrackEnd, onTrackStart} = this

    return cloneElement(Children.only(children), {
      onMouseDown: onTrackStart('mouse'),
      onTouchStart: onTrackStart('touch')
      // onMouseMove: onTrack,
      // onTouchMove: onTrack,
      // onTouchEnd: onTrackEnd,
      // onMouseUp: onTrackEnd,
    })
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
      pointerId: inEvent.pointerId
    }

    // const e = dispatcher.makeEvent(inType, trackData)

    t.lastMoveEvent = inEvent

    // dispatcher.dispatchEvent(e, t.downTarget)
    this.props[inType](e, t.downTarget)
  }

  pointerdown(inEvent) {
    console.log('pointerdown')
    if (inEvent.isPrimary && (inEvent.pointerType === 'mouse' ? inEvent.buttons === 1 : true)) {
      const p = {
        downEvent: inEvent,
        downTarget: inEvent.target,
        trackInfo: {},
        lastMoveEvent: null,
        xDirection: 0,
        yDirection: 0,
        tracking: false
      }

      this.pointermap.set(inEvent.pointerId, p)
    }
  }

  pointermove(inEvent) {
    console.log('pointermove')
    const p = this.pointermap.get(inEvent.pointerId)

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
    console.log('pointerup')
    const p = this.pointermap.get(inEvent.pointerId)

    if (p) {
      if (p.tracking) {
        this.fireTrack('onTrackEnd', inEvent, p)
      }
      this.pointermap.delete(inEvent.pointerId)
    }
  }

  pointercancel(inEvent) {
    console.log('pointercancel')
    this.pointerup(inEvent)
  }
}
