import { findDOMNode } from 'react-dom'

export default function edgeStart(event) {
  // Forwarded from App.edgeStart()
  const { edgePreview } = this.state
  const { app } = this.props
  const { detail: eventDetail } = event

  // Port that triggered this
  const { port } = eventDetail

  // Complete edge if this is the second tap and ports are compatible
  if (edgePreview && edgePreview.isIn !== eventDetail.isIn) {
    // TODO also check compatible types
    const halfEdge = edgePreview

    if (eventDetail.isIn) {
      halfEdge.to = port
    } else {
      halfEdge.from = port
    }

    this.addEdge(halfEdge)
    this.cancelPreviewEdge()

    return
  }

  let edge

  if (eventDetail.isIn) {
    edge = { to: port }
  } else {
    edge = { from: port }
  }

  edge.isIn = eventDetail.isIn
  edge.metadata = { route: eventDetail.route }
  edge.type = eventDetail.port.type

  const appDomNode = findDOMNode(app)

  /* Render preview edge should be rendered by whatever is listening. */
  appDomNode.addEventListener('mousemove', this.renderPreviewEdge)
  appDomNode.addEventListener('track', this.renderPreviewEdge)

  if (this.props.onEdgeStart) {
    this.props.onEdgeStart({
      edge
    })
  }
  /* Should be done external by whatever is listening. */
  // TODO tap to add new node here
  appDomNode.addEventListener('tap', this.cancelPreviewEdge)

  this.setState({ edgePreview: edge })
}

