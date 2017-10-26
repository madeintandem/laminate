import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Dimensions, PanResponder, StyleSheet } from 'react-native'

const LEFT_TO_RIGHT = 'leftToRight'
const RIGHT_TO_LEFT = 'rightToLeft'
const TOP_TO_BOTTOM = 'topToBottom'
const BOTTOM_TO_TOP = 'bottomToTop'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})

export class SwipeCatcher extends Component {
  static defaultProps = {
    direction: LEFT_TO_RIGHT
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    direction: PropTypes.oneOf([
      LEFT_TO_RIGHT,
      RIGHT_TO_LEFT,
      TOP_TO_BOTTOM,
      BOTTOM_TO_TOP
    ]),
    edgeThreshold: PropTypes.number,
    onGestureStart: PropTypes.func,
    onMove: PropTypes.func,
    onGestureRelease: PropTypes.func,
    onGestureTerminate: PropTypes.func,
    style: PropTypes.any
  }

  windowDimensions = () => Dimensions.get('window')

  invokeForCurrentDirection = (directions) => {
    const { direction } = this.props
    const result = directions[direction]
    if (result) {
      return result()
    } else {
      throw new Error(`Failed to handle direction '${direction}' in SwipeCatcher`)
    }
  }

  edgeThreshold = () => {
    const { edgeThreshold } = this.props
    const { height, width } = this.windowDimensions()

    if (edgeThreshold) {
      return edgeThreshold
    } else {
      return this.invokeForCurrentDirection({
        leftToRight: () => width,
        rightToLeft: () => width,
        topToBottom: () => height,
        bottomToTop: () => height
      })
    }
  }

  percentCompleteFromGestureState = ({ dx, dy }) => {
    const { height, width } = this.windowDimensions()

    const result = this.invokeForCurrentDirection({
      leftToRight: () => dx / width,
      rightToLeft: () => 1 - dx / width,
      topToBottom: () => dy / height,
      bottomToTop: () => 1 - dy / height
    })

    return Math.max(result, 0)
  }

  velocityFromGestureState = ({ vx, vy }) => {
    return this.invokeForCurrentDirection({
      leftToRight: () => vx,
      rightToLeft: () => vx,
      topToBottom: () => vy,
      bottomToTop: () => vy
    })
  }

  dataFromGestureState = (gestureState) => {
    return {
      percentComplete: this.percentCompleteFromGestureState(gestureState),
      velocity: this.velocityFromGestureState(gestureState)
    }
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponderCapture: ({ nativeEvent }, gestureState) => {
      const { pageX, pageY } = nativeEvent
      const { dx, dy } = gestureState
      const edgeThreshold = this.edgeThreshold()

      return this.invokeForCurrentDirection({
        leftToRight: () => pageX <= edgeThreshold && dx > 0,
        rightToLeft: () => pageX <= edgeThreshold && dx < 0,
        topToBottom: () => pageY <= edgeThreshold && dy > 0,
        bottomToTop: () => pageY <= edgeThreshold && dy < 0
      })
    },

    onPanResponderGrant: () => {
      const { onGestureStart } = this.props
      onGestureStart && onGestureStart()
    },

    onPanResponderMove: (event, gestureState) => {
      const { onMove } = this.props
      if (onMove) {
        onMove(this.dataFromGestureState(gestureState))
      }
    },

    onPanResponderTerminate: (event, gestureState) => {
      const { onGestureTerminate } = this.props
      if (onGestureTerminate) {
        onGestureTerminate(this.dataFromGestureState(gestureState))
      }
    },

    onPanResponderRelease: (event, gestureState) => {
      const { onGestureRelease } = this.props
      if (onGestureRelease) {
        onGestureRelease(this.dataFromGestureState(gestureState))
      }
    }
  })

  render () {
    const { children, style } = this.props

    return <View style={[styles.container, style]} {...this.panResponder.panHandlers}>
      {children}
    </View>
  }
}
