import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'
import Button from './Button'
import Welcome from './Welcome'
import NodeMenu from '../NodeMenu'
import NodeMenuPorts from '../NodeMenuPorts'
import App from '../App'
import Port from '../Port'
import Node from '../Node'
import Menu from '../Menu'
import Graph from '../Graph'
import Canvas from './Canvas'
import library from './library'

require('../utils/shims/rAF')

import nofloGraph from '../graph/noflo'
import fromJSON from '../utils/fromJSON'

console.log(nofloGraph)

document
  .getElementById('root')
  .classList.add('the-graph-dark')

const {svg} = React.DOM

const node = {
  component: 'console/log',
  id: 'console/log_1',
  metadata: {
    height: 72,
    width: 72,
    label: 'console/log',
    x: 10,
    y: 10
  }
}
const app = {}
const graphView = {}

const menus = {}

const menuOptions = {
  graph: {},
  itemKey: {},
  item: {}
}

const menu = {
  icon: 'sign-out',
  iconColor: 5,
  n4: {
    label: 'outport'
  },
  s4: {
    icon: 'trash-o',
    iconLabel: 'delete',
    action: function (graph, itemKey, item) {
      graph.removeOutport(itemKey)
    }
  }
}

const ports = {
  inports: {
    'in0': {
      'label': 'IN0',
      'type': 'all',
      x: 10,
      y: 10
    },
    'in1': {
      'label': 'IN1',
      'type': 'all',
      x: 10,
      y: 15
    },
    'in2': {
      'label': 'IN2',
      'type': 'all',
      x: 10,
      y: 20,
      route: 1
    }
  },
  outports: {
    'out0': {
      'label': 'OUT0',
      'type': 'all'
    },
    'out1': {
      'label': 'OUT1',
      'type': 'all'
    },
    'out2': {
      'label': 'OUT2',
      'type': 'all'
    }
  }
}

let graphJson = {
  'properties': {
    'name': 'Count lines in a file'
  },
  'processes': {
    'basic': { 'component': 'basic' },
    'basic2': { 'component': 'basic' },
    'basic3': { 'component': 'basic' },
    'basic4': { 'component': 'basic' },
    'tall': {
      'component': 'tall'
    }
  },
  'connections': [
    {
      'data': 'package.json',
      'tgt': {
        'process': 'basic',
        'port': 'in1'
      }
    },
    { 'src': { 'process': 'basic', 'port': 'out' }, 'tgt': { 'process': 'tall', 'port': 'in1' } },
    { 'src': { 'process': 'basic2', 'port': 'out' }, 'tgt': { 'process': 'tall', 'port': 'in2' } },
    { 'src': { 'process': 'basic3', 'port': 'out' }, 'tgt': { 'process': 'tall', 'port': 'in3' } },
    { 'src': { 'process': 'basic4', 'port': 'out' }, 'tgt': { 'process': 'tall', 'port': 'in4' } }
  ]
}


storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
  ))

/*
 {
 graph: this.props.graph, // is het network, dus niet de json.. graph.on() etc.
 scale: this.state.scale,
 app: this,  << see what this is used for
 library: this.props.library,
 onNodeSelection: this.props.onNodeSelection,
 onEdgeSelection: this.props.onEdgeSelection,
 showContext: this.showContext
 };
 */

storiesOf('App', module)
  .add('App', () => {
    const graph = fromJSON(graphJson)

    return (<App
      graph={graph}
      width={800}
      minZoom={0.5}
      maxZoom={5}
      height={600}
      library={library}
      menus={menus}
      editable
      onEdgeSelection={function onEdgeSelection () {}}
      onNodeSelection={function onNodeSelection () {}}
      onPanScale={function onPanScale () {}}
      getMenuDef={function getMenuDef () {}}
      displaySelectionGroup={function displaySelectionGroup () {}}
      forceSelection={false}
      offsetY={10}
      offsetX={10}
    />)
  })

/*
storiesOf('Graph', module)
  .add('The Graph', () => {
    const graph = fromJSON(graphJson)

    return (
      <svg className='the-graph-dark'>
        <Graph app={{}} graph={graph} library={library} scale={1} />
      </svg>)
  })
*/

/* props node port
 var props = {
 app: app,
 graph: graph,
 node: node,
 key: processKey + '.in.' + info.label, || '.out.'
 label: info.label,
 processKey: processKey,
 isIn: true,
 isExport: isExport,
 nodeX: x,
 nodeY: y,
 nodeWidth: width,
 nodeHeight: height,
 x: info.x,
 y: info.y,
 port: {process:processKey, port:info.label, type:info.type},
 highlightPort: highlightPort,
 route: info.route,
 showContext: showContext
 };
 */

/*
storiesOf('Port', module)
  .add('IN', () => (
    <svg className='the-graph-dark'>
      <Port label='IN' />
    </svg>
  ))
*/

/* Node Options
 {
 key: key,
 nodeID: key,
 x: node.metadata.x,
 y: node.metadata.y,
 label: node.metadata.label,
 sublabel: node.metadata.sublabel || node.component,
 width: node.metadata.width,
 height: node.metadata.height,
 app: self.props.app,
 graphView: self,
 graph: graph,
 node: node,
 icon: icon,
 iconsvg: iconsvg,
 ports: self.getPorts(graph, key, node.component),
 onNodeSelection: self.props.onNodeSelection,
 selected: selected,
 error: (self.state.errorNodes[key] === true),
 showContext: self.props.showContext,
 highlightPort: highlightPort
 };
 */

storiesOf('Node', module)
  .add('Node', () => {
    // metadata for ports required.
    const graph = fromJSON(graphJson)

    return (
      <svg className='the-graph-dark'>
        <g className='graph'>
          <g className='nodes'>
            <Node
              app={app}
              graph={graph}
              graphView={graphView}
              node={node}
              icon='cog'
              iconsvg=''
              nodeID='console/log_1'
              ports={ports}
              label='Console Log'
              sublabel='console/log'
              width={200}
              height={100}
              x={0}
              y={0}
              error={false}
              selected={false}
              highlightPort={false}
              onNodeSelection={function () { alert('onNodeSelection') }}
            />
          </g>
        </g>
      </svg>
    )
  })

/* Node Menu Options
 {
 menu: menu,
 options: options,
 triggerHideContext: hide,
 label: this.props.label,
 graph: this.props.graph,
 graphView: this.props.graphView,
 node: this,
 icon: this.props.icon,
 ports: ports,
 process: this.props.node,
 processKey: processKey,
 x: x,
 y: y,
 nodeWidth: this.props.width,
 nodeHeight: this.props.height,
 deltaX: deltaX,
 deltaY: deltaY,
 highlightPort: highlightPort
 }
 */

/* Node Menu Ports
 {
 ports: ports.inports, || outports
 triggerHideContext: hide,
 isIn: true,
 scale: scale,
 processKey: processKey,
 deltaX: deltaX,
 deltaY: deltaY,
 translateX: x,
 translateY: y,
 nodeWidth: this.props.width,
 nodeHeight: this.props.height,
 highlightPort: highlightPort
 }
 */

/*
storiesOf('NodeMenuPorts', module)
  .add('IN', () => (
    <svg className='the-graph-dark'>
      <NodeMenuPorts ports={ports} nodeWidth={100} nodeHeight={100} label='IN' />
    </svg>
  ))
*/

/*
 {
 menu: PropTypes.object.isRequired,
 options: PropTypes.object.isRequired,
 x: PropTypes.number,
 y: PropTypes.number,
 label: PropTypes.string,
 icon: PropTypes.string,
 iconColor: PropTypes.string
 }
 */

/*
storiesOf('Menu', module)
  .add('Menu', () => (
    <svg>
      <Menu
        menu={menu}
        options={menuOptions}
        x={100}
        y={100}
        label='The Menu'
        icon='code'
        iconColor='green'
      />
    </svg>
  ))
*/

/*
 {
 graph: this.graph,
 width: this.width,
 minZoom: this.minZoom,
 maxZoom: this.maxZoom,
 height: this.height,
 library: this.library,
 menus: this.menus,
 editable: this.editable,
 onEdgeSelection: this.onEdgeSelection.bind(this),
 onNodeSelection: this.onNodeSelection.bind(this),
 onPanScale: this.onPanScale.bind(this),
 getMenuDef: this.getMenuDef,
 displaySelectionGroup: this.displaySelectionGroup,
 forceSelection: this.forceSelection,
 offsetY: this.offsetY,
 offsetX: this.offsetX
 }
 */

/* App
 {
 graph: this.graph,
 width: this.width,
 minZoom: this.minZoom,
 maxZoom: this.maxZoom,
 height: this.height,
 library: this.library,
 menus: this.menus,
 editable: this.editable,
 onEdgeSelection: this.onEdgeSelection.bind(this),
 onNodeSelection: this.onNodeSelection.bind(this),
 onPanScale: this.onPanScale.bind(this),
 getMenuDef: this.getMenuDef,
 displaySelectionGroup: this.displaySelectionGroup,
 forceSelection: this.forceSelection,
 offsetY: this.offsetY,
 offsetX: this.offsetX
 }
 */

