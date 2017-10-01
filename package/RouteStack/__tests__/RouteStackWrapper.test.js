// /* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Route } from 'react-router-native'
import { RouteStackWrapper } from '../RouteStackWrapper'

describe('#render', () => {
  let subject

  beforeEach(() => {
    const Child = () => 'some child'
    const location = { location: 'stub' }
    subject = shallow(<RouteStackWrapper location={location}>
      <Child />
    </RouteStackWrapper>)
  })

  it('renders its children in a switch', () => {
    expect(subject).toMatchSnapshot()
  })

  it('passes shouldAnimatePath to RouteStack', () => {
    expect(subject.find('RouteStack')).toHaveProp('shouldAnimatePath', subject.instance().shouldAnimatePath)
  })
})

describe('#shouldAnimatePath', () => {
  let subject

  beforeEach(() => {
    subject = shallow(<RouteStackWrapper location={{}}>
      <Route path='/foo'/>
      <Route path='/bar' />
      <Route path='/baz' />
    </RouteStackWrapper>)
  })

  it('is true when one of the given routes has an exact match', () => {
    expect(subject.instance().shouldAnimatePath('/bar')).toEqual(true)
  })

  it('is false when none of the given routes has an exact match', () => {
    expect(subject.instance().shouldAnimatePath('/bar/baz')).toEqual(false)
  })
})
