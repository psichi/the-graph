import React from 'react'
import { connect } from 'react-redux'
import configureStore from './store/configureStore'

// TODO: collect this
const initialState = {
  scale: 1
}

const store = configureStore(initialState)

export default function ConnectWithStore(...args) {
  const Connect = connect(...args)

  return (Comp) => {
    const wrappedComponent = Connect(Comp)

    wrappedComponent.defaultProps = {
      store
    }

    return wrappedComponent
  }
}
