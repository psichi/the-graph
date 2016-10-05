export default function shouldComponentUpdate (/* nextProps, nextState */) {
  return this.layoutReady
}
