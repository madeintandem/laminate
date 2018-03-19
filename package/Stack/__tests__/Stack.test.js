/* eslint-env jest */
import React from 'react'
import { mount } from 'enzyme'
import { StaticRouter, Route } from 'react-router-native'
import { Stack } from '../Stack'

const Child = () => <div>a child</div>

it('renders properly', () => {
  const subject = mount(<StaticRouter location='/bar' context={{}}>
    <Stack initialLocation='/foo' easing='easing' duration={123}>
      <Route component={Child} path='/foo' />
    </Stack>
  </StaticRouter>)
  expect(subject).toMatchSnapshot()
})
