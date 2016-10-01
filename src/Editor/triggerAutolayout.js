export default function triggerAutolayout(event) {
  const graph = this.graph
  const portInfo = this.refs.appView.refs.graph ? this.appview.refs.graph.portInfo : null
  // Calls the autolayouter
  this.autolayouter.layout({
    graph,
    portInfo,
    direction: 'RIGHT',
    options: {
      intCoordinates: true,
      algorithm: 'de.cau.cs.kieler.klay.layered',
      layoutHierarchy: true,
      spacing: 36,
      borderSpacing: 20,
      edgeSpacingFactor: 0.2,
      inLayerSpacingFactor: 2.0,
      nodePlace: 'BRANDES_KOEPF',
      nodeLayering: 'NETWORK_SIMPLEX',
      edgeRouting: 'POLYLINE',
      crossMin: 'LAYER_SWEEP',
      direction: 'RIGHT'
    }
  })
}
