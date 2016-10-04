export default function edgeDraw (event) {
  if (this.props.onEdgeDraw) {
    this.props.onEdgeDraw({
      type: 'Edge/DRAW',
      payload: event
    })
  }
}

