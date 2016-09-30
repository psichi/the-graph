import { bindActionCreators } from 'redux'
import connect from './connect'
import * as AppActions from './actions/app'

function mapStateToProps(state) {
  return {
    scale: state.scale
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AppActions, dispatch)
}

export default (TheGraphApp) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TheGraphApp)
}
