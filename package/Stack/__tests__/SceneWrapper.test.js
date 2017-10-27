/* eslint-env jest */
import React from 'react'
import { Animated } from 'react-native'
import { shallow } from 'enzyme'
import { SceneWrapper } from '../SceneWrapper'

const Child = () => 'a child'

describe('#getChildContext', () => {
  it('has the index, interpolateAnimation, and setAnimationValue', () => {
    const animationValue = new Animated.Value(5)
    const subject = shallow(<SceneWrapper index={17} animationValue={animationValue}>
      <Child />
    </SceneWrapper>)

    expect(subject.instance().getChildContext()).toEqual({
      index: 17,
      interpolateAnimation: subject.instance().interpolateAnimation,
      setAnimationValue: subject.instance().setAnimationValue
    })
  })
})

describe('#setAnimationValue', () => {
  it('sets the animation value to the given value plus the index', () => {
    const animationValue = new Animated.Value(5)
    const subject = shallow(<SceneWrapper index={17} animationValue={animationValue}>
      <Child />
    </SceneWrapper>)
    subject.instance().setAnimationValue(3)
    expect(animationValue.value).toEqual(20)
  })
})

describe('#interpolateAnimation', () => {
  it('interpolates the animation, adjusting the given values by the index', () => {
    const animationValue = new Animated.Value(5)
    const subject = shallow(<SceneWrapper index={17} animationValue={animationValue}>
      <Child />
    </SceneWrapper>)

    const result = subject.instance().interpolateAnimation({ inputRange: [0, 1, 2], outputRange: [5, 2, 4] })
    expect(result).toEqual({
      args: { inputRange: [17, 18, 19], outputRange: [5, 2, 4] },
      interpolated: 5
    })
  })
})

describe('#render', () => {
  it('renders its children', () => {
    const animationValue = new Animated.Value(5)
    const subject = shallow(<SceneWrapper index={3} animationValue={animationValue}>
      <Child />
    </SceneWrapper>)
    expect(subject).toMatchSnapshot()
  })
})
