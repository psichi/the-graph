import React from 'react'
import { findDOMNode } from 'react-dom'
import { mount } from 'enzyme'
import TestUtils from 'react-addons-test-utils'
import Port from '../Port'

it('Port', () => {
  const wrapper = mount(
    <Port
      label="IN"
      isIn={true}
      port={{
        process: 'textProcess',
        port: 'IN',
        type: 'any'
      }}
      route={1}
      x={10}
      y={10}
    />
  )

  expect(wrapper.find('text').text()).toEqual('IN')
})

