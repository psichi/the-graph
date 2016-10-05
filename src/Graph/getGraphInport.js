import Config from '../Config'
export default function getGraphInport(key: string) {
  let exp = this.graphInports[key]

  if (!exp) {
    exp = { inports: {}, outports: {} }
    exp.outports[key] = {
      label: key,
      type: 'all',
      route: 2,
      x: Config.base.config.nodeWidth,
      y: Config.base.config.nodeHeight / 2
    }
    this.graphInports[key] = exp
  }
  return exp
}
