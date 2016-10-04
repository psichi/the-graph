export default function shouldComponentUpdate(nextProps) {
  // Only re-render if changed
  return (
    nextProps.x !== this.props.x ||
    nextProps.y !== this.props.y ||
    nextProps.width !== this.props.width ||
    nextProps.height !== this.props.height ||
    nextProps.icon !== this.props.icon ||
    nextProps.label !== this.props.label ||
    nextProps.sublabel !== this.props.sublabel ||
    nextProps.ports !== this.props.ports ||
    nextProps.selected !== this.props.selected ||
    nextProps.error !== this.props.error ||
    nextProps.highlightPort !== this.props.highlightPort ||
    nextProps.ports.dirty === true
  )
}
