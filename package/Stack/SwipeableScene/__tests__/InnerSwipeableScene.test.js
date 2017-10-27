/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { InnerSwipeableScene } from '../InnerSwipeableScene'

const Child = () => <div>a child</div>

describe('#handleMove', () => {
  it('calls set animation value', () => {
    const setAnimationValue = jest.fn()
    const subject = shallow(<InnerSwipeableScene setAnimationValue={setAnimationValue} history={{}} location={{}}>
      <Child />
    </InnerSwipeableScene>)
    subject.instance().handleMove({ percentComplete: 0.3 })
    expect(setAnimationValue).toHaveBeenCalledWith(0.7)
  })
})

describe('#handleGestureRelease', () => {
  it('goes back when it passes the threshold', () => {
    const history = { goBack: jest.fn(), replace: jest.fn() }
    const location = { the: 'location' }
    const subject = shallow(<InnerSwipeableScene completeThreshold={0.3} setAnimationValue={jest.fn()} history={history} location={location}>
      <Child />
    </InnerSwipeableScene>)
    subject.instance().handleGestureRelease({ percentComplete: 0.4 })
    expect(history.goBack).toHaveBeenCalled()
    expect(history.replace).not.toHaveBeenCalled()
  })

  it('replaces when it does not pass the threshold', () => {
    const history = { goBack: jest.fn(), replace: jest.fn() }
    const location = { the: 'location' }
    const subject = shallow(<InnerSwipeableScene completeThreshold={0.3} setAnimationValue={jest.fn()} history={history} location={location}>
      <Child />
    </InnerSwipeableScene>)
    subject.instance().handleGestureRelease({ percentComplete: 0.2 })
    expect(history.replace).toHaveBeenCalledWith(location)
    expect(history.goBack).not.toHaveBeenCalled()
  })
})

describe('#handleGestureTerminate', () => {
  it('replaces', () => {
    const history = { replace: jest.fn() }
    const location = { the: 'location' }
    const subject = shallow(<InnerSwipeableScene setAnimationValue={jest.fn()} history={history} location={location}>
      <Child />
    </InnerSwipeableScene>)
    subject.instance().handleGestureRelease({})
    expect(history.replace).toHaveBeenCalledWith(location)
  })
})

describe('#render', () => {
  it('renders properly', () => {
    const history = { replace: jest.fn() }
    const location = { the: 'location' }
    const subject = shallow(<InnerSwipeableScene fun='prop' setAnimationValue={jest.fn()} history={history} location={location}>
      <Child />
    </InnerSwipeableScene>)
    expect(subject).toMatchSnapshot()
  })
})
