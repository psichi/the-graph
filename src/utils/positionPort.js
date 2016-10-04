export default function (port, total, index, dimensions) {
  return {
    label: port.name || port.label, // normalize this
    type: port.type,
    x: dimensions.x,
    y: dimensions.height / (total + 1) * (index + 1)
  }
}
