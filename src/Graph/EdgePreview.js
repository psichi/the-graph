// NOT USED YET, represents the edge preview.
import React, { Component, PropTypes } from 'react'
import Config from '../Config'

export default class EdgePreview extends Component {
  static propTypes = {
    isIn: PropTypes.bool,
    to: PropTypes.string, // not sure could also be object
    from: PropTypes.string
  }

  edgeStart(event) {
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

  renderPreviewEdge(event) {
    const {
      app: {
        state: {
          offsetX,
          offsetY,
          scale,
          x: appX,
          y: appY
        }
      }
    } = this.props

    let x = event.x || event.clientX || 0
    let y = event.y || event.clientY || 0

    x -= offsetX || 0
    y -= offsetY || 0

    this.setState({
      edgePreviewX: (x - appX) / scale,
      edgePreviewY: (y - appY) / scale
    })

    this.markDirty()
  }

  cancelPreviewEdge(event) {
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

  render () {
    // Edge preview
    const edgePreview = this.state.edgePreview

    if (edgePreview) {
      let edgePreviewOptions

      if (edgePreview.from) {
        const source = graph.getNode(edgePreview.from.process)
        const sourcePort = this.getNodeOutport(graph, edgePreview.from.process, edgePreview.from.port)

        edgePreviewOptions = {
          ...Config.graph.edgePreview,
          sX: source.metadata.x + source.metadata.width,
          sY: source.metadata.y + sourcePort.y,
          tX: edgePreviewX,
          tY: edgePreviewY,
          route: edgePreview.metadata.route
        }
      } else {
        const target = graph.getNode(edgePreview.to.process)
        const targetPort = this.getNodeInport(graph, edgePreview.to.process, edgePreview.to.port)

        edgePreviewOptions = {
          ...Config.graph.edgePreview,
          sX: edgePreviewX,
          sY: edgePreviewY,
          tX: target.metadata.x,
          tY: target.metadata.y + targetPort.y,
          route: edgePreview.metadata.route
        }
      }

      const edgePreviewView = GraphEdgePreview(edgePreviewOptions)

      edges.push(edgePreviewView)
    }
  }
}
