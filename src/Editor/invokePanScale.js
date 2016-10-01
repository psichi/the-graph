// this should update and be within state
export default function invokePanScale(x, y, scale) {
  const { onPanScale } = this.props

  this.pan[0] = x
  this.pan[1] = y
  this.scale = scale

  if (onPanScale) {
    onPanScale({ x, y, scale })
  }
}
