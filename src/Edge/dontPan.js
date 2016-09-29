export default function dontPan(event) {
  // Don't drag under menu
  if (this.props.app.menuShown) {
    event.stopPropagation()
  }
}

