export default function createInportViews() {
  const {
    ports: {
      inports
    }
  } = this.props

  return this.createPortViews('in', inports)
}
