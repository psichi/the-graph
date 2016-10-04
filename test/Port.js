import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import Port from '../src/Port'
import { DEvent } from './utils'

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
      isIn
      route={1}
      x={10}
      y={10}
    />
  )

  expect(wrapper.find('text').text()).to.equal('IN')
})

it('Mousedown starts tracking', () => {
  const onEdgeStart = sinon.spy()
  const wrapper = mount(
    <Port
      port={port}
      onEdgeStart={onEdgeStart}
    />
  )

  wrapper.find('PortGroup').simulate('mousedown', {
    pageX: 0,
    pageY: 0
  })

  DEvent('mousemove', {
    pageX: 5,
    pageY: 5
  })

  expect(onEdgeStart.callCount).to.equal(1)
})

it('Mouseup ends tracking', () => {
  const onEdgeStart = sinon.spy()
  const onEdgeDrop = sinon.spy()
  const wrapper = mount(
    <Port
      port={port}
      onEdgeStart={onEdgeStart}
      onEdgeDrop={onEdgeDrop}
    />
  )

  wrapper.find('PortGroup')
    .simulate('mousedown', {
      pageX: 0,
      pageY: 0
    })

  DEvent('mousemove', {
    pageX: 5,
    pageY: 5
  })

  DEvent('mouseup')

  expect(onEdgeStart.callCount).to.equal(1)
  expect(onEdgeDrop.callCount).to.equal(1)
})

