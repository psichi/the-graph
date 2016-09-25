export default {
  caseSensitive: false,
  properties: {
    name: 'Count lines in a file'
  },
  inports: {},
  outports: {},
  groups: [],
  processes: {
    basic: {
      component: 'basic',
      metadata: {
        x: 36,
        y: 36,
        width: 72,
        height: 72,
        label: 'basic'
      }
    },
    basic2: {
      component: 'basic',
      metadata: {
        x: 36,
        y: 180,
        width: 72,
        height: 72,
        label: 'basic2'
      }
    },
    basic3: {
      component: 'basic',
      metadata: {
        x: 36,
        y: 324,
        width: 72,
        height: 72,
        label: 'basic3'
      }
    },
    basic4: {
      component: 'basic',
      metadata: {
        x: 36,
        y: 468,
        width: 72,
        height: 72,
        label: 'basic4'
      }
    },
    tall: {
      component: 'tall',
      metadata: {
        x: 180,
        y: 180,
        width: 72,
        height: 120,
        label: 'tall'
      }
    }
  },
  connections: [
    {
      src: {
        process: 'basic',
        port: 'out'
      },
      tgt: {
        process: 'tall',
        port: 'in1'
      },
      metadata: {
        route: 1
      }
    },
    {
      src: {
        process: 'basic2',
        port: 'out'
      },
      tgt: {
        process: 'tall',
        port: 'in2'
      },
      metadata: {
        route: 2
      }
    },
    {
      src: {
        process: 'basic3',
        port: 'out'
      },
      tgt: {
        process: 'tall',
        port: 'in3'
      },
      metadata: {
        route: 3
      }
    },
    {
      src: {
        process: 'basic4',
        port: 'out'
      },
      tgt: {
        process: 'tall',
        port: 'in4'
      }
    },
    {
      data: 'package.json',
      tgt: {
        process: 'basic',
        port: 'in1'
      }
    }
  ]
}
