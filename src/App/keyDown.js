export default function keyDown(event) {
  const { metaKey, ctrlKey, keyCode } = event

  // HACK metaKey global for taps https://github.com/Polymer/PointerGestures/issues/29

  // Each Component should do this themselves
  if (metaKey || ctrlKey) {
    // console.error('Fix ME global meta key')
    // TheGraph.metaKeyPressed = true;
  }

  const {
    graph: {
      state: {
        graph,
        selectedNodes,
        selectedEdges
      }
    }

  } = this.refs

  const { menus } = this.props

  const hotKeys = {
    // Delete
    46: () => {
      let nodeKey
      for (nodeKey in selectedNodes) {
        if (selectedNodes.hasOwnProperty(nodeKey)) {
          const node = graph.getNode(nodeKey)

          menus.node.actions.delete(graph, nodeKey, node)
        }
      }
      selectedEdges.map((edge) => {
        menus.edge.actions.delete(graph, null, edge)
      })
    },
    // f for fit
    70: () => {
      this.triggerFit()
    },
    // s for selected
    83: () => {
      let nodeKey

      for (nodeKey in selectedNodes) {
        if (selectedNodes.hasOwnProperty(nodeKey)) {
          const node = graph.getNode(nodeKey)

          this.focusNode(node)
          break
        }
      }
    }
  }

  if (hotKeys[keyCode]) {
    hotKeys[keyCode]()
  }
}
