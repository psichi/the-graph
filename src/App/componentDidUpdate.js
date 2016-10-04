export default function componentDidUpdate(prevProps, prevState) {
  if (this.bgContext) {
    this.renderCanvas(this.bgContext)
  }
  if (!prevState || prevState.x !== this.state.x || prevState.y !== this.state.y || prevState.scale !== this.state.scale) {
    this.onPanScale()
  }
}
