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

import fromJSON from '../utils/fromJSON'

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
      'type': 'all',
      x: 10,
      y: 15
    },
    'out1': {
      'label': 'OUT1',
      'type': 'all',
      x: 10,
      y: 15
    },
    'out2': {
      'label': 'OUT2',
      'type': 'all',
      x: 10,
      y: 15
    }
  }
}

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')} />
  ))

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
      displaySelectionGroup={true}
      forceSelection={false}
      offsetY={10}
      offsetX={10}
    />)
  })

storiesOf('NodeMenu', module)
  .add('NodeMenu', () => {
    const graph = fromJSON(graphJson)

    const options = {
      graph,
      itemKey: {},
      item: {}
    }

    const nodeMenuOptions = {
      node: {
        props: {
          app: {
            state: {
             scale: 1
            }
          }
        }
      },
      ports,
      processKey: 'somekey',
      menu,
      options,
      triggerHideContext: true,
      icon: 'cog',
      label: 'The Label',
      nodeWidth: 100,
      nodeHeight: 100,
      highlightPort: true,
      deltaX: 10,
      deltaY: 10,
      x: 300,
      y: 150
    }

    return (
      <svg className='the-graph-dark'>
        <NodeMenu {...nodeMenuOptions} />
      </svg>)
  })

storiesOf('Graph', module)
  .add('The Graph', () => {
    const graph = fromJSON(graphJson)

    const graphOptions = {
      graph,
      library,
      app: {},
      scale: 1
    }

    return (
      <svg className='the-graph-dark'>
        <Graph {...graphOptions} />
      </svg>)
  })


storiesOf('Port', module)
  .add('IN', () => {
    const portProps = {
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

storiesOf('NodeMenuPorts', module)
  .add('Normal', () => {
    const inportOptions = {
      translateX: 300,
      translateY: 100,
      highlightPort: true,
      isIn: true,
      scale: 1,
      processKey: 'someKey',
      ports: ports.inports,
      route: 2,
      deltaX: 10,
      deltaY: 10,
      nodeWidth: 100,
      nodeHeight: 100
    }

    const outportOptions = {
      translateX: 320,
      translateY: 100,
      highlightPort: true,
      isIn: false,
      scale: 1,
      processKey: 'someKey',
      ports: ports.outports,
      route: 4,
      deltaX: 10,
      deltaY: 10,
      nodeWidth: 100,
      nodeHeight: 100
    }

    return (
      <svg className='the-graph-dark'>
        <NodeMenuPorts {...inportOptions} />
        <NodeMenuPorts {...outportOptions} />
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
