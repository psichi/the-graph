import React, {Component} from 'react'
import Port from '../../Port'

export default class NodePort extends Component {
  render () {
    return <Port {...this.props} />
  }
}
