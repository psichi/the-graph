export default function panChanged() {
  // Send pan back to React
  if (!this.refs.appView) { return }
  this.refs.appView.setState({
    x: this.pan[0],
    y: this.pan[1]
  })
}
