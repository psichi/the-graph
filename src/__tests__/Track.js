import React from 'react'
import { findDOMNode } from 'react-dom'
import sinon from 'sinon'
import { mount, shallow } from 'enzyme'
import Track from '../Track'

it('Start tracking', () => {
  const onTrackStart = sinon.spy()
  const wrapper = mount(
    <Track
      onTrackStart={onTrackStart}
    >
      <div />
    </Track>
  )
  wrapper.find('Track').simulate('touchstart', {
    pageX: 0,
    pageY: 0
  })
  wrapper.find('Track').simulate('touchmove', {
    pageX: 5,
    pageY: 5
  })
  expect(onTrackStart.callCount).toEqual(1)
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
  track.simulate('mousedown')

  ;[1,2].forEach(() => {
    // track.simulate('mousemove')
    const mouseEvent = new MouseEvent('mousemove', {
      bubbles: true,
      pageX: 0,
      pageY: 0
    })

    console.log('mouseEvent', Object.keys(mouseEvent))

    document.dispatchEvent(mouseEvent)
  })

  // track.simulate('mouseup')
  document.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true,
    pageX: 10,
    pageY: 10
  }))

  expect(onTrackStart.callCount).toEqual(1)
  // expect(onTrack.callCount).toEqual(2)
  //expect(onTrackEnd.callCount).toEqual(1)
})
