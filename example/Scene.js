import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, Dimensions, View, StyleSheet, Text, Button } from 'react-native'
import { Link, Route, withRouter } from 'react-router-native'
import { WithStackAnimation, WithOuterRouter, SwipeableScene } from 'laminate'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '10%',
    height: '90%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    backgroundColor: 'transparent'
  }
})

const BackButton = () => (
  <Route>
    {({history}) => (
      <Button title='Back' onPress={() => history.goBack()} />
    )}
  </Route>
)

const BackToStartButton = ({index}) => (
  <Route>
    {({history}) => (
      <Button title='Back to start' onPress={() => history.go(-index)} />
    )}
  </Route>
)

const CurrentRoutes = ({text}) => (
  <Route>
    {({location}) => (
      <WithOuterRouter>
        <Route>
          {({location: outerLocation}) => (
            <Text style={styles.text}>
              This is scene {text}: {location.pathname} {outerLocation.pathname}
            </Text>
          )}
        </Route>
      </WithOuterRouter>
    )}
  </Route>
)

const OpenDrawer = () => (
  <Route>
    {({location}) => (
      <Link title={`Open drawer: ${location.pathname}`} to={`${location.pathname}/drawer`} component={Button} />
    )}
  </Route>
)

export class Scene extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  containerStyles = (interpolateAnimation) => {
    const { backgroundColor } = this.props
    const { width } = Dimensions.get('window')

    return {
      backgroundColor,
      left: interpolateAnimation({ inputRange: [0, 1, 2], outputRange: [width, width * 0.1, 0]})
    }
  }

  render () {
    const { text, linkTo, disableBack } = this.props

    return <SwipeableScene>
      <WithStackAnimation>
        {({interpolateAnimation, index, setAnimationValue}) => (
          <Animated.View style={[ styles.container, this.containerStyles(interpolateAnimation) ]}>
              <CurrentRoutes text={text} />
              {linkTo && <Link component={Button} to={linkTo} title={`Go to ${linkTo}`} />}
              {disableBack || <BackButton />}
              {disableBack || <BackToStartButton index={index} />}
              <WithOuterRouter>
                <OpenDrawer />
              </WithOuterRouter>
            </Animated.View>
          )}
        </WithStackAnimation>
    </SwipeableScene>
  }
}
