import React from 'react'
import Hammer from 'react-hammerjs'
import Config from '../Config'
import {
  EdgePathArray,
  EdgeBackgroundPath,
  EdgeForegroundPath,
  EdgeTouchPath,
  Arrow,
  EdgeGroup
} from '../factories/edge'
import {
  findLinePoint,
  perpendicular,
  findPointOnCubicBezier
} from '../utils'
import Track from '../Track'

export default function render() {
  const {
    curve,
    route,
    selected,
    animated,
    label
  } = this.props

  const {
    sX: sourceX,
    sY: sourceY,
    tX: targetX,
    tY: targetY
  } = this.positions

  // Organic / curved edge
  let c1X, c1Y, c2X, c2Y

  if (targetX - 5 < sourceX) {
    const curveFactor = (sourceX - targetX) * curve / 200
    if (Math.abs(targetY - sourceY) < Config.base.nodeSize / 2) {
      // Loopback
      c1X = sourceX + curveFactor
      c1Y = sourceY - curveFactor
      c2X = targetX - curveFactor
      c2Y = targetY - curveFactor
    } else {
      // Stick out some
      c1X = sourceX + curveFactor
      c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor)
      c2X = targetX - curveFactor
      c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor)
    }
  } else {
    // Controls halfway between
    c1X = sourceX + (targetX - sourceX) / 2
    c1Y = sourceY
    c2X = c1X
    c2Y = targetY
  }

  // Make SVG path

  const path = EdgePathArray(sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY).join(' ')

  const backgroundPathOptions = {
    ...Config.edge.backgroundPath,
    d: path
  }

  const foregroundPathClassName = Config.edge.foregroundPath.className + route

  const foregroundPathOptions = {
    ...Config.edge.foregroundPath,
    d: path,
    className: foregroundPathClassName
  }

  const touchPathOptions = {
    ...Config.edge.touchPath,
    d: path
  }

  const containerOptions = {
    ...Config.edge.container,
    className: `edge${
      selected ? ' selected' : ''
      }${animated ? ' animated' : ''}`,
    title: label
  }

  const epsilon = 0.01
  let center = findPointOnCubicBezier(0.5, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY)

  // estimate slope and intercept of tangent line
  const getShiftedPoint = (epsilon) => {
    return findPointOnCubicBezier(0.5 + epsilon, sourceX, sourceY, c1X, c1Y, c2X, c2Y, targetX, targetY)
  }

  const plus = getShiftedPoint(epsilon)
  const minus = getShiftedPoint(-epsilon)

  const m = 1 * (plus[1] - minus[1]) / (plus[0] - minus[0])
  const b = center[1] - (m * center[0])

  let arrowLength

  arrowLength = 12

  // Which direction should arrow point
  if (plus[0] > minus[0]) {
    arrowLength *= -1
  }

  center = findLinePoint(center[0], center[1], m, b, -1 * arrowLength / 2)

  const pointsArray = perpendicular(center[0], center[1], m, arrowLength * 0.9)

  // For m === 0, figure out if arrow should be straight up or down
  const flip = plus[1] > minus[1] ? -1 : 1
  const arrowTip = findLinePoint(center[0], center[1], m, b, arrowLength, flip)

  pointsArray.push(arrowTip)

  const points = pointsArray.map(point => point.join(',')).join(' ')

  const arrowBgOptions = {
    points,
    className: 'arrow-bg'
  }

  const arrowOptions = {
    points,
    className: `arrow fill route${route}`
  }

  return (
    <Track onTrackStart={this.dontPan}>
      <Hammer onTap={this.onEdgeSelection}>
        <EdgeGroup {...containerOptions}>
          <EdgeBackgroundPath {...backgroundPathOptions} />
          <Arrow {...arrowBgOptions} />
          <EdgeForegroundPath {...foregroundPathOptions} />
          <EdgeTouchPath {...touchPathOptions} />
          <Arrow {...arrowOptions} />
        </EdgeGroup>
      </Hammer>
    </Track>
  )
}
