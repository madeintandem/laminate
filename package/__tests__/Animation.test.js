/* eslint-env jest */
import React from 'react'
import { Animated } from 'react-native'
import { shallow } from 'enzyme'
import { Animation } from '../Animation'

const Child = () => 'a child'

describe('state', () => {
  it('creates a new animated value for the animation state', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    const result = subject.state('animation')
    expect(result).toBeInstanceOf(Animated.Value)
    expect(result.value).toEqual(0)
  })
})

describe('#animationProps', () => {
  it('has animation with play, rewind, and value', () => {
    const subject = shallow(<Animation><Child /></Animation>)

    expect(subject.instance().animationProps()).toEqual({
      play: subject.instance().play,
      rewind: subject.instance().rewind,
      value: subject.state('animation')
    })
  })
})

describe('#play', () => {
  it('animates to one by default', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    subject.instance().animate = jest.fn()
    subject.instance().play()
    expect(subject.instance().animate).toHaveBeenCalledWith({ toValue: 1 })
  })

  it('passes through arguments', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    subject.instance().animate = jest.fn()
    subject.instance().play({ toValue: 5, foo: 'bar' })
    expect(subject.instance().animate).toHaveBeenCalledWith({ toValue: 5, foo: 'bar' })
  })
})

describe('#rewind', () => {
  it('animates to zero by default', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    subject.instance().animate = jest.fn()
    subject.instance().rewind()
    expect(subject.instance().animate).toHaveBeenCalledWith({ toValue: 0 })
  })

  it('passes through arguments', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    subject.instance().animate = jest.fn()
    subject.instance().play({ toValue: 5, foo: 'bar' })
    expect(subject.instance().animate).toHaveBeenCalledWith({ toValue: 5, foo: 'bar' })
  })
})

describe('#animate', () => {
  it('runs the animation', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    subject.instance().animate({ toValue: 5, duration: 20, easing: 'something' })
    expect(Animated.timing).toHaveBeenCalledWith(subject.state('animation'), {
      toValue: 5,
      duration: 20,
      easing: 'something'
    })
  })

  it('runs the callback', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    const callback = jest.fn()
    subject.instance().animate({ toValue: 5, callback })
    expect(callback).toHaveBeenCalled()
  })

  it('falls back to the easing and duration props when not provided', () => {
    const subject = shallow(<Animation duration={14} easing='so easy'><Child /></Animation>)
    subject.instance().animate({ toValue: 53 })
    expect(Animated.timing).toHaveBeenCalledWith(subject.state('animation'), {
      toValue: 53,
      duration: 14,
      easing: 'so easy'
    })
  })
})

describe('#render', () => {
  it('renders a children function with arguments', () => {
    const subject = shallow(<Animation>
      {animation => (
        <Child animation={animation} />
      )}
    </Animation>)
    expect(subject).toMatchSnapshot()
  })

  it('renders a regular children', () => {
    const subject = shallow(<Animation><Child /></Animation>)
    expect(subject).toMatchSnapshot()
  })
})
