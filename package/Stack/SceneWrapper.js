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
    index: PropTypes.number.isRequired,
    interpolateAnimation: PropTypes.func.isRequired,
    setAnimationValue: PropTypes.func.isRequired
  }

  getChildContext () {
    return {
      index: this.props.index,
      interpolateAnimation: this.interpolateAnimation,
      setAnimationValue: this.setAnimationValue
    }
  }

  setAnimationValue = (value) => {
    const { animationValue, index } = this.props
    animationValue.setValue(index + value)
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

export const WithStackAnimation = renderChildrenComponentWithContext('WithStackAnimation', SceneWrapper.childContextTypes)
