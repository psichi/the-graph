import React from 'react'
import { mount } from 'enzyme'
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

