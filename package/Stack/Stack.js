import React, { Component } from 'react'
import { Route, Switch } from 'react-router-native'
import { Animation } from '../Animation'
import { InnerStack } from './InnerStack'

export class Stack extends Component {
  static defaultProps = {
    initialLocation: '/'
  }

  render () {
    return <Route>
      {(router) => (
        <Animation easing={this.props.easing} duration={this.props.duration}>
          {animation => (
            <InnerStack animation={animation} router={router}>
              <Switch location={router.location}>
                {this.props.children}
              </Switch>
            </InnerStack>
          )}
        </Animation>
      )}
    </Route>
  }
}
