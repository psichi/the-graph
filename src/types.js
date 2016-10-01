export type Connection = {
  src: {
    process: string,
    port: string
  },
  tgt: {
    process: string,
    port: string
  },
  metadata: {
    route: number
  }
}

export type Port = {
  name: string,
  type: string
}

export type Node = {
  key: string,
  node: {
    id: string,
    component: string,
    metadata: {
      x: number,
      y: number,
      width: number,
      height: number,
      label: string
    }
  },
  icon: string,
  iconsvg: string,
  selected: boolean,
  highlightPort: boolean, // not sure
  nodeID: string,
  x: number,
  y: number,
  label: string,
  sublabel: string,
  width: number,
  height: number,
  error: boolean,
  ports: {
    inports: {
      [name: string]: {
        label: string,
        type: string,
        x: number,
        y: number,
        route: number
      }
    },
    outports: {
      [name: string]: {
        label: string,
        type: string,
        x: number,
        y: number,
        route: number
      }
    }
  }
}

export type Graph = {
  caseSensitive: boolean,
  properties: {
    name: string
  },
  inports: port[],
  outports: port[],
  connections: connection[]
  groups: array,
  nodes: array,
  processes: {
    [name: string]: {
      component: string,
      metadata: {
        x: number,
        y: number,
        width: number,
        label: string
      }
    }
  }
}

export type Library = {
  [name: string]: {
    name: string,
    description: string,
    icon: string,
    inports: port[],
    outports: port[]
  }
}
