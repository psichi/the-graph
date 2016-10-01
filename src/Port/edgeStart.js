import { findDOMNode } from 'react-dom'

export default function edgeStart(event) {
  const { isExport, isIn, port, route } = this.props
  // const { label: labelRef } = this.refs
  const domNode = findDOMNode(this)

  // Don't start edge on export node port
  if (isExport) {
    return
  }
  // Click on label, pass context menu to node
  /* TODO: restore whatever this is trying to prevent, but without refs.
  if (event && (event.target === findDOMNode(labelRef))) {
    return
  }
  */
  // Don't tap graph
  event.stopPropagation()

  if (this.props.onEdgeStart) {
    this.props.onEdgeStart({
      type: 'Edge/START',
      payload: {
        isIn,
        port,
        // process: this.props.processKey,
        route
      }
    })
  }

  const edgeStartEvent = new CustomEvent('the-graph-edge-start', {
    detail: {
      isIn,
      port,
      // process: this.props.processKey,
      route
    },
    bubbles: true
  })

  domNode.dispatchEvent(edgeStartEvent)
}

