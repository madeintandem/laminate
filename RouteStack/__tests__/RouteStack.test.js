/* eslint-env jest */
import React from 'react'
import { Animated } from 'react-native'
import { shallow } from 'enzyme'
import { RouteStack } from '../RouteStack'

describe('default state', () => {
  let subject
  let givenChildren
  beforeEach(() => {
    const router = { history: { some: 'dummy' } }
    const Child = () => 'some child'
    givenChildren = <Child><Child /><Child /></Child>
    subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      {givenChildren}
    </RouteStack>, { context: { router } })
  })

  it('has a stack with one frame in it', () => {
    const stack = subject.state('stack')

    expect(stack).toHaveLength(1)

    const { animation, children } = stack[0]

    expect(animation.value).toEqual(1)
    expect(children).toEqual(givenChildren)
  })
})

describe('#getChildContext', () => {
  it('is the router from context with wrapped history', () => {
    const router = { history: { some: 'dummy' }, foo: 'bar' }
    const Child = () => 'some child'
    const subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router } })
    expect(subject.instance().getChildContext().router).toEqual({
      foo: 'bar',
      history: subject.instance().wrappedHistory()
    })
  })
})

describe('#wrappedHistory', () => {
  it('is the history object from context with push, replace, and goBack overridden', () => {
    const router = {
      history: {
        some: 'dummy',
        push: 'foo',
        goBack: 'bar',
        replace: 'baz'
      },
      foo: 'bar'
    }
    const Child = () => 'some child'
    const subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router } })

    expect(subject.instance().wrappedHistory()).toEqual({
      some: 'dummy',
      push: subject.instance().push,
      goBack: subject.instance().goBack,
      replace: subject.instance().replace
    })
  })
})

describe('#push', () => {
  let history
  let shouldAnimatePath
  let subject

  beforeEach(() => {
    history = { push: jest.fn() }
    shouldAnimatePath = jest.fn(() => 'shouldAnimatePath')
    const router = { history }
    const Child = () => 'some child'
    subject = shallow(<RouteStack shouldAnimatePath={shouldAnimatePath}>
      <Child />
    </RouteStack>, { context: { router } })
  })

  it('does nothing when animating', () => {
    subject.instance().isAnimating = true
    subject.instance().push('/path', 1, 2, 3)
    expect(shouldAnimatePath).not.toHaveBeenCalled()
    expect(history.push).not.toHaveBeenCalled()
  })

  describe('when not animating', () => {
    beforeEach(() => {
      subject.instance().isAnimating = false
      subject.instance().push('/path', 1, 2, 3)
    })

    it('sets pushing to the result of shouldAnimatePath', () => {
      expect(shouldAnimatePath).toHaveBeenCalledWith('/path')
      expect(subject.instance().pushing).toEqual('shouldAnimatePath')
    })

    it('pushes onto history', () => {
      expect(history.push).toHaveBeenCalledWith('/path', 1, 2, 3)
    })
  })
})

describe('#replace', () => {
  let history
  let subject

  beforeEach(() => {
    history = { replace: jest.fn() }
    const router = { history }
    const Child = () => 'some child'
    subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router } })
  })

  it('does nothing when animating', () => {
    subject.instance().isAnimating = true
    subject.instance().replace('/path', 1, 2, 3)
    expect(history.replace).not.toHaveBeenCalled()
  })

  describe('when not animating', () => {
    beforeEach(() => {
      subject.instance().isAnimating = false
      subject.instance().replacing = false
      subject.instance().replace('/path', 1, 2, 3)
    })

    it('sets replacing to true', () => {
      expect(subject.instance().replacing).toEqual(true)
    })

    it('replaces history', () => {
      expect(history.replace).toHaveBeenCalledWith('/path', 1, 2, 3)
    })
  })
})

describe('#goBack', () => {
  let history
  let subject

  beforeEach(() => {
    history = { goBack: jest.fn() }
    const router = { history }
    const Child = () => 'some child'
    subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router } })
  })

  it('does nothing when animating', () => {
    subject.instance().reverseAnimation = jest.fn()
    subject.instance().isAnimating = true
    subject.instance().goBack()
    expect(subject.instance().reverseAnimation).not.toHaveBeenCalled()
    expect(history.goBack).not.toHaveBeenCalled()
  })

  describe('when not animating', () => {
    let firstFrame
    let lastAnimation

    beforeEach(() => {
      firstFrame = { animation: new Animated.Value('bar'), children: 'stub' }
      lastAnimation = new Animated.Value('foo')
      subject.setState({ stack: [firstFrame, { animation: lastAnimation, children: 'stub' }] })
      subject.instance().reverseAnimation = jest.fn((animation, callback) => callback())
      subject.instance().isAnimating = false
      subject.instance().goBack(1, 2, 3)
    })

    it('reverses the last animation', () => {
      expect(subject.instance().reverseAnimation).toHaveBeenCalledWith(lastAnimation, expect.anything())
    })

    it('goes back', () => {
      expect(history.goBack).toHaveBeenCalledWith(1, 2, 3)
    })

    it('removes the last frame from the stack', () => {
      expect(subject).toHaveState('stack', [firstFrame])
    })
  })
})

describe('#forwardAnimation', () => {
  it('calls start animation', () => {
    const Child = () => 'some child'
    const subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })
    subject.instance().startAnimation = jest.fn()
    const animation = 'animation'
    const callback = 'callback'
    subject.instance().forwardAnimation(animation, callback)

    expect(subject.instance().startAnimation).toHaveBeenCalledWith(animation, 1, callback)
  })
})

describe('#reverseAnimation', () => {
  it('calls start animation', () => {
    const Child = () => 'some child'
    const subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })
    subject.instance().startAnimation = jest.fn()
    const animation = 'animation'
    const callback = 'callback'
    subject.instance().reverseAnimation(animation, callback)

    expect(subject.instance().startAnimation).toHaveBeenCalledWith(animation, 0, callback)
  })
})

describe('#startAnimation', () => {
  let subject

  beforeEach(() => {
    const Child = () => 'some child'
    subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })
    subject.instance().isAnimating = false
    subject.instance().animationPercentage = 0.5
  })

  it('sets isAnimating to true', () => {
    subject.instance().startAnimation('animation', 3)
    expect(subject.instance().isAnimating).toEqual(true)
  })

  it('calls animated timing', () => {
    subject.instance().startAnimation('animation', 3)
    expect(Animated.timing).toHaveBeenCalledWith('animation', { toValue: 3, duration: 1500 })
  })

  it('starts the animated timing', () => {
    subject.instance().startAnimation('animation', 3)
    expect(Animated.animatedTimingStart).toHaveBeenCalled()
  })

  describe('when finishing the animation', () => {
    const finishedAnimationCallback = () => {
      Animated.animatedTimingStart.mock.calls[0][0]() // invoke callback given to `start`
    }

    beforeEach(() => {
      subject.instance().animationPercentage = 0.5
      subject.instance().isAnimating = true
    })

    it('sets the animation percentage to 1', () => {
      subject.instance().startAnimation('animation', 3)
      finishedAnimationCallback()
      expect(subject.instance().animationPercentage).toEqual(1)
    })

    it('sets is animating to false', () => {
      subject.instance().startAnimation('animation', 3)
      finishedAnimationCallback()
      expect(subject.instance().isAnimating).toEqual(false)
    })

    it('calls the callback when given', () => {
      const callback = jest.fn()
      subject.instance().startAnimation('animation', 3, callback)
      finishedAnimationCallback()
      expect(callback).toHaveBeenCalled()
    })

    it('does not throw an error without a callback', () => {
      expect(() => {
        subject.instance().startAnimation('animation', 3)
        finishedAnimationCallback()
      }).not.toThrow()
    })
  })
})

describe('#lastAnimation', () => {
  it('is the last animation in the stack', () => {
    const Child = () => 'some child'
    const subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })

    const lastAnimation = new Animated.Value(5)
    const firstAnimation = new Animated.Value(2)
    subject.setState({
      stack: [
        { animation: firstAnimation, children: 'stub' },
        { animation: lastAnimation, children: 'also stub' }
      ]
    })

    expect(subject.instance().lastAnimation()).toEqual(lastAnimation)
  })
})

describe('#panResponder', () => {
  let subject
  let panResponder

  beforeEach(() => {
    const Child = () => 'some child'
    subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })
    panResponder = subject.instance().panResponder
  })

  describe('#onMoveShouldSetPanResponderCapture', () => {
    let event
    let gestureState

    beforeEach(() => {
      subject.setState({
        stack: [
          { children: 'some child', animation: new Animated.Value(1) },
          { children: 'another child', animation: new Animated.Value(1) }
        ]
      })
      subject.instance().isAnimating = false

      event = { nativeEvent: { pageX: 59 } }
      gestureState = { dx: 1 }
    })

    describe('it is true when', () => {
      it('has a stack > 1, is not animating, the touch is in range, and it has moved', () => {
        const result = panResponder.onMoveShouldSetPanResponderCapture(event, gestureState)
        expect(result).toEqual(true)
      })
    })

    describe('it is false when', () => {
      it('has a stack of 1', () => {
        subject.setState({ stack: [{ children: 'some child', animation: new Animated.Value(1) }] })
        const result = panResponder.onMoveShouldSetPanResponderCapture(event, gestureState)
        expect(result).toEqual(false)
      })

      it('is animating', () => {
        subject.instance().isAnimating = true
        const result = panResponder.onMoveShouldSetPanResponderCapture(event, gestureState)
        expect(result).toEqual(false)
      })

      it('has an out of range touch', () => {
        event = { nativeEvent: { pageX: 61 } }
        const result = panResponder.onMoveShouldSetPanResponderCapture(event, gestureState)
        expect(result).toEqual(false)
      })

      it('has not moved', () => {
        gestureState = { dx: 0 }
        const result = panResponder.onMoveShouldSetPanResponderCapture(event, gestureState)
        expect(result).toEqual(false)
      })
    })
  })

  describe('#onPanResponderMove', () => {
    it('sets the last animation\'s value to the percentage remaining across the screen that the gesture can move', () => {
      const event = {}
      const gestureState = { dx: 75 }
      panResponder.onPanResponderMove(event, gestureState)
      expect(subject.instance().lastAnimation().value).toEqual(0.8)

      gestureState.dx = 150
      panResponder.onPanResponderMove(event, gestureState)
      expect(subject.instance().lastAnimation().value).toEqual(0.6)
    })
  })

  describe('#onPanResponderTerminate', () => {
    it('is handleGestureEnded', () => {
      expect(panResponder.onPanResponderTerminate).toEqual(subject.instance().handleGestureEnded)
    })
  })

  describe('#onPanResponderRelease', () => {
    it('is handleGestureEnded', () => {
      expect(panResponder.onPanResponderRelease).toEqual(subject.instance().handleGestureEnded)
    })
  })
})

describe('#handleGestureEnded', () => {
  let subject
  let event

  beforeEach(() => {
    event = {}
    const Child = () => 'some child'
    subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })
    subject.instance().goBack = jest.fn()
    subject.instance().forwardAnimation = jest.fn()
  })

  describe('when the gesture is mostly complete', () => {
    it('sets the animation precentage', () => {
      subject.instance().handleGestureEnded(event, { dx: 300 })
      expect(subject.instance().animationPercentage).toEqual(0.8)
    })

    it('goes back', () => {
      subject.instance().handleGestureEnded(event, { dx: 300 })
      expect(subject.instance().goBack).toHaveBeenCalled()
      expect(subject.instance().forwardAnimation).not.toHaveBeenCalled()
    })
  })

  describe('when the gesture is not mostly complete', () => {
    it('sets the animation precentage', () => {
      subject.instance().handleGestureEnded(event, { dx: 75 })
      expect(subject.instance().animationPercentage).toEqual(0.2)
    })

    it('makes the animation go forward', () => {
      subject.instance().handleGestureEnded(event, { dx: 75 })
      expect(subject.instance().forwardAnimation).toHaveBeenCalledWith(subject.instance().lastAnimation())
      expect(subject.instance().goBack).not.toHaveBeenCalled()
    })
  })
})

describe('#render', () => {
  it('renders properly', () => {
    const Child = () => 'some child'
    const subject = shallow(<RouteStack shouldAnimatePath={jest.fn()}>
      <Child />
    </RouteStack>, { context: { router: {} } })
    subject.setState({
      stack: [
        { children: 'some child', animation: new Animated.Value(1) },
        { children: 'another child', animation: new Animated.Value(1) }
      ]
    })

    expect(subject).toMatchSnapshot()
  })
})
