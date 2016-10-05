import React from 'react'
import { FONT_AWESOME } from '../config/'
import { storiesOf, action, linkTo } from '@kadira/storybook'
import { withKnobs, text, boolean, number, select } from '@kadira/storybook-addon-knobs'
import Welcome from './Welcome'
import NodeMenu from '../NodeMenu'
import NodeMenuPort from '../NodeMenuPort'
import NodeMenuPorts from '../NodeMenuPorts'
import App from '../App'
import Edge from '../Edge'
import IIP from '../Iip'
import Port from '../Port'
import Node from '../Node'
import Menu from '../Menu'
import MenuSlice from '../factories/menu/MenuSlice'
import Graph from '../Graph'
import Editor from '../Editor'
import Group from '../Group'
import Tooltip from '../Tooltip'
import TextBG from '../common/TextBG'
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

const icons = Object.keys(FONT_AWESOME)
const routes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const themes = [
  'the-graph-dark',
  'the-graph-light'
]
const app = {}
const graphView = {}

storiesOf('The Graph', module)
  .addDecorator(withKnobs)
  .add('Editor', () => {
    const graph = fromJSON(graphJson)

    return (<Editor
      graph={graph}
      width={800}
      minZoom={0.5}
      maxZoom={5}
      height={600}
      library={library}
      menus={menus}
      theme={select('Theme', themes, 'the-graph-light')}
      editable
      onEdgeSelection={action('On Edge Selection')}
      onNodeSelection={action('On Node Selection')}
      onEdgeStart={action('onEdgeStart')}
      onEdgeDraw={action('onEdgeDraw')}
      onEdgeDrop={action('onEdgeDrop')}
      onPanScale={action('On Pan Scale')}
      getMenuDef={action('Get Menu Def')}
      displaySelectionGroup
      forceSelection={false}
      offsetY={number('OffsetY', 10)}
      offsetX={number('OffsetX', 10)}
    />)
  })
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
      theme={select('Theme', themes, 'the-graph-light')}
      editable
      onEdgeSelection={action('On Edge Selection')}
      onNodeSelection={action('On Node Selection')}
      onEdgeStart={action('onEdgeStart')}
      onEdgeDraw={action('onEdgeDraw')}
      onEdgeDrop={action('onEdgeDrop')}
      onPanScale={action('On Pan Scale')}
      getMenuDef={action('Get Menu Def')}
      displaySelectionGroup
      forceSelection={false}
      offsetY={number('OffsetY', 10)}
      offsetX={number('OffsetX', 10)}
    />)
  })
  .add('Graph', () => {
    const graph = fromJSON(graphJson)

    const graphOptions = {
      graph,
      library,
      app: {},
      scale: number('Scale', 1),
      onEdgeStart: action('onEdgeStart'),
      onEdgeDraw: action('onEdgeDraw'),
      onEdgeDrop: action('onEdgeDrop')
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <Graph {...graphOptions} />
      </svg>
    )
  })
  .add('Node', () => {
    // metadata for ports required.
    const graph = fromJSON(graphJson)

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g className="graph">
          <g className="nodes">
            <Node {...node}
              label={text('Text', node.label)}
              icon={select('Icon', icons, node.icon)}
              error={boolean('Error', node.error)}
              x={number('X', node.x)}
              y={number('Y', node.y)}
              width={number('Width', node.width)}
              height={number('Height', node.height)}
              onNodeSelection={action('onNodeSelection')}
              onTrackStart={action('onTrackStart')}
              onTrack={action('onTrack')}
              onTrackEnd={action('onTrackEnd')}
              onEdgeStart={action('onEdgeStart')}
              onEdgeDraw={action('onEdgeDraw')}
              onEdgeDrop={action('onEdgeDrop')}
            />
          </g>
        </g>
      </svg>
    )
  })
  .add('Edge', () => {
    const graph = fromJSON(graphJson)

    const edgeOptions = {
      onEdgeSelection: action('Edge Selection'),
      showContext: action('Show Context'),
      app: {},
      edgeID: 'edge-id',
      edge: {

      },
      export: boolean('Export', false),
      isIn: boolean('isIn', true),
      graph,
      exportKey: '',
      label: text('Label', 'The Edge'),
      route: select('Route No.', routes, 2),
      sX: number('sX', 100),
      sY: number('sY', 30),
      tX: number('tX', 300),
      tY: number('tY', 50),
      selected: boolean('Selected', false),
      animated: boolean('Animated', false)
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g className="graph">
          <Edge {...edgeOptions} />
        </g>
      </svg>
    )
  })
  .add('Port', () => {
    const portProps = {
      scale: 5,
      // needed for embedded showContext
      // showContext is a function which sets the state on the entire app
      // see App#showContext
      graph: {},

      onEdgeStart: action('onEdgeStart'),
      onEdgeDraw: action('onEdgeDraw'),
      onEdgeDrop: action('onEdgeDrop'),

      // is never used
      // node: node,
      // key: processKey + '.in.' + info.label, || '.out.'
      label: text('Label', 'INPUT'),
      isIn: boolean('isIn', true),
      port: {
        process: 'someProcess',
        port: 'IN',
        type: 'any'
      },
      processKey: 'someProcess',
      route: select('Route', routes, 5),
      x: number('x', 30),
      y: number('y', 30),
      // normally is a function which sets the state for the App
      showContext: action('Show Context'),
      isExport: boolean('isExport', false),
      highlightPort: boolean('highlightPort', false)
    }
    const svgProps = {
      className: 'the-graph-dark big'
    }

    return (
      <svg {...svgProps}>
        <g className="graph">
          <g className="nodes">
            <Port {...portProps} />
          </g>
        </g>
      </svg>
    )
  })
  .add('IIP', () => {
    const graph = fromJSON(graphJson)

    const iipOptions = {
      label: 'IN1',
      x: 150,
      y: 100
    }

    const iipOptions2 = {
      label: 'IN2',
      x: 150,
      y: 200
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g className="graph big">
          <IIP {...iipOptions} />
          <IIP {...iipOptions2} />
        </g>
      </svg>
    )
  })
  .add('Group', () => {
    const graph = fromJSON(graphJson)

    const groupOptions = {
      app: {
        menuShown: true
      },
      label: text('Label', 'IN1'),
      graph,
      item: {},
      color: select('Color', routes, 2),
      description: text('Description', 'Group Description'),
      minX: number('minX', 100),
      maxX: number('maxX', 400),
      minY: number('minY', 100),
      maxY: number('maxY', 250),
      isSelectionGroup: boolean('isSelectionGroup', false),
      showContext: action('Show Context'),
      triggerMoveGroup: action('triggerMoveGroup')
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g className="graph big">
          <g className="groups">
            <Group {...groupOptions} />
          </g>
        </g>
      </svg>
    )
  })
  .add('Menu', () => {
    const graph = fromJSON(graphJson)

    const menuOptions = {
      icon: 'sign-out',
      iconColor: select('iconColor', routes, 5),
      x: number('x', 75),
      y: number('y', 75),
      label: text('Label', 'The Menu'),
      menu,
      options: {
        graph,
        itemKey: {},
        item: {}
      }
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <Menu {...menuOptions} />
      </svg>
    )
  })
  .add('NodeMenuPorts', () => {
    const portOptions = {
      translateX: number('translateX', 300),
      translateY: number('translateY', 100),
      highlightPort: boolean('highlightport', true),
      isIn: boolean('isIn', true),
      scale: number('scale', 1),
      processKey: 'inportKey',
      ports: ports.inports,
      route: select('route', routes, 2),
      deltaX: number('deltaX', 10),
      deltaY: number('deltaY', 10),
      nodeWidth: number('nodeWidth', 100),
      nodeHeight: number('nodeHeight', 100)
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <NodeMenuPorts {...portOptions} />
      </svg>
    )
  })
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
      triggerHideContext: boolean('triggerHideContext', true),
      icon: select('icon', icons, 'cog'),
      label: text('Lable', 'The Label'),
      nodeWidth: number('nodeWidth', 100),
      nodeHeight: number('nodeHeight', 100),
      highlightPort: boolean('highlightPort', true),
      deltaX: number('deltaX', 10),
      deltaY: number('deltaY', 10),
      x: number('x', 300),
      y: number('y', 150)
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <NodeMenu {...nodeMenuOptions} />
      </svg>)
  })
  .add('MenuSlice', () => {
    const menu = {
      n4: {
        label: 'outport'
      },
      s4: {
        icon: 'trash-o',
        iconLabel: 'delete'
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
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g transform="translate(120,85)">
          <MenuSlice {...menuSliceOptions1} />
          <MenuSlice {...menuSliceOptions2} />
        </g>
      </svg>
    )
  })
  .add('NodeMenuPort', () => {
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
        type: 'all'
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
        type: 'all'
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
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <NodeMenuPort {...inportOptions} />
        <NodeMenuPort {...outportOptions} />
        <NodeMenuPort {...highlightPortInOptions} />
        <NodeMenuPort {...highlightPortOutOptions} />
      </svg>
    )
  })
  .add('Tooltip', () => {
    const graph = fromJSON(graphJson)

    const tooltipOptions = {
      label: 'IN1',
      x: 150,
      y: 100,
      visible: true
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g className="graph big">
          <Tooltip {...tooltipOptions} />
        </g>
      </svg>
    )
  })
  .add('TextBG', () => {
    const options = {
      text: 'Text',
      height: 100,
      x: 300,
      y: 100,
      halign: 'right',
      className: 'iip-info'
      // textClassName: ''
    }

    return (
      <svg className={select('Theme', themes, 'the-graph-dark')}>
        <g className="graph">
          <TextBG {...options} />
        </g>
      </svg>
    )
  })
