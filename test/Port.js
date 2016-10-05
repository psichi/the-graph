import test from 'ava'
import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'
import Port from '../src/Port'
import { DEvent } from './helpers'

const port = {
  process: 'textProcess',
  port: 'IN',
  type: 'any'
}

test('Label is set', (t) => {
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

  t.is(wrapper.find('text').text(), 'IN')
})

test('Mousedown starts tracking', (t) => {
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

  t.is(onEdgeStart.callCount, 1)
})

test('Mouseup ends tracking', (t) => {
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

  t.is(onEdgeStart.callCount, 1)
  t.is(onEdgeDrop.callCount, 1)
})

