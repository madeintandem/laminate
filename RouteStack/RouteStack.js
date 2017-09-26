import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Animated, PanResponder, View, StyleSheet, Dimensions } from 'react-native'
import { Layer } from './Layer'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
})

function percentCompleteFromGestureState (gestureState) {
  const windowSize = Dimensions.get('window')
  const screenWidth = Math.ceil(windowSize.width)
  return Math.max(gestureState.dx / screenWidth, 0)
}

export class RouteStack extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    shouldAnimatePath: PropTypes.func.isRequired
  }

  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state = {
    stack: [{ children: this.props.children, animation: new Animated.Value(1) }]
  }

  pushing = false

  replacing = false

  isAnimating = false

  animationPercentage = 1

  getChildContext () {
    return {
      router: {
        ...this.context.router,
        history: this.wrappedHistory()
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    const { stack: oldStack } = this.state

    if (this.pushing) {
      const animation = new Animated.Value(0)
      const stack = [...oldStack, { children: nextProps.children, animation }]
      this.setState({ stack }, () => this.forwardAnimation(animation))
      this.pushing = false
    } else if (this.replacing) {
      const frame = oldStack[oldStack.length - 1]
      frame.children = nextProps.children
      const stack = oldStack.slice(0, oldStack.length - 1)
      stack.push(frame)
      this.setState({ stack })
      this.replacing = false
    }
  }

  wrappedHistory = () => {
    const { push, replace, goBack } = this

    return {
      ...this.history(),
      push,
      replace,
      goBack
    }
  }

  push = (path, ...args) => {
    if (this.isAnimating) { return }
    this.pushing = this.props.shouldAnimatePath(path)
    this.history().push(path, ...args)
  }

  replace = (...args) => {
    if (this.isAnimating) { return }
    this.replacing = true
    this.history().replace(...args)
  }

  goBack = (...args) => {
    if (this.isAnimating) { return }
    const animation = this.state.stack[this.state.stack.length - 1].animation
    this.reverseAnimation(animation, () => {
      this.history().goBack(...args)
      const stack = this.state.stack.slice(0, this.state.stack.length - 1)
      this.setState({ stack })
    })
  }

  history = () => {
    return this.context.router.history
  }

  forwardAnimation = (animation, callback) => {
    this.startAnimation(animation, 1, callback)
  }

  reverseAnimation = (animation, callback) => {
    this.startAnimation(animation, 0, callback)
  }

  startAnimation = (animation, toValue, callback) => {
    this.isAnimating = true
    Animated.timing(animation, { toValue, duration: 3000 * this.animationPercentage }).start(() => {
      callback && callback()
      this.animationPercentage = 1
      this.isAnimating = false
    })
  }

  lastAnimation = () => {
    const { stack } = this.state
    return stack[stack.length - 1].animation
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: ({ nativeEvent }, gestureState) => (
      this.state.stack.length > 1 &&
        !this.isAnimating &&
        nativeEvent.pageX <= 60 &&
        gestureState.dx > 0
    ),

    onPanResponderGrant: () => {},

    onPanResponderMove: (event, gestureState) => {
      this.lastAnimation().setValue(1 - percentCompleteFromGestureState(gestureState))
    },

    onPanResponderTerminate: (event, gestureState) => {
      this.animationPercentage = percentCompleteFromGestureState(gestureState)
      if (this.animationPercentage > 0.5) {
        this.goBack()
      } else {
        this.forwardAnimation(this.lastAnimation())
      }
    },

    onPanResponderRelease: (event, gestureState) => {
      this.animationPercentage = percentCompleteFromGestureState(gestureState)
      if (this.animationPercentage > 0.5) {
        this.goBack()
      } else {
        this.forwardAnimation(this.lastAnimation())
      }
    }
  })

  render () {
    return <View style={styles.container} {...this.panResponder.panHandlers}>
      {this.state.stack.map(({ children, animation }, index) => (
        <Layer key={`${index}`} index={index} animation={animation}>
          {children}
        </Layer>
      ))}
    </View>
  }
}
