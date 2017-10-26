import React, { Component } from 'react'
import { Route } from 'react-router-native'
import { WithStackAnimation } from '../SceneWrapper'
import { InnerSwipeableScene } from './InnerSwipeableScene'

export class SwipeableScene extends Component {
  render () {
    return <WithStackAnimation>
      {({ setAnimationValue }) => (
        <Route>
          {({ history, location }) => (
            <InnerSwipeableScene
              {...this.props}
              setAnimationValue={setAnimationValue}
              history={history}
              location={location}
            />
          )}
        </Route>
      )}
    </WithStackAnimation>
  }
}
