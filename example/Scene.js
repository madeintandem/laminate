import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, View, StyleSheet, Text, Button } from 'react-native'
import { Link, withRouter } from 'react-router-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: 'absolute',
    // height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    backgroundColor: 'transparent'
  }
})

const BackButton = withRouter(({history}) => (<Button title='Back' onPress={() => history.goBack()} />))

export class Scene extends Component {
  static propTypes = {
    animation: PropTypes.instanceOf(Animated.Value),
    backgroundColor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render () {
    const { text, backgroundColor, linkTo, disableBack, animation, location } = this.props

    const opacity = animation ? { opacity: animation} : {}

    return <Animated.View style={[styles.container, { backgroundColor }, opacity]}>
      <Text style={styles.text}>
        This is scene {text}
      </Text>
      {linkTo && <Link component={Button} to={linkTo} title={`Go to ${linkTo}`} />}
      {disableBack || <BackButton />}
      <Link title='Open drawer' to={`${location.pathname}/drawer`} component={Button} />
    </Animated.View>
  }
}
