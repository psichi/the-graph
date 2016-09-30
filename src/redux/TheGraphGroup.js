import { bindActionCreators } from 'redux'
import connect from './connect'
import * as GroupActions from './actions/group'

function mapStateToProps(state) {
  return {
    scale: state.scale
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(GroupActions, dispatch)
}

export default (TheGraphGroup) => {
  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(TheGraphGroup)
}
