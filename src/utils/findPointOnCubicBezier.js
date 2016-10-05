// Point along cubic bezier curve
// See http://en.wikipedia.org/wiki/File:Bezier_3_big.gif
export default function findPointOnCubicBezier(
  p: number,
  sx: number,
  sy: number,
  c1x: number,
  c1y: number,
  c2x: number,
  c2y: number,
  ex: number,
  ey: number
) {
  // p is percentage from 0 to 1
  const op = 1 - p

  // 3 green points between 4 points that define curve
  const g1x = sx * p + c1x * op
  const g1y = sy * p + c1y * op
  const g2x = c1x * p + c2x * op
  const g2y = c1y * p + c2y * op
  const g3x = c2x * p + ex * op
  const g3y = c2y * p + ey * op

  // 2 blue points between green points
  const b1x = g1x * p + g2x * op
  const b1y = g1y * p + g2y * op
  const b2x = g2x * p + g3x * op
  const b2y = g2y * p + g3y * op

  // Point on the curve between blue points
  const x = b1x * p + b2x * op
  const y = b1y * p + b2y * op

  return [x, y]
}
