// Api
module.exports = {
  App: require('./src/App').default,
  Clipboard: require('./src/Clipboard').default,
  Edge: require('./src/Edge').default,
  FONT_AWESOME: require('./src/config/FONT_AWESOME').default,
  Graph: require('./src/Graph').default,
  Group: require('./src/Group').default,
  IIP: require('./src/Iip').default,
  Menu: require('./src/Menu').default,
  ModalBG: require('./src/common/modalBG').default,
  Node: require('./src/Node').default,
  NodeMenu: require('./src/NodeMenu').default,
  NodeMenuPort: require('./src/NodeMenuPort').default,
  NodeMenuPorts: require('./src/NodeMenuPorts').default,
  Port: require('./src/Port').default,
  SVGImage: require('./src/SVGImage').default,
  TextBG: require('./src/TextBG').default,
  Tooltip: require('./src/Tooltip').default,
  arcs: require('./src/arcs').default,
  config: require('./src/config').default,
  contextPortSize: 36,
  factories: require('./src/factories').default,
  findAreaFit: require('./src/findAreaFit').default,
  findMinMax: require('./src/findMinMax').default,
  findNodeFit: require('./src/findNodeFit').default,
  mixins: require('./src/mixins').default
  /*
   nodeRadius: 8,
   nodeSide: 56,
   nodeSize: 72,
   zbpBig: 1.2,
   zbpNormal: 0.4,
   zbpSmall: 0.01
   */
}
