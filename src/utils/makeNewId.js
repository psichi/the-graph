const multi = 60466176 // 36^5

export default function makeNewId (label) {
  const num = Math.floor(Math.random() * multi)
  const id = label + '_' + num.toString(36)

  return id
}

