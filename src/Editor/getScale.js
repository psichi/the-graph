export default function getScale() {
  if (!this.refs.appView) {
    return 1
  }
  return this.refs.appView.state.scale
}
