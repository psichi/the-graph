/**
 * Provision your react components with anything
 */

const modules = []

if (false && process.env.NODE_ENV !== 'test') {
  modules.push(require('./redux'))
}

export function setup(config) {
  Object.keys(config).forEach((name) => {
    try {
      const moduleName = `react-provision-${name}`
      require(moduleName)
    } catch (e) {
      throw Error('You must install %s', moduleName)
    }
  })
}

export function provision(Class, options) {
  return modules.reduce((klass, mod) => {
    if (mod[klass.name]) {
      console.log('Provisioning %s using %s', Class.name, mod)
      return mod[klass.name](klass, options)
    } else {
      throw Error(`Provisioning failed: module ${klass.name} is not available`)
    }
  }, Class)
}
