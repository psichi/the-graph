// SVG arc math
export default function angleToX(percent: number, radius: number): number {
  return radius * Math.cos(2 * Math.PI * percent)
}
