/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { StaticRouter } from 'react-router-native'
import { SwipeableScene } from '../SwipeableScene'

const Child = () => <div>a child</div>

jest.mock('../../SceneWrapper', () => {
  const WithStackAnimation = ({ children }) => children({
    index: 2,
    interpolateAnimation: jest.fn(),
    setAnimationValue: jest.fn()
  })

  return {
    WithStackAnimation
  }
})

it('renders properly', () => {
  const subject = mount(<StaticRouter context={{}}>
    <SwipeableScene some='props' are='fun'>
      <Child />
    </SwipeableScene>
  </StaticRouter>)
  expect(subject).toMatchSnapshot()
})
