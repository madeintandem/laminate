/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { StaticRouter } from 'react-router-native'
import { AnimatedRoute } from '../AnimatedRoute'

const Child = () => <div>child</div>

it('renders the given component when the route matches', () => {
  const subject = mount(<StaticRouter location='/foo' context={{}}>
    <AnimatedRoute path='/foo' component={Child} another='prop' />
  </StaticRouter>)
  expect(subject).toMatchSnapshot()
})

it('does not render the given component when the route does not match', () => {
  const subject = mount(<StaticRouter location='/bar' context={{}}>
    <AnimatedRoute path='/foo' component={Child} another='prop' />
  </StaticRouter>)
  expect(subject).toMatchSnapshot()
})
