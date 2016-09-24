import Config from '../Config'

export default function renderCanvas(c) {
  const { width, height, scale, x: currentX, y: currentY } = this.state

  // Comment this line to go plaid
  c.clearRect(0, 0, width, height)

  // Background grid pattern
  const g = Config.nodeSize * scale

  const dx = currentX % g
  const dy = currentY % g

  const cols = Math.floor(width / g) + 1
  let row = Math.floor(height / g) + 1

  // Origin row/col index
  const oc = Math.floor(currentX / g) + (currentX < 0 ? 1 : 0)
  const or = Math.floor(currentY / g) + (currentY < 0 ? 1 : 0)

  while (row--) {
    let col = cols
    while (col--) {
      const x = Math.round(col * g + dx)
      const y = Math.round(row * g + dy)

      if ((oc - col) % 3 === 0 && (or - row) % 3 === 0) {
        // 3x grid
        c.fillStyle = 'white'
        c.fillRect(x, y, 1, 1)
      } else if (scale > 0.5) {
        // 1x grid
        c.fillStyle = 'grey'
        c.fillRect(x, y, 1, 1)
      }
    }
  }
}
