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
import MenuSlice from '../factories/menu/MenuSlice'
import Graph from '../Graph'
import Canvas from './Canvas'
import {graph as graphJson, library} from './fixtures'

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
      theme="the-graph-light"
      editable
      onEdgeSelection={() => alert('edge selected')}
      onNodeSelection={() => alert('node selected')}
      onPanScale={() => console.log('scaling')}
      getMenuDef={() => {}}
      displaySelectionGroup={() => {}}
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

/*
{
  app,
    graph,
    node,
    key: `${nodeID}.${type}.${info.label}`,
  label: info.label,
  processKey: nodeID,
  isIn: type === 'in',
  isExport,
  nodeX: x,
  nodeY: y,
  nodeWidth: width,
  nodeHeight: height,
  x: info.x,
  y: info.y,
  port: {
  process: nodeID,
    port: info.label,
    type: info.type
},
  highlightPort,
    route: info.route,
  showContext
}
*/

var portProps = {
  // neede for current state of scale
  app: {
    state: {
      scale: 5
    }
  },
  // needed for embedded showContext
  // showContext is a function which sets the state on the entire app
  // see App#showContext
  graph: {},

  // is never used
  // node: node,
  // key: processKey + '.in.' + info.label, || '.out.'
  label: 'INPUT',
  isIn: true,
  port: {
    process: 'someProcess',
    port: 'IN',
    type: 'any'
  },
  processKey: 'someProcess',
  route: 5,
  x: 30,
  y: 30,
  // normally is a function which sets the state for the App
  showContext: () => alert('Show context'),
  isExport: false,
  highlightPort: false
};

storiesOf('Port', module)
  .add('IN', () => {
    const svgProps = {
      className: 'the-graph-dark big'
    }

    return (
      <svg {...svgProps}>
        <Port {...portProps} />
      </svg>
    )
  })

storiesOf('MenuSlice', module)
  .add('The Slice', () => {

    // Too much goes in
    const menu = {
      n4: {
        label: 'outport'
      },
      s4: {
        icon: 'trash-o',
        iconLabel: 'delete',
      }
    }

    const menuSliceOptions = {
      menu,
      direction: 's4',
      tappable: true,
      onTap: function (direction) {
        alert(`Tapped ${direction}`)
      },
      positions: {
        IconX: 0,
        IconY: 52,
        LabelX: 0,
        LabelY: 35
      }
    }

    return (
      <svg className='the-graph-dark'>
        <MenuSlice {...menuSliceOptions} />
      </svg>
    )
  })

storiesOf('Menu', module)
  .add('Normal', () => {
    const graph = fromJSON(graphJson)
    /* passes more options the now defined in Menu
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
     */
    const menu = {
      n4: {
        label: 'outport'
      },
      s4: {
        icon: 'trash-o',
        iconLabel: 'delete',
        action: function (graph, itemKey, item) {
          alert('DELETE')
        }
      }
    }

    const menuOptions = {
      icon: 'sign-out',
      iconColor: 5,
      x: 75,
      y: 75,
      label: 'The Menu',
      menu,
      options: {
        graph,
        itemKey: {},
        item: {}
      }
    }

    return (
      <svg className='the-graph-dark'>
        <Menu {...menuOptions} />
      </svg>
    )
  })

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

