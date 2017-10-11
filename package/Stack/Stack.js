import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, NativeRouter } from 'react-router-native'
import { Animation } from '../Animation'
import { InnerStack } from '../InnerStack'

export class Stack extends Component {
  static defaultProps = {
    initialLocation: '/'
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    initialLocation: PropTypes.any.isRequired
  }

  render () {
    return <Route>
      {(outerRouter) => (
        <NativeRouter initialEntries={this.props.initialLocation}>
          <Route>
            {(innerRouter) => (
              <Animation>
                {animation => (
                  <InnerStack
                    animation={animation}
                    innerRouter={innerRouter}
                    outerRouter={outerRouter}
                  >
                    <Switch>
                      {this.props.children}
                    </Switch>
                  </InnerStack>
                )}
              </Animation>
            )}
          </Route>
        </NativeRouter>
      )}
    </Route>
  }
}
