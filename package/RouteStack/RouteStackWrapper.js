import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, matchPath } from 'react-router-native'
import some from 'lodash.some'
import { RouteStack } from './RouteStack'

const hasExactMatch = (pathname, path) => {
  return matchPath(pathname, { path, exact: true }) != null
}

class RouteStackWrapperComponent extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired
  }

  shouldAnimatePath = (newPath) => {
    const paths = this.props.children.map(route => route.props.path)
    return some(paths, path => hasExactMatch(newPath, path))
  }

  render () {
    const { children } = this.props

    return <RouteStack shouldAnimatePath={this.shouldAnimatePath}>
      <Switch location={this.props.location}>
        {children}
      </Switch>
    </RouteStack>
  }
}

export const RouteStackWrapper = withRouter(RouteStackWrapperComponent)
