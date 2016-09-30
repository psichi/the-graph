export function selectGraph(state) {
  return {
    graph: state.graph
  }
}

export function selectScale(state) {
  return {
    scale: state.app.scale
  }
}

export function selectLibrary(state) {
  return {
    library: state.library
  }
}

export function selectedNodes(state) {
  return {
    selectedNodes: state.selectedNodes
  }
}

export function selectedEdges(state) {
  return {
    selectedEdges: state.selectedEdges
  }
}

export function errorNodes(state) {
  return {
    errorNodes: state.errorNodes
  }
}

export function edgePreview(state) {
  return {
    edgePreview: state.edgePreview
  }
}

