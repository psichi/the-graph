import { findDOMNode } from 'react-dom'

export default function cancelPreviewEdge(event) {
  const { edgePreview } = this.state
  const { app } = this.props
  const appDomNode = findDOMNode(app)

  appDomNode.removeEventListener('mousemove', this.renderPreviewEdge)
  appDomNode.removeEventListener('track', this.renderPreviewEdge)

  appDomNode.removeEventListener('tap', this.cancelPreviewEdge)

  if (edgePreview) {
    this.setState({ edgePreview: null })
    this.markDirty()
  }
}

