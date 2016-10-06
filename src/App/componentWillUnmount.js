export default function componentWillUnmount() {
  const { graph } = this.props

  this.autolayouter.destroy()
  this.removeGraphListeners(graph)
  this.removeEventListeners()
}
