import Config from '../Config'
export default function getGraphOutport(key) {
  let exp

  exp = this.graphOutports[key]

  if (!exp) {
    exp = { inports: {}, outports: {} }
    exp.inports[key] = {
      label: key,
      type: 'all',
      route: 5,
      x: 0,
      y: Config.base.config.nodeHeight / 2
    }
    this.graphOutports[key] = exp
  }

  return exp
}
