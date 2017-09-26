import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  }
})

export class Layer extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired,
    animation: PropTypes.instanceOf(Animated.Value).isRequired
  }

  render () {
    const { children, animation, index } = this.props
    const { width } = Dimensions.get('window')

    const slide = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0]
    })

    return <Animated.View style={[styles.container, { zIndex: index, left: slide }]}>
      {children}
    </Animated.View>
  }
}
