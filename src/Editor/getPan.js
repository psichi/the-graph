export default function getPan() {
  if (!this.refs.appView) {
    return [0, 0]
  }
  return [this.refs.appView.state.x, this.refs.appView.state.y]
}
