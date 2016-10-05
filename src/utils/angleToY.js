export default function angleToY(percent: number, radius: number): number {
  return radius * Math.sin(2 * Math.PI * percent)
}
