export default function componentDidUpdate(prevProps, prevState) {
  this.renderCanvas(this.bgContext)
  if (!prevState || prevState.x !== this.state.x || prevState.y !== this.state.y || prevState.scale !== this.state.scale) {
    this.onPanScale()
  }
}
