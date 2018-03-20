import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-native'
import { Animation } from '../Animation'
import { InnerStack } from './InnerStack'

export class Stack extends Component {
  static defaultProps = {
    initialLocation: '/'
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    easing: PropTypes.any,
    duration: PropTypes.number,
    initialLocation: PropTypes.any.isRequired
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
