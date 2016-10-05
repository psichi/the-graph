export default function cloneObject(obj: Object) {
  return JSON.parse(JSON.stringify(obj))
}
