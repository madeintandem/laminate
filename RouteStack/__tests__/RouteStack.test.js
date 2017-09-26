/* eslint-env jest */
import React from 'react'
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
