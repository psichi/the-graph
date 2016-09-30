import { bindActionCreators } from 'redux'
import connect from './connect'
import * as NodeActions from './actions/node'

function mapStateToProps(state) {
  return {
    scale: state.scale
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NodeActions, dispatch)
}

export default (TheGraphNode) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TheGraphNode)
}
