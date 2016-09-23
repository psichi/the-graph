export default {
  properties: {
    name: 'Count lines in a file'
  },
  processes: {
    basic: { component: 'basic' },
    basic2: { component: 'basic' },
    basic3: { component: 'basic' },
    basic4: { component: 'basic' },
    tall: {
      component: 'tall'
    }
  },
  connections: [
    {
      data: 'package.json',
      tgt: {
        process: 'basic',
        port: 'in1'
      }
    },
    {
      src: { process: 'basic', port: 'out' },
      tgt: { process: 'tall', port: 'in1' },
      metadata: { route: 1 }
    },
    {
      src: { process: 'basic2', port: 'out' },
      tgt: { process: 'tall', port: 'in2' },
      metadata: { route: 2 }
    },
    {
      src: { process: 'basic3', port: 'out' },
      tgt: { process: 'tall', port: 'in3' },
      metadata: { route: 3 }
    },
    {
      src: { process: 'basic4', port: 'out' },
      tgt: { process: 'tall', port: 'in4' }
    }
  ]
}
