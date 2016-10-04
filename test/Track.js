import React from 'react'
import { findDOMNode } from 'react-dom'
import sinon from 'sinon'
import { mount } from 'enzyme'
import { Simulate } from 'react-addons-test-utils'
import { DEvent } from './utils'
import Track from '../src/Track'

it('Start tracking', () => {
  const onTrackStart = sinon.spy()
  const wrapper = mount(
    <Track
      onTrackStart={onTrackStart}
    >
      <div />
    </Track>
  )

  wrapper.find('Track').simulate('mousedown', {
    pageX: 0,
    pageY: 0
  })

  DEvent('mousemove', {
    pageX: 5,
    pageY: 5
  })

  expect(onTrackStart.callCount).to.equal(1)
})

it('Move', () => {
  const onTrackStart = sinon.spy()
  const onTrackEnd = sinon.spy()
  const onTrack = sinon.spy()
  const wrapper = mount(
    <Track
      onTrackStart={onTrackStart}
      onTrack={onTrack}
      onTrackEnd={onTrackEnd}
    >
      <div id="move-test">test</div>
    </Track>
  )

  const track = wrapper.find('Track')
  track.simulate('mousedown', {
    pageX: 0,
    pageY: 0
  })

  ;[1, 2].forEach((nr) => {
    DEvent('mousemove', {
      pageX: 5 * nr,
      pageY: 5 * nr
    })
  })

  DEvent('mouseup')

  expect(onTrackStart.callCount).to.equal(1)
  expect(onTrack.callCount).to.equal(2)
  expect(onTrackEnd.callCount).to.equal(1)
})
