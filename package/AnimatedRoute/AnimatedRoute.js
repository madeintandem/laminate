import React, { Component } from 'react'
import { Route } from 'react-router-native'
import { Animation } from '../Animation'
import { InnerAnimatedRoute } from './InnerAnimatedRoute'

export class AnimatedRoute extends Component {
  static propTypes = {
    ...Route.propTypes
  }

  render () {
    const { component: GivenComponent, ...otherProps } = this.props

    return <Animation {...this.props}>
      {(animation) => (
        <Route {...otherProps}>
          {(routerProps) => (
            <InnerAnimatedRoute animation={animation}>
              {routerProps.match && <GivenComponent {...routerProps} animation={animation.value} />}
            </InnerAnimatedRoute>
          )}
        </Route>
      )}
    </Animation>
  }
}
