import Menu from '../Menu'

export default function getContext(menu, options, triggerHideContext) {
  const { graph, width: nodeWidth, height: nodeHeight } = this.props
  const { x, y } = options
  const menuOptions = {
    menu,
    options,
    graph,
    x,
    y,
    nodeWidth,
    nodeHeight,
    triggerHideContext,
    label: 'Hello',
    node: this,
    ports: [],
    process: [],
    processKey: null,
    deltaX: 0,
    deltaY: 0,
    highlightPort: false
  }

  return <Menu {...menuOptions} />
}
