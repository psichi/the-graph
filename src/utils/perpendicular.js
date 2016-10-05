import findLinePoint from './findLinePoint'

// find points of perpendicular line length l centered at x,y
export default function perpendicular (
  x: number,
  y: number,
  oldM: number,
  l: number
): Array {
  const m = -1 / oldM
  const b = y - m * x
  const point1 = findLinePoint(x, y, m, b, l / 2)
  const point2 = findLinePoint(x, y, m, b, l / -2)

  return [point1, point2]
}
