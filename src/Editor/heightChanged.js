export default function heightChanged() {
  if (!this.refs.appView) { return }
  this.refs.appView.setState({
    height: this.height
  })
}
