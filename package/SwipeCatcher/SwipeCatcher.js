import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Dimensions, PanResponder, StyleSheet } from 'react-native'
import {
  LEFT_TO_RIGHT,
  RIGHT_TO_LEFT,
  TOP_TO_BOTTOM,
  BOTTOM_TO_TOP
} from './constants'

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
        [LEFT_TO_RIGHT]: () => width,
        [RIGHT_TO_LEFT]: () => width,
        [TOP_TO_BOTTOM]: () => height,
        [BOTTOM_TO_TOP]: () => height
      })
    }
  }

  percentCompleteFromGestureState = ({ dx, dy }) => {
    const { height, width } = this.windowDimensions()

    const result = this.invokeForCurrentDirection({
      [LEFT_TO_RIGHT]: () => dx / width,
      [RIGHT_TO_LEFT]: () => -(dx / width),
      [TOP_TO_BOTTOM]: () => dy / height,
      [BOTTOM_TO_TOP]: () => -(dy / height)
    })

    return Math.max(result, 0)
  }

  velocityFromGestureState = ({ vx, vy }) => {
    return this.invokeForCurrentDirection({
      [LEFT_TO_RIGHT]: () => vx,
      [RIGHT_TO_LEFT]: () => vx,
      [TOP_TO_BOTTOM]: () => vy,
      [BOTTOM_TO_TOP]: () => vy
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
        [LEFT_TO_RIGHT]: () => pageX <= edgeThreshold && dx > 0,
        [RIGHT_TO_LEFT]: () => pageX <= edgeThreshold && dx < 0,
        [TOP_TO_BOTTOM]: () => pageY <= edgeThreshold && dy > 0,
        [BOTTOM_TO_TOP]: () => pageY <= edgeThreshold && dy < 0
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
