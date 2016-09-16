// find point on line y = mx + b that is `offset` away from x,y
export default function findLinePoint (x, y, m, b, offset, flip) {
  const x1 = x + offset / Math.sqrt(1 + m * m)

  let y1
  if (Math.abs(m) === Infinity) {
    y1 = y + (flip || 1) * offset
  } else {
    y1 = (m * x1) + b
  }
  return [x1, y1]
}
