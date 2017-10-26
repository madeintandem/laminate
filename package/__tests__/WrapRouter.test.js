/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { WrapRouter } from '../WrapRouter'

it('renders its children', () => {
  const Child = () => 'a child'
  const subject = shallow(<WrapRouter router={{}}>
    <Child />
  </WrapRouter>, { context: { router: {} } })
  expect(subject).toMatchSnapshot()
})

it('overrides the router in context', () => {
  const Child = () => 'a child'
  const router = { a: 'router', with: 'stuff' }
  const newRouter = { my: 'router', with: 'my stuff' }
  const subject = shallow(<WrapRouter router={newRouter}>
    <Child />
  </WrapRouter>, { context: { router } })
  expect(subject.instance().getChildContext()).toEqual({
    router: {
      a: 'router',
      my: 'router',
      with: 'my stuff'
    }
  })
})
