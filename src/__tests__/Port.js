import React from 'react'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import Port from '../Port'

const port = {
  process: 'textProcess',
    port: 'IN',
    type: 'any'
}

it('Label is set', () => {
  const wrapper = mount(
    <Port
      label="IN"
      port={port}
      isIn={true}
      route={1}
      x={10}
      y={10}
    />
  )

  expect(wrapper.find('text').text()).toEqual('IN')
})

it('Mousedown starts tracking', () => {
  const onEdgeStart = sinon.spy();
  const wrapper = mount(
    <Port
      port={port}
      onEdgeStart={onEdgeStart}
    />
  );
  wrapper.find('PortGroup').simulate('mousedown');
  expect(onEdgeStart.callCount).toEqual(1);
})

it('Mouseup ends tracking', () => {
  const onEdgeStart = sinon.spy();
  const onEdgeDrop = sinon.spy();
  const wrapper = mount(
    <Port
      port={port}
      onEdgeStart={onEdgeStart}
      onEdgeDrop={onEdgeDrop}
    />
  );

  wrapper.find('PortGroup')
    .simulate('mousedown')
    // .simulate('mouseup')

  document.body.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true
  }))

  expect(onEdgeStart.callCount).toEqual(1);
  expect(onEdgeDrop.callCount).toEqual(1);
})

