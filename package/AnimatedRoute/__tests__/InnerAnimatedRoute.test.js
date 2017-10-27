/* eslint-env jest */
import React from 'react'
import { Animated } from 'react-native'
import { shallow } from 'enzyme'
import { InnerAnimatedRoute } from '../InnerAnimatedRoute'

const Child = () => 'a child'

const animationMock = () => {
  return {
    play: jest.fn(),
    rewind: jest.fn(),
    value: new Animated.Value(17)
  }
}

describe('state', () => {
  it('has children match the children in props', () => {
    const children = <Child />
    const subject = shallow(<InnerAnimatedRoute animation={animationMock()}>
      {children}
    </InnerAnimatedRoute>)
    expect(subject).toHaveState('children', children)
  })
})

describe('#componentDidMount', () => {
  it('plays the animation when given children', () => {
    const animation = animationMock()
    const subject = shallow(<InnerAnimatedRoute animation={animation}>
      <Child />
    </InnerAnimatedRoute>)
    subject.instance().componentDidMount()
    expect(animation.play).toHaveBeenCalled()
  })

  it('does not play the animation when there are no children', () => {
    const animation = animationMock()
    const subject = shallow(<InnerAnimatedRoute animation={animation}>
      {null}
    </InnerAnimatedRoute>)
    subject.instance().componentDidMount()
    expect(animation.play).not.toHaveBeenCalled()
  })
})

describe('#componentWillReceiveProps', () => {
  describe('when entering', () => {
    it('enters', () => {
      const subject = shallow(<InnerAnimatedRoute animation={animationMock()}>
        {null}
      </InnerAnimatedRoute>)
      subject.instance().enter = jest.fn()
      subject.instance().exit = jest.fn()
      subject.instance().setState = jest.fn()
      subject.setProps({ animation: animationMock(), children: <Child /> })

      expect(subject.instance().enter).toHaveBeenCalledWith(<Child />)
      expect(subject.instance().exit).not.toHaveBeenCalled()
      expect(subject.instance().setState).not.toHaveBeenCalled()
    })
  })

  describe('when exiting', () => {
    it('exits', () => {
      const subject = shallow(<InnerAnimatedRoute animation={animationMock()}>
        <Child />
      </InnerAnimatedRoute>)
      subject.instance().enter = jest.fn()
      subject.instance().exit = jest.fn()
      subject.instance().setState = jest.fn()
      subject.setProps({ animation: animationMock(), children: null })

      expect(subject.instance().exit).toHaveBeenCalled()
      expect(subject.instance().enter).not.toHaveBeenCalled()
      expect(subject.instance().setState).not.toHaveBeenCalled()
    })
  })

  describe('when not entering and not exiting', () => {
    it('updates the children', () => {
      const subject = shallow(<InnerAnimatedRoute animation={animationMock()}>
        <Child foo='bar' />
      </InnerAnimatedRoute>)
      subject.instance().enter = jest.fn()
      subject.instance().exit = jest.fn()
      subject.instance().setState = jest.fn()
      subject.setProps({ animation: animationMock(), children: <Child /> })

      expect(subject.instance().setState).toHaveBeenCalledWith({ children: <Child /> })
      expect(subject.instance().exit).not.toHaveBeenCalled()
      expect(subject.instance().enter).not.toHaveBeenCalled()
    })
  })
})

describe('#enter', () => {
  it('updates the children and plays the animation afterwards', () => {
    const animation = animationMock()
    const subject = shallow(<InnerAnimatedRoute animation={animation}>
      {null}
    </InnerAnimatedRoute>)
    subject.instance().setState = jest.fn()
    subject.instance().enter(<Child />)
    expect(subject.instance().setState).toHaveBeenCalledWith({ children: <Child /> }, animation.play)
  })
})

describe('#exit', () => {
  it('rewinds the animation and updates the children afterwards', () => {
    const animation = animationMock()
    const subject = shallow(<InnerAnimatedRoute animation={animation}>
      <Child />
    </InnerAnimatedRoute>)
    subject.instance().exit()
    expect(animation.rewind).toHaveBeenCalledWith({ callback: subject.instance().clearChildren })
  })
})

describe('#clearChildren', () => {
  it('sets children to null', () => {
    const subject = shallow(<InnerAnimatedRoute animation={animationMock()}>
      <Child />
    </InnerAnimatedRoute>)
    subject.instance().clearChildren()
    expect(subject).toHaveState('children', null)
  })
})

describe('#render', () => {
  it('renders the children in state', () => {
    const subject = shallow(<InnerAnimatedRoute animation={animationMock()}>
      <Child foo='bar' />
    </InnerAnimatedRoute>)
    subject.setState({ children: <Child new='yes' /> })
    expect(subject).toMatchSnapshot()
  })
})
