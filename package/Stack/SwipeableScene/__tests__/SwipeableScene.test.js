/* eslint-env jest */
import React, { Component } from 'react'
import { mount } from 'enzyme'
import { StaticRouter } from 'react-router-native'
import { SceneWrapper } from '../../SceneWrapper'
import { SwipeableScene } from '../SwipeableScene'

const Child = () => <div>a child</div>

class ContextMock extends Component {
  static childContextTypes = SceneWrapper.childContextTypes

  getChildContext () {
    return {
      index: 2,
      interpolateAnimation: jest.fn(),
      setAnimationValue: jest.fn()
    }
  }

  render () {
    return this.props.children // eslint-disable-line
  }
}

it('renders properly', () => {
  const subject = mount(<StaticRouter context={{}}>
    <ContextMock>
      <SwipeableScene some='props' are='fun'>
        <Child />
      </SwipeableScene>
    </ContextMock>
  </StaticRouter>)
  expect(subject).toMatchSnapshot()
})
