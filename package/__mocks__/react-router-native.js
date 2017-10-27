/* eslint-env jest */
import React from 'react'

const { Switch, Route, matchPath, StaticRouter } = require.requireActual('react-router-native')
const withRouter = component => component
const MemoryRouter = (props) => <StaticRouter context={{}} {...props} />

export { withRouter, Switch, Route, matchPath, MemoryRouter, StaticRouter }
