/* eslint-env jest */
import React from 'react'
import { Animated } from 'react-native'
import { shallow } from 'enzyme'
import { Layer } from '../Layer'

it('renders its children with a slide animation', () => {
  const value = new Animated.Value(0)
  const Child = () => 'some child'
  const subject = shallow(<Layer animation={value} index={123}>
    <Child />
  </Layer>)

  expect(subject).toMatchSnapshot()
})
