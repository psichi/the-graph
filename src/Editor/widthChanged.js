export default function widthChanged() {
  if (!this.refs.appView) { return }
  this.refs.appView.setState({
    width: this.width
  })
}
