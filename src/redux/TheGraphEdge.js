import { bindActionCreators } from 'redux'
import connect from './connect'
import * as EdgeActions from './actions/edge'

function mapStateToProps(state) {
  return {
    scale: state.scale
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(EdgeActions, dispatch)
}

export default (TheGraphEdge) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TheGraphEdge)
}
