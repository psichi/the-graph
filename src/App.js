import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {
  findAreaFit,
  findFit,
  findNodeFit,
  klayNoflo,
  merge
} from './utils'
import Config from './Config'
import Menu from './Menu'
import Hammer from 'hammerjs'
import {
  AppModalBackground,
  AppGraph,
  AppSvgGroup,
  AppModalGroup,
  AppSvg,
  AppCanvas,
  AppContainer,
  AppTooltip
} from './factories/app'

export default class TheGraphApp extends Component {
  mixins = [React.Animate]
  zoomFactor = 0
  zoomX = 0
  zoomY = 0
  lastScale = 1
  lastX = 0
  lastY = 0
  pinching = false

  static defaultProps = {
    snap: 36
  }

  static propTypes = {
    graph: PropTypes.object.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    offsetY: PropTypes.number,
    offsetX: PropTypes.number,
    snap: PropTypes.number
  }

  constructor (props, context) {
    super(props, context)

    this.state = {
      /*
       x: fit.x,
       y: fit.y,
       scale: fit.scale,
       */
      width: this.props.width,
      height: this.props.height,
      minZoom: this.props.minZoom,
      maxZoom: this.props.maxZoom,
      tooltip: '',
      tooltipX: 0,
      tooltipY: 0,
      tooltipVisible: false,
      contextElement: null,
      contextType: null,
      offsetY: this.props.offsetY,
      offsetX: this.props.offsetX
    }

    this.onTrack = this.onTrack.bind(this)
    this.onTrackEnd = this.onTrackEnd.bind(this)
    this.onTrackStart = this.onTrackStart.bind(this)
    this.onWheel = this.onWheel.bind(this)
    this.changeTooltip = this.changeTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)
    this.edgeStart = this.edgeStart.bind(this)
    this.onShowContext = this.onShowContext.bind(this)
    this.unselectAll = this.unselectAll.bind(this)
    this.showContext = this.showContext.bind(this)
    this.scheduleWheelZoom = this.scheduleWheelZoom.bind(this)
    this.triggerAutolayout = this.triggerAutolayout.bind(this)
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)

    // Initializes the autolayouter
    this.autolayouter = klayNoflo.init({
      onSuccess: this.applyAutolayout.bind(this),
      workerScript: 'klayjs/klay.js'
    })
  }

  // TODO
  autolayoutChanged () {
    const {graph} = this.props

    if (!graph) {
      return
    }

    // Only listen to changes that affect layout
    if (this.autolayout) {
      graph.on('addNode', this.triggerAutolayout)
      graph.on('removeNode', this.triggerAutolayout)
      graph.on('addInport', this.triggerAutolayout)
      graph.on('removeInport', this.triggerAutolayout)
      graph.on('addOutport', this.triggerAutolayout)
      graph.on('removeOutport', this.triggerAutolayout)
      graph.on('addEdge', this.triggerAutolayout)
      graph.on('removeEdge', this.triggerAutolayout)
    } else {
      graph.removeListener('addNode', this.triggerAutolayout)
      graph.removeListener('removeNode', this.triggerAutolayout)
      graph.removeListener('addInport', this.triggerAutolayout)
      graph.removeListener('removeInport', this.triggerAutolayout)
      graph.removeListener('addOutport', this.triggerAutolayout)
      graph.removeListener('removeOutport', this.triggerAutolayout)
      graph.removeListener('addEdge', this.triggerAutolayout)
      graph.removeListener('removeEdge', this.triggerAutolayout)
    }
  }

  triggerAutolayout (event) {
    const {graph} = this.props
    const {graph: graphView} = this.refs

    // Calls the autolayouter
    this.autolayouter.layout({
      'graph': graph,
      'portInfo': graphView.portInfo,
      'direction': 'RIGHT',
      'options': {
        'intCoordinates': true,
        'algorithm': 'de.cau.cs.kieler.klay.layered',
        'layoutHierarchy': true,
        'spacing': 36,
        'borderSpacing': 20,
        'edgeSpacingFactor': 0.2,
        'inLayerSpacingFactor': 2,
        'nodePlace': 'BRANDES_KOEPF',
        'nodeLayering': 'NETWORK_SIMPLEX',
        'edgeRouting': 'POLYLINE',
        'crossMin': 'LAYER_SWEEP',
        'direction': 'RIGHT'
      }
    })
  }

  // (moved from polymer to here)
  applyAutolayout (layoutedKGraph) {
    const {graph, snap} = this.props

    if (!snap) {
      return
    }

    // DO NOT UPDATE weird NaN bug
    console.log('APPLY AUTOLAYOUT', graph, snap)
    console.log('LAYOUTED K GRAPH', layoutedKGraph)
    if (layoutedKGraph.stacktrace) {
      throw Error(layoutedKGraph.text)
    }

    graph.startTransaction('autolayout')
    // Update original graph nodes with the new coordinates from KIELER graph
    var children = layoutedKGraph.children.slice()
    var i, len
    for (i = 0, len = children.length; i < len; i++) {
      var klayNode = children[i]
      var nofloNode = graph.getNode(klayNode.id)
      // Encode nodes inside groups
      if (klayNode.children) {
        var klayChildren = klayNode.children
        var idx
        for (idx in klayChildren) {
          var klayChild = klayChildren[idx]
          if (klayChild.id) {
            graph.setNodeMetadata(klayChild.id, {
              x: Math.round((klayNode.x + klayChild.x) / snap) * snap,
              y: Math.round((klayNode.y + klayChild.y) / snap) * snap
            })
          }
        }
      }
      // Encode nodes outside groups
      if (nofloNode) {
        console.log('GOING TO SET NODE METADATA', klayNode, snap)
        graph.setNodeMetadata(klayNode.id, {
          x: Math.round(klayNode.x / snap) * snap,
          y: Math.round(klayNode.y / snap) * snap
        })
      } else {
        // Find inport or outport
        var idSplit = klayNode.id.split(':::')
        var expDirection = idSplit[0]
        var expKey = idSplit[1]
        if (expDirection === 'inport' && graph.inports[expKey]) {
          graph.setInportMetadata(expKey, {
            x: Math.round(klayNode.x / snap) * snap,
            y: Math.round(klayNode.y / snap) * snap
          })
        } else if (expDirection === 'outport' && graph.outports[expKey]) {
          graph.setOutportMetadata(expKey, {
            x: Math.round(klayNode.x / snap) * snap,
            y: Math.round(klayNode.y / snap) * snap
          })
        }
      }
    }
    graph.endTransaction('autolayout')
    // Fit to window
    this.triggerFit()
  }

  onWheel (event) {
    // Don't bounce
    event.preventDefault()

    if (!this.zoomFactor) { // WAT
      this.zoomFactor = 0
    }

    // Safari is wheelDeltaY
    this.zoomFactor += event.deltaY ? event.deltaY : 0 - event.wheelDeltaY
    this.zoomX = event.clientX
    this.zoomY = event.clientY
    requestAnimationFrame(this.scheduleWheelZoom)
  }

  scheduleWheelZoom () {
    if (isNaN(this.zoomFactor)) { return }

    // Speed limit
    var zoomFactor = this.zoomFactor / -500
    zoomFactor = Math.min(0.5, Math.max(-0.5, zoomFactor))
    var scale = this.state.scale + (this.state.scale * zoomFactor)
    this.zoomFactor = 0

    if (scale < this.state.minZoom) {
      scale = this.state.minZoom
    }
    else if (scale > this.state.maxZoom) {
      scale = this.state.maxZoom
    }
    if (scale === this.state.scale) { return }

    // Zoom and pan transform-origin equivalent
    var scaleD = scale / this.state.scale
    var currentX = this.state.x
    var currentY = this.state.y
    var oX = this.zoomX
    var oY = this.zoomY
    var x = scaleD * (currentX - oX) + oX
    var y = scaleD * (currentY - oY) + oY

    this.setState({
      scale: scale,
      x: x,
      y: y,
      tooltipVisible: false
    })
  }

  onTransformStart (event) {
    // Don't drag nodes
    event.srcEvent.stopPropagation()
    event.srcEvent.stopImmediatePropagation()

    // Hammer.js
    this.lastScale = 1
    this.lastX = event.center.x
    this.lastY = event.center.y
    this.pinching = true
  }

  onTransform (event) {
    // Don't drag nodes
    event.srcEvent.stopPropagation()
    event.srcEvent.stopImmediatePropagation()

    // Hammer.js
    var currentScale = this.state.scale
    var currentX = this.state.x
    var currentY = this.state.y

    var scaleEvent = event.scale
    var scaleDelta = 1 + (scaleEvent - this.lastScale)
    this.lastScale = scaleEvent
    var scale = scaleDelta * currentScale
    scale = Math.max(scale, this.props.minZoom)

    // Zoom and pan transform-origin equivalent
    var oX = event.center.x
    var oY = event.center.y
    var deltaX = oX - this.lastX
    var deltaY = oY - this.lastY
    var x = scaleDelta * (currentX - oX) + oX + deltaX
    var y = scaleDelta * (currentY - oY) + oY + deltaY

    this.lastX = oX
    this.lastY = oY

    this.setState({
      scale: scale,
      x: x,
      y: y,
      tooltipVisible: false
    })
  }

  onTransformEnd (event) {
    // Don't drag nodes
    event.srcEvent.stopPropagation()
    event.srcEvent.stopImmediatePropagation()

    // Hammer.js
    this.pinching = false
  }

  onTrackStart (event) {
    event.preventTap()
    var domNode = findDOMNode(this)
    domNode.addEventListener('track', this.onTrack)
    domNode.addEventListener('trackend', this.onTrackEnd)
  }

  onTrack (event) {
    if (this.pinching) { return }
    this.setState({
      x: this.state.x + event.ddx,
      y: this.state.y + event.ddy
    })
  }

  onTrackEnd (event) {
    // Don't click app (unselect)
    event.stopPropagation()

    var domNode = findDOMNode(this)
    domNode.removeEventListener('track', this.onTrack)
    domNode.removeEventListener('trackend', this.onTrackEnd)
  }

  onPanScale () {
    // Pass pan/scale out to the-graph
    if (this.props.onPanScale) {
      this.props.onPanScale(this.state.x, this.state.y, this.state.scale)
    }
  }

  showContext (options) {
    this.setState({
      contextMenu: options,
      tooltipVisible: false
    })
  }

  hideContext (event) {
    this.setState({
      contextMenu: null
    })
  }

  changeTooltip (event) {
    var tooltip = event.detail.tooltip

    // Don't go over right edge
    var x = event.detail.x + 10
    var width = tooltip.length * 6
    if (x + width > this.props.width) {
      x = event.detail.x - width - 10
    }

    this.setState({
      tooltip: tooltip,
      tooltipVisible: true,
      tooltipX: x,
      tooltipY: event.detail.y + 20
    })
  }

  hideTooltip (event) {
    this.setState({
      tooltip: '',
      tooltipVisible: false
    })
  }

  triggerFit (event) {
    var fit = findFit(this.props.graph, this.props.width, this.props.height)
    this.setState({
      x: fit.x,
      y: fit.y,
      scale: fit.scale
    })
  }

  focusNode (node) {
    var duration = Config.focusAnimationDuration
    var fit = findNodeFit(node, this.state.width, this.state.height)
    var start_point = {
        x: -(this.state.x - this.state.width / 2) / this.state.scale,
        y: -(this.state.y - this.state.height / 2) / this.state.scale
      }, end_point = {
        x: node.metadata.x,
        y: node.metadata.y
      }
    var graphfit = findAreaFit(start_point, end_point, this.state.width, this.state.height)
    var scale_ratio_1 = Math.abs(graphfit.scale - this.state.scale)
    var scale_ratio_2 = Math.abs(fit.scale - graphfit.scale)
    var scale_ratio_diff = scale_ratio_1 + scale_ratio_2

    // Animate zoom-out then zoom-in
    this.animate({
      x: graphfit.x,
      y: graphfit.y,
      scale: graphfit.scale
    }, duration * (scale_ratio_1 / scale_ratio_diff), 'in-quint', function () {
      this.animate({
        x: fit.x,
        y: fit.y,
        scale: fit.scale
      }, duration * (scale_ratio_2 / scale_ratio_diff), 'out-quint')
    }.bind(this))
  }

  edgeStart (event) {
    // Listened from PortMenu.edgeStart() and Port.edgeStart()
    this.refs.graph.edgeStart(event)
    this.hideContext()
  }

  componentDidMount () {
    // Autofit (not sure whether this is the correct location to do it
    var fit = findFit(this.props.graph, this.props.width, this.props.height)
    this.setState({
      x: fit.x,
      y: fit.y,
      scale: fit.scale
    })

    var domNode = findDOMNode(this)

    // Set up PolymerGestures for app and all children
    /* Do not use polymer
     var noop = function(){};
     PolymerGestures.addEventListener(domNode, 'up', noop);
     PolymerGestures.addEventListener(domNode, 'down', noop);
     PolymerGestures.addEventListener(domNode, 'tap', noop);
     PolymerGestures.addEventListener(domNode, 'trackstart', noop);
     PolymerGestures.addEventListener(domNode, 'track', noop);
     PolymerGestures.addEventListener(domNode, 'trackend', noop);
     PolymerGestures.addEventListener(domNode, 'hold', noop);
     */

    // Unselect edges and nodes
    if (this.props.onNodeSelection) {
      domNode.addEventListener('tap', this.unselectAll)
    }

    // Don't let Hammer.js collide with polymer-gestures
    var hammertime
    if (Hammer) {
      hammertime = new Hammer(domNode, {})
      hammertime.get('pinch').set({ enable: true })
    }

    // Pointer gesture event for pan
    domNode.addEventListener('trackstart', this.onTrackStart)

    var isTouchDevice = 'ontouchstart' in document.documentElement
    if (isTouchDevice && hammertime) {
      hammertime.on('pinchstart', this.onTransformStart)
      hammertime.on('pinch', this.onTransform)
      hammertime.on('pinchend', this.onTransformEnd)
    }

    // Wheel to zoom
    if (domNode.onwheel !== undefined) {
      // Chrome and Firefox
      domNode.addEventListener('wheel', this.onWheel)
    } else if (domNode.onmousewheel !== undefined) {
      // Safari
      domNode.addEventListener('mousewheel', this.onWheel)
    }

    // Tooltip listener
    domNode.addEventListener('the-graph-tooltip', this.changeTooltip)
    domNode.addEventListener('the-graph-tooltip-hide', this.hideTooltip)

    // Edge preview
    domNode.addEventListener('the-graph-edge-start', this.edgeStart)

    domNode.addEventListener('contextmenu', this.onShowContext)

    // Start zoom from middle if zoom before mouse move
    this.mouseX = Math.floor(this.props.width / 2)
    this.mouseY = Math.floor(this.props.height / 2)

    // HACK metaKey global for taps https://github.com/Polymer/PointerGestures/issues/29
    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('keyup', this.keyUp)

    // Canvas background
    /*
     this.bgCanvas = unwrap(findDOMNode(this.refs.canvas));
     this.bgContext = unwrap(this.bgCanvas.getContext('2d'));
     seems to be from polymer custom elements
     */
    // this.bgCanvas = findDOMNode(this.refs.canvas);

    this.bgCanvas = this.refs.canvas
    this.bgContext = this.bgCanvas.getContext('2d')
    this.componentDidUpdate()

    // Rerender graph once to fix edges
    setTimeout(function () {
      this.renderGraph()
    }.bind(this), 500)
  }

  onShowContext (event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.preventTap) { event.preventTap() }

    // Get mouse position
    var x = event.x || event.clientX || 0
    var y = event.y || event.clientY || 0

    // App.showContext
    this.showContext({
      element: this,
      type: 'main',
      x: x,
      y: y,
      graph: this.props.graph,
      itemKey: 'graph',
      item: this.props.graph
    })
  }

  keyDown (event) {
    // HACK metaKey global for taps https://github.com/Polymer/PointerGestures/issues/29
    if (event.metaKey || event.ctrlKey) {
      throw Error('Fix ME')
      // TheGraph.metaKeyPressed = true;
    }

    var key = event.keyCode,
      hotKeys = {
        // Delete
        46: function () {
          var graph = this.refs.graph.state.graph,
            selectedNodes = this.refs.graph.state.selectedNodes,
            selectedEdges = this.refs.graph.state.selectedEdges,
            menus = this.props.menus,
            menuOption = null,
            menuAction = null,
            nodeKey = null,
            node = null,
            edge = null

          for (nodeKey in selectedNodes) {
            if (selectedNodes.hasOwnProperty(nodeKey)) {
              node = graph.getNode(nodeKey)
              menus.node.actions.delete(graph, nodeKey, node)
            }
          }
          selectedEdges.map(function (edge) {
            menus.edge.actions.delete(graph, null, edge)
          })
        }.bind(this),
        // f for fit
        70: function () {
          this.triggerFit()
        }.bind(this),
        // s for selected
        83: function () {
          var graph = this.refs.graph.state.graph,
            selectedNodes = this.refs.graph.state.selectedNodes,
            nodeKey = null,
            node = null

          for (nodeKey in selectedNodes) {
            if (selectedNodes.hasOwnProperty(nodeKey)) {
              node = graph.getNode(nodeKey)
              this.focusNode(node)
              break
            }
          }
        }.bind(this)
      }

    if (hotKeys[key]) {
      hotKeys[key]()
    }
  }

  keyUp (event) {
    // Escape
    if (event.keyCode === 27) {
      if (!this.refs.graph) {
        return
      }
      this.refs.graph.cancelPreviewEdge()
    }
    // HACK metaKey global for taps https://github.com/Polymer/PointerGestures/issues/29
    throw Error('Fix ME')
    /*
     if (TheGraph.metaKeyPressed) {
     TheGraph.metaKeyPressed = false;
     }
     */
  }

  unselectAll (event) {
    // No arguments = clear selection
    this.props.onNodeSelection()
    this.props.onEdgeSelection()
  }

  renderGraph () {
    // not sure if this is the best place yet.
    this.refs.graph.markDirty()

    this.triggerAutolayout()
  }

  componentDidUpdate (prevProps, prevState) {
    this.renderCanvas(this.bgContext)
    if (!prevState || prevState.x !== this.state.x || prevState.y !== this.state.y || prevState.scale !== this.state.scale) {
      this.onPanScale()
    }
  }

  // any reason this can not just be rendered in AppCanvas?
  // let's hope not.
  // not that easy to send all these props to it though.
  // would need many more adjustments
  renderCanvas (c) {
    // Comment this line to go plaid
    c.clearRect(0, 0, this.state.width, this.state.height)

    // Background grid pattern
    var scale = this.state.scale
    var g = Config.nodeSize * scale

    var dx = this.state.x % g
    var dy = this.state.y % g
    var cols = Math.floor(this.state.width / g) + 1
    var row = Math.floor(this.state.height / g) + 1
    // Origin row/col index
    var oc = Math.floor(this.state.x / g) + (this.state.x < 0 ? 1 : 0)
    var or = Math.floor(this.state.y / g) + (this.state.y < 0 ? 1 : 0)

    while (row--) {
      var col = cols
      while (col--) {
        var x = Math.round(col * g + dx)
        var y = Math.round(row * g + dy)
        if ((oc - col) % 3 === 0 && (or - row) % 3 === 0) {
          // 3x grid
          c.fillStyle = 'white'
          c.fillRect(x, y, 1, 1)
        } else if (scale > 0.5) {
          // 1x grid
          c.fillStyle = 'grey'
          c.fillRect(x, y, 1, 1)
        }
      }
    }
  }

  getContext (menu, options, hide) {
    return Menu({
      menu: menu,
      options: options,
      triggerHideContext: hide,
      label: 'Hello',
      graph: this.props.graph,
      node: this,
      ports: [],
      process: [],
      processKey: null,
      x: options.x,
      y: options.y,
      nodeWidth: this.props.width,
      nodeHeight: this.props.height,
      deltaX: 0,
      deltaY: 0,
      highlightPort: false
    })
  }

  render () {
    // console.timeEnd('App.render');
    // console.time('App.render');

    // pan and zoom
    var sc = this.state.scale
    var x = this.state.x
    var y = this.state.y
    var transform = 'matrix(' + sc + ',0,0,' + sc + ',' + x + ',' + y + ')'

    var scaleClass = sc > Config.base.zbpBig ? 'big' : (sc > Config.base.zbpNormal ? 'normal' : 'small')

    var contextMenu, contextModal
    if (this.state.contextMenu) {
      var options = this.state.contextMenu
      var menu = this.props.getMenuDef(options)
      if (menu) {
        contextMenu = options.element.getContext(menu, options, this.hideContext)
      }
    }

    // is dynamically from many different components.
    if (contextMenu) {
      const modalBGOptions = {
        width: this.state.width,
        height: this.state.height,
        triggerHideContext: this.hideContext,
        children: contextMenu
      }

      contextModal = [
        AppModalBackground(modalBGOptions)
      ]
      this.menuShown = true
    } else {
      this.menuShown = false
    }

    var graphElementOptions = {
      graph: this.props.graph,
      scale: this.state.scale,
      app: this,
      library: this.props.library,
      onNodeSelection: this.props.onNodeSelection,
      onEdgeSelection: this.props.onEdgeSelection,
      showContext: this.showContext
    }

    graphElementOptions = merge(Config.app.graph, graphElementOptions)
    // var graphElement = createAppGraph(graphElementOptions);

    var svgGroupOptions = merge(Config.app.svgGroup, { transform: transform })
    // var svgGroup = createAppSvgGroup(svgGroupOptions, [graphElement]);

    var tooltipOptions = {
      x: this.state.tooltipX,
      y: this.state.tooltipY,
      visible: this.state.tooltipVisible,
      label: this.state.tooltip
    }

    tooltipOptions = merge(Config.app.tooltip, tooltipOptions)
    // var tooltip = createAppTooltip(tooltipOptions);

    var modalGroupOptions = merge(Config.app.modal, { children: contextModal })
    // var modalGroupOptions = Config.app.modal;
    // var modalGroup = createAppModalGroup(modalGroupOptions);

    /*
     var svgContents = [
     svgGroup,
     tooltip,
     modalGroup
     ];
     */

    var svgOptions = merge(Config.app.svg, { width: this.state.width, height: this.state.height })
    // var svg = createAppSvg(svgOptions, svgContents);

    var canvasOptions = merge(Config.app.canvas, { width: this.state.width, height: this.state.height })
    // var canvas = createAppCanvas(canvasOptions);

    var containerOptions = merge(Config.app.container, { style: { width: this.state.width, height: this.state.height } })
    containerOptions.className += ' ' + scaleClass

    // return createAppContainer(containerOptions, appContents);
    return (
      <div {...containerOptions}>
        <canvas {...canvasOptions} />
        <svg {...svgOptions}>
          <g {...svgGroupOptions}>
            <AppGraph {...graphElementOptions} />
          </g>
          <AppTooltip {...tooltipOptions} />
          <AppModalGroup {...modalGroupOptions} />
        </svg>
      </div>
    )
    /*
     return (
     <AppContainer {...containerOptions}>
     <AppCanvas {...canvasOptions} />
     <AppSvg {...svgOptions}>
     <AppSvgGroup {...svgGroupOptions}>
     <AppGraph {...graphElementOptions} />
     </AppSvgGroup>
     <AppTooltip {...tooltipOptions} />
     <AppModalGroup {...modalGroupOptions} />
     </AppSvg>
     </AppContainer>
     )
     */
  }
}
