import angleToX from './angleToX'
import angleToY from './angleToY'

export default function makeArcPath(
  startPercent: number,
  endPercent: number,
  radius: number
): string {
  return [
    'M', angleToX(startPercent, radius), angleToY(startPercent, radius),
    'A', radius, radius, 0, 0, 0, angleToX(endPercent, radius), angleToY(endPercent, radius)
  ].join(' ')
}
