/* eslint-env jest */
import React from 'react'
import { Animated } from 'react-native'
import { shallow } from 'enzyme'
import { InnerStack } from '../InnerStack'

const Child = () => 'a child'

const animationMock = () => {
  return {
    play: jest.fn(),
    rewind: jest.fn(({ callback }) => callback && callback()),
    value: new Animated.Value(17)
  }
}

describe('state', () => {
  it('has scenes', () => {
    const children = <Child />
    const subject = shallow(<InnerStack animation={animationMock()} innerRouter={{}} outerRouter={{}}>
      {children}
    </InnerStack>)

    expect(subject).toHaveState('scenes', [children])
  })
})

describe('#getChildContext', () => {
  it('has the given outer router', () => {
    const outerRouter = { outer: 'router' }
    const subject = shallow(<InnerStack animation={animationMock()} innerRouter={{}} outerRouter={outerRouter}>
      <Child />
    </InnerStack>)
    expect(subject.instance().getChildContext()).toEqual({ outerRouter })
  })
})

describe('#componentDidMount', () => {
  it('plays the animation', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} innerRouter={{}} outerRouter={{}}>
      <Child />
    </InnerStack>)
    subject.instance().componentDidMount()
    expect(animation.play).toHaveBeenCalled()
  })
})

describe('#componentWillReceiveProps', () => {
  let subject

  beforeEach(() => {
    const animation = animationMock()
    subject = shallow(<InnerStack animation={animation} innerRouter={{}} outerRouter={{}}>
      <Child />
    </InnerStack>)
    subject.instance().handleReplace = jest.fn()
    subject.instance().handlePush = jest.fn()
    subject.instance().handlePop = jest.fn()
  })

  it('handles replacing', () => {
    const nextProps = {
      innerRouter: { history: { action: 'REPLACE', index: 2 } }
    }
    subject.instance().componentWillReceiveProps(nextProps)
    expect(subject.instance().handleReplace).toHaveBeenCalledWith(nextProps)
    expect(subject.instance().handlePush).not.toHaveBeenCalled()
    expect(subject.instance().handlePop).not.toHaveBeenCalled()
  })

  it('handles pushing', () => {
    let nextProps = {
      innerRouter: { history: { action: 'PUSH', index: 0 } }
    }
    subject.instance().componentWillReceiveProps(nextProps)
    expect(subject.instance().handlePush).not.toHaveBeenCalled()
    expect(subject.instance().handleReplace).not.toHaveBeenCalled()
    expect(subject.instance().handlePop).not.toHaveBeenCalled()

    nextProps = {
      innerRouter: { history: { action: 'PUSH', index: 1 } }
    }
    subject.instance().componentWillReceiveProps(nextProps)
    expect(subject.instance().handlePush).toHaveBeenCalledWith(nextProps)
    expect(subject.instance().handleReplace).not.toHaveBeenCalled()
    expect(subject.instance().handlePop).not.toHaveBeenCalled()
  })

  it('handles popping', () => {
    const nextProps = {
      innerRouter: { history: { action: 'POP', index: 2 } }
    }
    subject.instance().componentWillReceiveProps(nextProps)
    expect(subject.instance().handlePop).toHaveBeenCalledWith(nextProps)
    expect(subject.instance().handlePush).not.toHaveBeenCalled()
    expect(subject.instance().handleReplace).not.toHaveBeenCalled()
  })
})

describe('#handlePop', () => {
  it('rewinds the animation and removes scenes from the stack based on the history index', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} innerRouter={{}} outerRouter={{}}>
      <Child />
    </InnerStack>)
    const nextProps = {
      innerRouter: { history: { action: 'POP', index: 1 } }
    }
    subject.setState({ scenes: [<Child key={1} />, <Child key={2} />, <Child key={3} />, <Child key={4} />] })
    subject.instance().handlePop(nextProps)
    expect(animation.rewind).toHaveBeenCalledWith({ toValue: 2, callback: expect.any(Function) })
    expect(subject).toHaveState('scenes', [<Child key={1} />, <Child key={2} />])
  })
})

describe('#handlePush', () => {
  it('adds a scene to the stack and plays the animation', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} innerRouter={{}} outerRouter={{}}>
      <Child key='original' />
    </InnerStack>)
    const nextProps = {
      animation,
      children: <Child key={17} />,
      innerRouter: { history: { action: 'PUSH', index: 1 } }
    }
    subject.instance().handlePush(nextProps)
    expect(subject).toHaveState('scenes', [<Child key='original' />, <Child key={17} />])
    expect(animation.play).toHaveBeenCalledWith({ toValue: 2 })
  })
})

describe('#handleReplace', () => {
  it('replaces the last scene in the stack and plays the animation', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} innerRouter={{}} outerRouter={{}}>
      <Child key='original' />
    </InnerStack>)
    const nextProps = {
      animation,
      children: <Child key={17} />,
      innerRouter: { history: { action: 'REPLACE', index: 0 } }
    }
    subject.instance().handleReplace(nextProps)
    expect(subject).toHaveState('scenes', [<Child key={17} />])
    expect(animation.play).toHaveBeenCalledWith({ toValue: 1 })
  })
})

describe('#render', () => {
  it('renders the scenes properly', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} innerRouter={{}} outerRouter={{}}>
      <Child key='original' />
    </InnerStack>)
    subject.setState({
      scenes: [<Child key={1} foo={1} />, <Child key={2} foo={2} />, <Child key={3} foo={3} />, <Child key={4} foo={4} />]
    })
    expect(subject).toMatchSnapshot()
  })
})
