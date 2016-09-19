import React from 'react'
import { storiesOf, action, linkTo } from '@kadira/storybook'
import Welcome from './Welcome'
import NodeMenu from '../NodeMenu'
import NodeMenuPort from '../NodeMenuPort'
import NodeMenuPorts from '../NodeMenuPorts'
import App from '../App'
import Port from '../Port'
import Node from '../Node'
import Menu from '../Menu'
import MenuSlice from '../factories/menu/MenuSlice'
import Graph from '../Graph'
import fromJSON from '../utils/fromJSON'
import {
  graph as graphJson,
  library,
  node,
  menu,
  menus,
  ports
} from './fixtures'

require('../utils/shims/rAF')

const app = {}
const graphView = {}

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
      onEdgeSelection={action('On Edge Selection')}
      onNodeSelection={action('On Node Selection')}
      onPanScale={action('On Pan Scale')}
      getMenuDef={action('Get Menu Def')}
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
      </svg>
    )
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
      showContext: action('Show Context'),
      isExport: false,
      highlightPort: false
    };
    const svgProps = {
      className: 'the-graph-dark big'
    }

    return (
      <svg {...svgProps}>
        <g className='graph'>
          <g className='nodes'>
            <Port {...portProps} />
          </g>
        </g>
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

    const menuSliceOptions1 = {
      menu,
      direction: 's4',
      tappable: true,
      onTap: action('On Tap'),
      positions: {
        IconX: 0,
        IconY: 52,
        LabelX: 0,
        LabelY: 35
      }
    }

    const menuSliceOptions2 = {
      menu,
      direction: 'n4',
      tappable: true,
      onTap: action('On Tap'),
      positions: {
        IconX: 0,
        IconY: -52,
        LabelX: 0,
        LabelY: -35
      }
    }

    return (
      <svg className='the-graph-dark'>
        <g transform="translate(120,85)">
          <MenuSlice {...menuSliceOptions1} />
          <MenuSlice {...menuSliceOptions2} />
        </g>
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

storiesOf('NodeMenuPort', module)
  .add('Normal', () => {
    const inportOptions = {
      label: 'IN1',
      isIn: true,
      processKey: 'process1',
      port: ports.inports.in0,
      route: 2,
      x: 200,
      y: 100
    }

    const outportOptions = {
      label: 'OUT1',
      isIn: false,
      processKey: 'process2',
      port: ports.outports.out0,
      route: 4,
      x: 350,
      y: 100
    }

    const highlightPortInOptions = {
      label: 'IN2',
      highlightPort: {
        isIn: true,
        type: 'all',
      },
      isIn: true,
      type: 'all',
      processKey: 'process3',
      port: ports.inports.in1,
      route: 3,
      x: 200,
      y: 180
    }

    const highlightPortOutOptions = {
      label: 'OUT2',
      highlightPort: {
        isIn: false,
        type: 'all',
      },
      isIn: false,
      type: 'all',
      processKey: 'process3',
      port: ports.outports.out2,
      route: 3,
      x: 350,
      y: 180
    }

    return (
      <svg className='the-graph-dark'>
        <NodeMenuPort {...inportOptions} />
        <NodeMenuPort {...outportOptions} />
        <NodeMenuPort {...highlightPortInOptions} />
        <NodeMenuPort {...highlightPortOutOptions} />
      </svg>
    )
  })

storiesOf('Menu', module)
  .add('Normal', () => {
    const graph = fromJSON(graphJson)

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
              onNodeSelection={action('onNodeSelection')}
            />
          </g>
        </g>
      </svg>
    )
  })
