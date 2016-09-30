import { bindActionCreators } from 'redux'
import connect from './connect'
import * as GraphActions from './actions/graph'

function mapStateToProps(state) {
  return {
    scale: state.scale
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GraphActions, dispatch)
}

export default (TheGraphGraph) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TheGraphGraph)
}
