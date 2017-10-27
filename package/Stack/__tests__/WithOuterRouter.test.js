/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { WithOuterRouter } from '../WithOuterRouter'

const Child = () => 'a child'

it('renders its children with a wrapped router that is the outerRouter from context', () => {
  const subject = shallow(<WithOuterRouter>
    <Child />
  </WithOuterRouter>, { context: { outerRouter: { the: 'outer router' } } })
  expect(subject).toMatchSnapshot()
})
