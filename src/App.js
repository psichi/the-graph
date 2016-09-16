import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {
  findAreaFit,
  findFit,
  findNodeFit,
  klayNoflo,
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

    const {width, height, minZoom, maxZoom, offsetY, offsetX} = this.props

    this.state = {
      /*
       x: fit.x,
       y: fit.y,
       scale: fit.scale,
       */
      width,
      height,
      minZoom,
      maxZoom,
      offsetY,
      offsetX,
      tooltip: '',
      tooltipX: 0,
      tooltipY: 0,
      tooltipVisible: false,
      contextElement: null,
      contextType: null
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
  }

  componentWillMount () {
    // Initializes the autolayouter
    this.autolayouter = klayNoflo.create({
      onSuccess: this.applyAutolayout.bind(this),
      workerScript: 'klayjs/klay.js'
    })
  }

  componentWillUnmount () {
    this.autolayouter.destroy()
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
  // Note: klay upgrade will cause NaN bug on x & y metadata
  applyAutolayout (layoutedKGraph) {
    const {graph, snap} = this.props

    if (!snap) {
      return
    }

    if (layoutedKGraph.stacktrace) {
      throw Error(layoutedKGraph.text)
    }

    graph.startTransaction('autolayout')
    // Update original graph nodes with the new coordinates from KIELER graph
    const children = layoutedKGraph.children.slice()
    let i
    let len
    for (i = 0, len = children.length; i < len; i++) {
      const klayNode = children[i]
      const nofloNode = graph.getNode(klayNode.id)

      // Encode nodes inside groups
      if (klayNode.children) {
        let idx
        const klayChildren = klayNode.children

        for (idx in klayChildren) {
          const klayChild = klayChildren[idx]
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
        graph.setNodeMetadata(klayNode.id, {
          x: Math.round(klayNode.x / snap) * snap,
          y: Math.round(klayNode.y / snap) * snap
        })
      } else {
        // Find inport or outport
        const idSplit = klayNode.id.split(':::')
        const expDirection = idSplit[0]
        const expKey = idSplit[1]
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

    const {minZoom, maxZoom, scale: scaleState, x: currentX, y: currentY} = this.state

    // Speed limit
    let zoomFactor

    zoomFactor = this.zoomFactor / -500
    zoomFactor = Math.min(0.5, Math.max(-0.5, zoomFactor))

    let scale

    scale = this.state.scale + (this.state.scale * zoomFactor)

    this.zoomFactor = 0

    if (scale < minZoom) {
      scale = minZoom
    } else if (scale > maxZoom) {
      scale = maxZoom
    }

    if (scale === scaleState) { return }

    // Zoom and pan transform-origin equivalent
    const scaleD = scale / scaleState
    const oX = this.zoomX
    const oY = this.zoomY
    const x = scaleD * (currentX - oX) + oX
    const y = scaleD * (currentY - oY) + oY

    this.setState({
      scale,
      x,
      y,
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

    const {minZoom} = this.props

    // Hammer.js
    const {scale: currentScale, x: currentX, y: currentY} = this.state
    const {scale: scaleEvent, center: {x: oX, y: oY}} = event
    const scaleDelta = 1 + (scaleEvent - this.lastScale)

    this.lastScale = scaleEvent

    let scale

    scale = scaleDelta * currentScale
    scale = Math.max(scale, minZoom)

    // Zoom and pan transform-origin equivalent
    const deltaX = oX - this.lastX
    const deltaY = oY - this.lastY
    const x = scaleDelta * (currentX - oX) + oX + deltaX
    const y = scaleDelta * (currentY - oY) + oY + deltaY

    this.lastX = oX
    this.lastY = oY

    this.setState({
      scale,
      x,
      y,
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

    const domNode = findDOMNode(this)

    domNode.addEventListener('track', this.onTrack)
    domNode.addEventListener('trackend', this.onTrackEnd)
  }

  onTrack (event) {
    if (this.pinching) { return }

    const {x, y} = this.state
    const {ddx, ddy} = event

    this.setState({
      x: x + ddx,
      y: y + ddy
    })
  }

  onTrackEnd (event) {
    // Don't click app (unselect)
    event.stopPropagation()

    const domNode = findDOMNode(this)

    domNode.removeEventListener('track', this.onTrack)
    domNode.removeEventListener('trackend', this.onTrackEnd)
  }

  onPanScale () {
    const {x, y, scale} = this.state
    const {onPanScale} = this.props

    // Pass pan/scale out to the-graph
    if (onPanScale) {
      onPanScale(x, y, scale)
    }
  }

  showContext (contextMenu) {
    this.setState({
      contextMenu,
      tooltipVisible: false
    })
  }

  hideContext (/* event */) {
    this.setState({
      contextMenu: null
    })
  }

  changeTooltip (event) {
    const {width: widthProp} = this.props
    const {detail: {x: xDetail, y: yDetail, tooltip}} = event

    // Don't go over right edge
    let tooltipX

    tooltipX = xDetail + 10

    const width = tooltip.length * 6

    if (tooltipX + width > widthProp) {
      tooltipX = xDetail - width - 10
    }

    this.setState({
      tooltip,
      tooltipVisible: true,
      tooltipX,
      tooltipY: yDetail + 20
    })
  }

  hideTooltip (event) {
    this.setState({
      tooltip: '',
      tooltipVisible: false
    })
  }

  triggerFit (event) {
    const {graph, width, height} = this.props

    const {x, y, scale} = findFit(graph, width, height)

    this.setState({
      x,
      y,
      scale
    })
  }

  focusNode (node) {
    const {width, height, scale, x: currentX , y: currentY}  = this.state

    const duration = Config.focusAnimationDuration

    const fit = findNodeFit(node, width, height)

    const start_point = {
      x: -(currentX - width / 2) / scale,
      y: -(currentY - height / 2) / scale
    }

    const end_point = {
      x: node.metadata.x,
      y: node.metadata.y
    }

    const graphfit = findAreaFit(start_point, end_point, width, height)

    const scale_ratio_1 = Math.abs(graphfit.scale - scale)
    const scale_ratio_2 = Math.abs(fit.scale - graphfit.scale)
    const scale_ratio_diff = scale_ratio_1 + scale_ratio_2

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
    const {graph} = this.refs

    // Listened from PortMenu.edgeStart() and Port.edgeStart()
    graph.edgeStart(event)

    this.hideContext()
  }

  componentDidMount () {
    const {graph, width, height, onNodeSelection} = this.props

    // Autofit (not sure whether this is the correct location to do it
    var {x, y, scale} = findFit(graph, width, height)

    this.setState({
      x,
      y,
      scale
    })

    const domNode = findDOMNode(this)

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
    if (onNodeSelection) {
      domNode.addEventListener('tap', this.unselectAll)
    }

    // Don't let Hammer.js collide with polymer-gestures
    let hammertime

    if (Hammer) {
      hammertime = new Hammer(domNode, {})
      hammertime.get('pinch').set({ enable: true })
    }

    // Pointer gesture event for pan
    domNode.addEventListener('trackstart', this.onTrackStart)

    const isTouchDevice = 'ontouchstart' in document.documentElement

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
    this.mouseX = Math.floor(width / 2)
    this.mouseY = Math.floor(height / 2)

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

    const {graph} = this.props

    // Get mouse position
    const x = event.x || event.clientX || 0
    const y = event.y || event.clientY || 0

    // App.showContext
    this.showContext({
      element: this,
      type: 'main',
      x,
      y,
      graph,
      itemKey: 'graph',
      item: graph
    })
  }

  keyDown (event) {
    const {metaKey, ctrlKey, keyCode} = event

    // HACK metaKey global for taps https://github.com/Polymer/PointerGestures/issues/29
    if (metaKey || ctrlKey) {
      throw Error('Fix ME')
      // TheGraph.metaKeyPressed = true;
    }

    const {
      graph: {
        state: {
          graph,
          selectedNodes,
          selectedEdges,
        }
      }

    } = this.refs

    const {menus} = this.props

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
        let  nodeKey

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

  unselectAll (/* event */) {
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

  renderCanvas (c) {
    const {width, height, scale, x: currentX, y: currentY} = this.state

    // Comment this line to go plaid
    c.clearRect(0, 0, width, height)

    // Background grid pattern
    const g = Config.nodeSize * scale

    const dx = currentX % g
    const dy = currentY % g

    const cols = Math.floor(width / g) + 1
    let row = Math.floor(height / g) + 1

    // Origin row/col index
    const oc = Math.floor(currentX / g) + (currentX < 0 ? 1 : 0)
    const or = Math.floor(currentY / g) + (currentY < 0 ? 1 : 0)

    while (row--) {
      let col = cols
      while (col--) {
        const x = Math.round(col * g + dx)
        const y = Math.round(row * g + dy)

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

  getContext (menu, options, triggerHideContext) {
    const {graph, width: nodeWidth, height: nodeHeight} = this.props
    const {x, y} = options

    return Menu({
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
    })
  }

  render () {
    // console.timeEnd('App.render');
    // console.time('App.render');

    // pan and zoom
    const {contextMenu: currentContextMenu, scale, x, y, tooltip, tooltipX, tooltipY, tooltipVisible, width, height} = this.state
    const {graph, library, onNodeSelection, onEdgeSelection} = this.props

    const transform = 'matrix(' + scale + ',0,0,' + scale + ',' + x + ',' + y + ')'

    const scaleClass = scale > Config.base.zbpBig ? 'big' : (scale > Config.base.zbpNormal ? 'normal' : 'small')

    let contextMenu
    let contextModal

    if (currentContextMenu) {
      var menu = this.props.getMenuDef(currentContextMenu)
      if (menu) {
        contextMenu = currentContextMenu.element.getContext(menu, currentContextMenu, this.hideContext)
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

    const graphElementOptions = {
      ...Config.app.graph,
      graph,
      scale,
      app: this,
      library,
      onNodeSelection,
      onEdgeSelection,
      showContext: this.showContext
    }

    // var graphElement = createAppGraph(graphElementOptions);

    const svgGroupOptions = {
      ...Config.app.svgGroup,
      transform
    }

    // var svgGroup = createAppSvgGroup(svgGroupOptions, [graphElement]);

    const tooltipOptions = {
      ...Config.app.tooltip,
      x: tooltipX,
      y: tooltipY,
      visible: tooltipVisible,
      label: tooltip
    }

    // var tooltip = createAppTooltip(tooltipOptions);
    const modalGroupOptions = {
      ...Config.app.modal,
      children: contextModal
    }

    // var modalGroupOptions = Config.app.modal;
    // var modalGroup = createAppModalGroup(modalGroupOptions);

    /*
     var svgContents = [
     svgGroup,
     tooltip,
     modalGroup
     ];
     */

    const svgOptions = {
      ...Config.app.svg,
      width,
      height
    }

    // var svg = createAppSvg(svgOptions, svgContents);
    const canvasOptions = {
      ...Config.app.canvas,
      width,
      height
    }
    // var canvas = createAppCanvas(canvasOptions);

    const containerOptions = {
      ...Config.app.container,
      style: {
        width,
        height
      }
    }

    containerOptions.className += ' ' + scaleClass

    // return createAppContainer(containerOptions, appContents);
    return (
      <div id="svgcontainer" className="the-graph-dark">
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
      </div>
    )
    /*
    return (
      <div id="svgcontainer" className="the-graph-dark">
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
      </div>
    )
    */
  }
}
