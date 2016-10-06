// NOT USED YET, represents the edge preview.
import React, { Component, PropTypes } from 'react'
import Config from '../Config'

export default class EdgePreview extends Component {
  static propTypes = {
    edge: PropTypes.shape({
      from: PropTypes.shape({
        process: PropTypes.string,
        port: PropTypes.string
      }),
      to: PropTypes.shape({
        process: PropTypes.string,
        port: PropTypes.string
      }),
      metadata: PropTypes.shape({
        route: PropTypes.number
      })
    }),
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    appX: PropTypes.number,
    appY: PropTypes.number,
    scale: PropTypes.number,
    isIn: PropTypes.bool,
    graph: PropTypes.object
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

      // not added to graph
      // removes the realtime ability,
      // however can be made similar if you listen to a dispatch of a new edge.
      // this.addEdge(halfEdge)
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

    /* Render preview edge should be rendered by whatever is listening. */

    /* Is already intiated by port
     const appDomNode = findDOMNode(app)
    appDomNode.addEventListener('mousemove', this.renderPreviewEdge)
    appDomNode.addEventListener('track', this.renderPreviewEdge)
    */

    if (this.props.onEdgeStart) {
      this.props.onEdgeStart({
        edge
      })
    }
    /* Should be done external by whatever is listening. */
    /*
    // TODO tap to add new node here
    appDomNode.addEventListener('tap', this.cancelPreviewEdge)
    */

    // state is kept in App, not here
    // this.setState({ edgePreview: edge })
  }

  renderPreviewEdge(event) {
    /*
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
    */
    const {
      offsetX,
      offsetY,
      scale,
      appX,
      appY
    } = this.props

    let x = event.x || event.clientX || 0
    let y = event.y || event.clientY || 0

    x -= offsetX || 0
    y -= offsetY || 0

    this.setState({
      edgePreviewX: (x - appX) / scale,
      edgePreviewY: (y - appY) / scale
    })
  }

  cancelPreviewEdge(event) {
    const { edgePreview } = this.state

    /* Tracked from port not overhere.
    const { app } = this.props
    const appDomNode = findDOMNode(app)

    appDomNode.removeEventListener('mousemove', this.renderPreviewEdge)
    appDomNode.removeEventListener('track', this.renderPreviewEdge)

    appDomNode.removeEventListener('tap', this.cancelPreviewEdge)
    */

    /* Should be done from app
    if (edgePreview) {
      this.setState({ edgePreview: null })
    }
    */
  }

  render () {
    // Edge preview
    let edgePreviewOptions

    const { edge } = this.props
    const { edgePreviewX, edgePreviewY } = this.state

    if (edge.from) {

      // should not be done from within, this component
      // needs to be provided these values.
      const source = graph.getNode(edge.from.process)
      const sourcePort = this.getNodeOutport(graph, edge.from.process, edge.from.port)

      edgePreviewOptions = {
        ...Config.graph.edgePreview,
        sX: source.metadata.x + source.metadata.width,
        sY: source.metadata.y + sourcePort.y,
        tX: edgePreviewX,
        tY: edgePreviewY,
        route: edge.metadata.route
      }
    } else {
      const target = graph.getNode(edge.to.process)
      const targetPort = this.getNodeInport(graph, edge.to.process, edge.to.port)

      edgePreviewOptions = {
        ...Config.graph.edgePreview,
        sX: edgePreviewX,
        sY: edgePreviewY,
        tX: target.metadata.x,
        tY: target.metadata.y + targetPort.y,
        route: edge.metadata.route
      }
    }

    // Graph Edge preview is just an Edge.
    // that's why above options belong to this component PreviewEdge
    // Preview Edge is an Edge except it keeps state.
    return <GraphEdgePreview {...edgePreviewOptions} />
  }
}
