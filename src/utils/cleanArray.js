export default function cleanArray (array) {
  let i
  for (i = 0; i < array.length; i++) {
    if (array[i] === null || array[i] === undefined) {
      array.splice(i, 1)
      i--
    }
  }

  return array
}
