export default function changeTooltip(event) {
  const { width: widthProp } = this.props
  const { detail: { x: xDetail, y: yDetail, tooltip } } = event

  // Don't go over right edge
  let tooltipX

  tooltipX = xDetail + 10

  const width = tooltip.length * 6

  if (tooltipX + width > widthProp) {
    tooltipX = xDetail - width - 10
  }

  this.setState({
    tooltip,
    tooltipVisible: true,
    tooltipX,
    tooltipY: yDetail + 20
  })
}

