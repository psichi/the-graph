import { bindActionCreators } from 'redux'
import connect from './connect'
import * as PortActions from './actions/port'

function mapStateToProps(state) {
  return {
    scale: state.scale
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PortActions, dispatch)
}

export default (TheGraphPort) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TheGraphPort)
}
