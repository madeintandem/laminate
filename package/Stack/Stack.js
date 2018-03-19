import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, MemoryRouter } from 'react-router-native'
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
      {(outerRouter) => (
        <MemoryRouter initialEntries={[this.props.initialLocation]}>
          <Route>
            {(innerRouter) => (
              <Animation
                easing={this.props.easing}
                duration={this.props.duration}
              >
                {animation => (
                  <InnerStack
                    animation={animation}
                    innerRouter={innerRouter}
                    outerRouter={outerRouter}
                  >
                    <Switch location={innerRouter.location}>
                      {this.props.children}
                    </Switch>
                  </InnerStack>
                )}
              </Animation>
            )}
          </Route>
        </MemoryRouter>
      )}
    </Route>
  }
}
