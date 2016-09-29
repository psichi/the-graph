export default function dontPan(event) {
  const { app: { menuShown } } = this.props
  // Don't drag under menu
  if (menuShown) {
    event.stopPropagation()
  }
}
