export type Point = {
  x: number,
  y: number
}

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

// FIX ME: label vs name
export type Port = {
  name: ?string,
  label: ?string,
  type: string
}

export type PortHash = {
  [name: string]: {
    label: string,
    type: string,
    x: number,
    y: number,
    route: ?number
  }
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
    inports: PortHash,
    outports: PortHash
  }
}

export type NofloGraph = {
  _events: Object,
  _maxListeners: void,
  name: string,
  caseSensitive: boolean,
  properties: Object,
  nodes: {
    id: string,
    component: string,
    metadata: {
      x: number,
      y: number,
      width: number,
      height: number,
      label: string
    },
  }[],

  edges: [{
    from: {
      node: string,
      port: string
    },
    to: {
      node: string,
      port: string
    },
    metadata: Object
  }],

  initializers: {
    from: {
      data: string,
    },
    to: {
      node: string,
      port: string,
    },
    metadata: Object
  }[],

  exports: Array,
  inports: Object,
  outports: Object,
  groups: Array,
  transaction: {
    id: ?string,
    depth: number
  }
}

export type Graph = {
  caseSensitive: boolean,
  properties: {
    name: string
  },
  inports: Port[],
  outports: Port[],
  connections: Connection[],
  groups: Array,
  nodes: Array,
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
    inports: Port[],
    outports: Port[]
  }
}

export type PortDimensions = {
  x: number,
  height: number
}

export type KGraph = {
  id: string,
  children: {
    id: string,
    labels: {
      text: string
    }[], // specify
    width: number,
    height: number,
    ports: {
      id: string,
      width: number,
      height: number,
      x: number,
      y: number,
      properties: {
        [name: string]: string
      }
    }[], // specify
    properties: {
      portConstraints: string
    },
    x: number,
    y: number
  }[],
  edges: {
    id: string,
    source: string,
    sourcePort: string,
    target: string,
    targetPort: string,
    sourcePoint: Point,
    targetPoint: Point,
    junctionPoints: Array,
  }[],
  $H: number,
  width: number,
  height: number
}
