export default function buildLabelRectOptions (height, x, y, len, className) {
  var width = len * height * 2 / 3
  var radius = height / 2
  x -= width / 2
  y -= height / 2

  var result = {
    className: className,
    height: height * 1.1,
    width: width,
    rx: radius,
    ry: radius,
    x: x,
    y: y
  }

  return result
}
