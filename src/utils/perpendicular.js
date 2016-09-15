import findLinePoint from './findLinePoint'

// find points of perpendicular line length l centered at x,y
export default function perpendicular (x, y, oldM, l) {
  var m = -1 / oldM
  var b = y - m * x
  var point1 = findLinePoint(x, y, m, b, l / 2)
  var point2 = findLinePoint(x, y, m, b, l / -2)
  return [point1, point2]
}
