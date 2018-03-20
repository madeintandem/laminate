/* eslint-env jest */
import React from 'react'
import { Animated, Text } from 'react-native'
import { shallow } from 'enzyme'
import { uniqueId } from 'lodash'
import { InnerStack } from '../InnerStack'

const Child = () => <Text>a child</Text>

const animationMock = () => {
  return {
    play: jest.fn(),
    rewind: jest.fn(({ callback }) => callback && callback()),
    value: new Animated.Value(17)
  }
}

const routerMock = (history) => {
  return {
    history: history || {},
    location: { key: uniqueId(), pathname: '/foo' },
    match: {}
  }
}

describe('state', () => {
  it('has scenes', () => {
    const children = <Child />
    const subject = shallow(<InnerStack animation={animationMock()} router={routerMock()}>
      {children}
    </InnerStack>)

    expect(subject.instance().state.scenes).toEqual([children])
  })
})

describe('#componentDidMount', () => {
  it('plays the animation', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} router={routerMock()}>
      <Child />
    </InnerStack>)
    subject.instance().componentDidMount()
    expect(animation.play).toHaveBeenCalled()
  })
})

describe('#componentWillReceiveProps', () => {
  let subject
  let children

  beforeEach(() => {
    children = <Child>
      <Child path='/foo' />
      <Child />
      <Child />
    </Child>
    const animation = animationMock()
    subject = shallow(<InnerStack animation={animation} router={routerMock()}>
      {children}
    </InnerStack>)
    subject.instance().handleReplace = jest.fn()
    subject.instance().handlePush = jest.fn()
    subject.instance().handlePop = jest.fn()
  })

  it('handles replacing', () => {
    const nextProps = {
      router: routerMock({ action: 'REPLACE', index: 2 }),
      children
    }
    subject.instance().componentWillReceiveProps(nextProps)
    expect(subject.instance().handleReplace).toHaveBeenCalledWith(nextProps)
    expect(subject.instance().handlePush).not.toHaveBeenCalled()
    expect(subject.instance().handlePop).not.toHaveBeenCalled()
  })

  it('handles pushing', () => {
    const nextProps = {
      router: routerMock({ action: 'PUSH' }),
      children
    }
    subject.instance().componentWillReceiveProps(nextProps)
    expect(subject.instance().handlePush).toHaveBeenCalledWith(nextProps)
    expect(subject.instance().handleReplace).not.toHaveBeenCalled()
    expect(subject.instance().handlePop).not.toHaveBeenCalled()
  })

  it('handles popping', () => {
    const nextProps = {
      router: routerMock({ action: 'POP' }),
      children
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
    const subject = shallow(<InnerStack animation={animation} router={routerMock()}>
      <Child />
    </InnerStack>)
    const nextProps = {
      router: routerMock({ action: 'POP' })
    }
    subject.setState({ scenes: [<Child key={1} />, <Child key={2} />, <Child key={3} />] })
    subject.instance().handlePop(nextProps)
    expect(animation.rewind).toHaveBeenCalledWith({ toValue: 2, callback: expect.any(Function) })
    expect(subject.instance().state.scenes).toEqual([<Child key={1} />, <Child key={2} />])
  })
})

describe('#handlePush', () => {
  it('adds a scene to the stack and plays the animation', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} router={routerMock()}>
      <Child key='original' />
    </InnerStack>)
    const nextProps = {
      animation,
      children: <Child key={17} />,
      router: { history: { action: 'PUSH', index: 1 } }
    }
    subject.instance().handlePush(nextProps)
    expect(subject.instance().state.scenes).toEqual([<Child key='original' />, <Child key={17} />])
    expect(animation.play).toHaveBeenCalledWith({ toValue: 2 })
  })
})

describe('#handleReplace', () => {
  it('replaces the last scene in the stack and plays the animation', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} router={routerMock()}>
      <Child key='original' />
    </InnerStack>)
    const nextProps = {
      animation,
      children: <Child key={17} />,
      router: { history: { action: 'REPLACE', index: 0 } }
    }
    subject.instance().handleReplace(nextProps)
    subject.update()
    expect(subject.instance().state.scenes).toEqual([<Child key={17} />])
    expect(animation.play).toHaveBeenCalledWith({ toValue: 1 })
  })
})

describe('#render', () => {
  it('renders the scenes properly', () => {
    const animation = animationMock()
    const subject = shallow(<InnerStack animation={animation} router={routerMock()}>
      <Child key='original' />
    </InnerStack>)
    subject.setState({
      scenes: [<Child key={1} foo={1} />, <Child key={2} foo={2} />, <Child key={3} foo={3} />, <Child key={4} foo={4} />]
    })
    expect(subject).toMatchSnapshot()
  })
})
