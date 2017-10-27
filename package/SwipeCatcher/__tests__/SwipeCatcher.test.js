/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { SwipeCatcher } from '../SwipeCatcher'
import {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  TOP_TO_BOTTOM,
  BOTTOM_TO_TOP
} from '../constants'

const Child = () => 'a child'

describe('#edgeThreshold', () => {
  describe('when given as a prop', () => {
    it('is the prop', () => {
      const subject = shallow(<SwipeCatcher edgeThreshold={54}><Child/></SwipeCatcher>)
      expect(subject.instance().edgeThreshold()).toEqual(54)
    })
  })

  describe('when given a horizontal direction', () => {
    it('is the window width', () => {
      const subject = shallow(<SwipeCatcher direction={LEFT_TO_RIGHT}><Child/></SwipeCatcher>)
      expect(subject.instance().edgeThreshold()).toEqual(375)
      subject.setProps({ direction: RIGHT_TO_LEFT })
      expect(subject.instance().edgeThreshold()).toEqual(375)
    })
  })

  describe('when given a vertical direction', () => {
    it('is the window height', () => {
      const subject = shallow(<SwipeCatcher direction={TOP_TO_BOTTOM}><Child/></SwipeCatcher>)
      expect(subject.instance().edgeThreshold()).toEqual(667)
      subject.setProps({ direction: BOTTOM_TO_TOP })
      expect(subject.instance().edgeThreshold()).toEqual(667)
    })
  })
})

describe('#percentCompleteFromGestureState', () => {
  it('is calculated properly when left to right', () => {
    const subject = shallow(<SwipeCatcher direction={LEFT_TO_RIGHT}><Child/></SwipeCatcher>)
    const result = subject.instance().percentCompleteFromGestureState({ dx: 75, dy: 88 })
    expect(result).toEqual(0.2)
  })

  it('is calculated properly when right to left', () => {
    const subject = shallow(<SwipeCatcher direction={RIGHT_TO_LEFT}><Child/></SwipeCatcher>)
    const result = subject.instance().percentCompleteFromGestureState({ dx: -75, dy: 88 })
    expect(result).toEqual(0.2)
  })

  it('is calculated properly when top to bottom', () => {
    const subject = shallow(<SwipeCatcher direction={TOP_TO_BOTTOM}><Child/></SwipeCatcher>)
    const result = subject.instance().percentCompleteFromGestureState({ dx: 88, dy: 133.4 })
    expect(result).toEqual(0.2)
  })

  it('is calculated properly when bottom to top', () => {
    const subject = shallow(<SwipeCatcher direction={BOTTOM_TO_TOP}><Child/></SwipeCatcher>)
    const result = subject.instance().percentCompleteFromGestureState({ dx: 88, dy: -133.4 })
    expect(result).toEqual(0.2)
  })
})

describe('#velocityFromGestureState', () => {
  describe('when given a horizontal direction', () => {
    it('is the vx', () => {
      const subject = shallow(<SwipeCatcher direction={LEFT_TO_RIGHT}><Child/></SwipeCatcher>)
      expect(subject.instance().velocityFromGestureState({ vx: 12, vy: 13 })).toEqual(12)
      subject.setProps({ direction: RIGHT_TO_LEFT })
      expect(subject.instance().velocityFromGestureState({ vx: 12, vy: 13 })).toEqual(12)
    })
  })

  describe('when given a vertical direction', () => {
    it('is the vy', () => {
      const subject = shallow(<SwipeCatcher direction={TOP_TO_BOTTOM}><Child/></SwipeCatcher>)
      expect(subject.instance().velocityFromGestureState({ vx: 12, vy: 13 })).toEqual(13)
      subject.setProps({ direction: BOTTOM_TO_TOP })
      expect(subject.instance().velocityFromGestureState({ vx: 12, vy: 13 })).toEqual(13)
    })
  })
})

describe('#dataFromGestureState', () => {
  it('is the percentComplete and velocity from the gesture', () => {
    const subject = shallow(<SwipeCatcher direction={LEFT_TO_RIGHT}><Child/></SwipeCatcher>)
    const result = subject.instance().dataFromGestureState({ dx: 75, vx: 13 })
    expect(result).toEqual({ percentComplete: 0.2, velocity: 13 })
  })
})

describe('#onMoveShouldSetPanResponderCapture', () => {
  describe('when left to right', () => {
    it('is true when the pageX is less than the edge threshold and the dx is greater than 0', () => {
      const subject = shallow(<SwipeCatcher direction={LEFT_TO_RIGHT} edgeThreshold={50}><Child/></SwipeCatcher>)
      const { onMoveShouldSetPanResponderCapture } = subject.instance().panResponder.panHandlers
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 51 } }, { dx: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 49 } }, { dx: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 51 } }, { dx: 3 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 49 } }, { dx: 3 })).toEqual(true)
    })
  })

  describe('when right to left', () => {
    it('is true when the pageX is less than the edge threshold and the dx is less than 0', () => {
      const subject = shallow(<SwipeCatcher direction={RIGHT_TO_LEFT} edgeThreshold={50}><Child/></SwipeCatcher>)
      const { onMoveShouldSetPanResponderCapture } = subject.instance().panResponder.panHandlers
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 51 } }, { dx: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 49 } }, { dx: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 51 } }, { dx: -3 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageX: 49 } }, { dx: -3 })).toEqual(true)
    })
  })

  describe('when top to bottom', () => {
    it('is true when the pageY is less than the edge threshold and the dy is greater than 0', () => {
      const subject = shallow(<SwipeCatcher direction={TOP_TO_BOTTOM} edgeThreshold={50}><Child/></SwipeCatcher>)
      const { onMoveShouldSetPanResponderCapture } = subject.instance().panResponder.panHandlers
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 51 } }, { dy: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 49 } }, { dy: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 51 } }, { dy: 3 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 49 } }, { dy: 3 })).toEqual(true)
    })
  })

  describe('when bottom to top', () => {
    it('is true when the pageY is less than the edge threshold and the dy is less than 0', () => {
      const subject = shallow(<SwipeCatcher direction={BOTTOM_TO_TOP} edgeThreshold={50}><Child/></SwipeCatcher>)
      const { onMoveShouldSetPanResponderCapture } = subject.instance().panResponder.panHandlers
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 51 } }, { dy: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 49 } }, { dy: 0 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 51 } }, { dy: -3 })).toEqual(false)
      expect(onMoveShouldSetPanResponderCapture({ nativeEvent: { pageY: 49 } }, { dy: -3 })).toEqual(true)
    })
  })
})

describe('#onPanResponderGrant', () => {
  it('calls the onGestureStart callback if given', () => {
    const subject = shallow(<SwipeCatcher><Child/></SwipeCatcher>)
    const { onPanResponderGrant } = subject.instance().panResponder.panHandlers
    expect(onPanResponderGrant).not.toThrow()
    const onGestureStart = jest.fn()
    subject.setProps({ onGestureStart })
    onPanResponderGrant()
    expect(onGestureStart).toHaveBeenCalled()
  })
})

describe('#onPanResponderMove', () => {
  it('calls onMove when given', () => {
    const subject = shallow(<SwipeCatcher><Child/></SwipeCatcher>)
    const { onPanResponderMove } = subject.instance().panResponder.panHandlers
    const gestureState = { vx: 5, dx: 75 }
    expect(() => onPanResponderMove({}, gestureState)).not.toThrow()
    const onMove = jest.fn()
    subject.setProps({ onMove })
    onPanResponderMove({}, gestureState)
    expect(onMove).toHaveBeenCalledWith(subject.instance().dataFromGestureState(gestureState))
  })
})

describe('#onPanResponderTerminate', () => {
  it('calls onGestureTerminate when given', () => {
    const subject = shallow(<SwipeCatcher><Child/></SwipeCatcher>)
    const { onPanResponderTerminate } = subject.instance().panResponder.panHandlers
    const gestureState = { vx: 5, dx: 75 }
    expect(() => onPanResponderTerminate({}, gestureState)).not.toThrow()
    const onGestureTerminate = jest.fn()
    subject.setProps({ onGestureTerminate })
    onPanResponderTerminate({}, gestureState)
    expect(onGestureTerminate).toHaveBeenCalledWith(subject.instance().dataFromGestureState(gestureState))
  })
})

describe('#onPanResponderRelease', () => {
  it('calls onPanResponderRelease when given', () => {
    const subject = shallow(<SwipeCatcher><Child/></SwipeCatcher>)
    const { onPanResponderRelease } = subject.instance().panResponder.panHandlers
    const gestureState = { vx: 5, dx: 75 }
    expect(() => onPanResponderRelease({}, gestureState)).not.toThrow()
    const onGestureRelease = jest.fn()
    subject.setProps({ onGestureRelease })
    onPanResponderRelease({}, gestureState)
    expect(onGestureRelease).toHaveBeenCalledWith(subject.instance().dataFromGestureState(gestureState))
  })
})

describe('#render', () => {
  it('renders properly', () => {
    const subject = shallow(<SwipeCatcher style={{ inline: 'style' }}><Child/></SwipeCatcher>)
    expect(subject).toMatchSnapshot()
  })
})
