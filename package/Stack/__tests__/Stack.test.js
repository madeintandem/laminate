/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { StaticRouter, Route } from 'react-router-native'
import { Stack } from '../Stack'

jest.mock('../../Animation', () => {
  const { Animated } = require('react-native')
  const Animation = ({ children }) => children({ play: jest.fn(), rewind: jest.fn(), value: new Animated.Value(0) })
  return {
    Animation
  }
})

jest.mock('../InnerStack', () => {
  const InnerStack = ({ children }) => children

  return {
    InnerStack
  }
})

const Child = () => <div>a child</div>

it('renders properly', () => {
  const subject = mount(<StaticRouter location='/bar' context={{}}>
    <Stack initialLocation='/foo' easing='easing' duration={123}>
      <Route component={Child} path='/foo' />
    </Stack>
  </StaticRouter>)
  expect(subject).toMatchSnapshot()
})
