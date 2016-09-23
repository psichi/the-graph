export default function buildLabelRectOptions(height, x, y, len, className) {
  const width = len * height * 2 / 3
  const radius = height / 2

  x -= width / 2
  y -= height / 2

  const result = {
    className,
    height: height * 1.1,
    width,
    rx: radius,
    ry: radius,
    x,
    y
  }

  return result
}
