const multi = 60466176 // 36^5

export default function makeNewId(label: string): string {
  const num = Math.floor(Math.random() * multi)

  return `${label}_${num.toString(36)}`
}

