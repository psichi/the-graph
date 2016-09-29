export default function createOutportViews() {
  const {
    ports: {
      outports
    }
  } = this.props

  return this.createPortViews('out', outports)
}
