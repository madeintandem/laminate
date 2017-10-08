import React, { Component } from 'react'
import { Animated, StyleSheet, Text, Dimensions, Button } from 'react-native'
import { withRouter } from 'react-router-native'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingTop: 50,
    top: 0,
    left: 0,
    width: '50%',
    height: '100%',
    backgroundColor: 'gray',
    zIndex: 10
  },
  text: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 20
  }
})

const BackButton = withRouter(({history}) => (<Button title='Back' onPress={() => history.goBack()} />))

export class Drawer extends Component {
  render () {
    const { animation } = this.props

    const { width } = Dimensions.get('window')

    const offset = { left: animation.interpolate({ inputRange: [0, 1], outputRange: [-width / 2, 0] }) }

    return <Animated.View style={[styles.container, offset]}>
      <Text>I am the drawer!</Text>
      <BackButton />
    </Animated.View>
  }
}
