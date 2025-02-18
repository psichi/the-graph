import LibraryHelper from '../helpers/LibraryHelper'

export default function triggerAutolayout() {
  const { graph, library } = this.props

  const libraryHelper = LibraryHelper.getInstance(library)
  const portInfo = libraryHelper.buildPortInfo(graph)

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
      inLayerSpacingFactor: 2,
      nodePlace: 'BRANDES_KOEPF',
      nodeLayering: 'NETWORK_SIMPLEX',
      edgeRouting: 'POLYLINE',
      crossMin: 'LAYER_SWEEP',
      direction: 'RIGHT'
    }
  })
}
