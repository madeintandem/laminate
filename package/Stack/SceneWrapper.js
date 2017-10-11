import { Component } from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'
import { renderChildrenComponentWithContext } from '../renderChildrenComponentWithContext'

export class SceneWrapper extends Component {
  static propTypes = {
    animationValue: PropTypes.instanceOf(Animated.Value).isRequired,
    children: PropTypes.any.isRequired,
    index: PropTypes.number.isRequired
  }

  static childContextTypes = {
    interpolateAnimation: PropTypes.func.isRequired
  }

  getChildContext () {
    return {
      interpolateAnimation: this.interpolateAnimation
    }
  }

  interpolateAnimation = ({ inputRange, outputRange }) => {
    const { animationValue, index } = this.props
    return animationValue.interpolate({
      inputRange: inputRange.map(value => value + index),
      outputRange
    })
  }

  render () {
    return this.props.children
  }
}

export const RouteStackAnimation = renderChildrenComponentWithContext('RouteStackAnimation', SceneWrapper.childContextTypes)
