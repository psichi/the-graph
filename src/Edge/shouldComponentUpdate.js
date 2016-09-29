export default function shouldComponentUpdate(nextProps /* , nextState */) {
  // Only re-render if changed
  return (
    nextProps.sX !== this.props.sX ||
    nextProps.sY !== this.props.sY ||
    nextProps.tX !== this.props.tX ||
    nextProps.tY !== this.props.tY ||
    nextProps.selected !== this.props.selected ||
    nextProps.animated !== this.props.animated ||
    nextProps.route !== this.props.route
  )
}

