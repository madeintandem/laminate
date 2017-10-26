import { Component } from 'react'
import { Animated, Easing } from 'react-native'
import PropTypes from 'prop-types'
import { renderChildrenComponentWithContext } from './renderChildrenComponentWithContext'

export class Animation extends Component {
  static defaultProps = {
    duration: 375,
    easing: Easing.inOut(Easing.cubic)
  }

  static propTypes = {
    animation: PropTypes.instanceOf(Animated.Value),
    children: PropTypes.any.isRequired,
    duration: PropTypes.number,
    easing: PropTypes.any
  }

  static childContextTypes = {
    animation: PropTypes.shape({
      play: PropTypes.func.isRequired,
      rewind: PropTypes.func.isRequired,
      value: PropTypes.instanceOf(Animated.Value).isRequired
    }).isRequired
  }

  state = {
    animation: new Animated.Value(0)
  }

  getChildContext () {
    return {
      animation: {
        play: this.play,
        rewind: this.rewind,
        value: this.state.animation
      }
    }
  }

  play = (options = {}) => {
    this.animate({ toValue: 1, ...options })
  }

  rewind = (options = {}) => {
    this.animate({ toValue: 0, ...options })
  }

  animate = ({ toValue, duration, easing, callback }) => {
    Animated.timing(this.state.animation, {
      toValue,
      duration: duration || this.props.duration,
      easing: easing || this.props.easing
    }).start(() => {
      callback && callback()
    })
  }

  render () {
    const { children } = this.props

    if (typeof children === 'function') {
      return children(this.getChildContext().animation)
    } else {
      return children
    }
  }
}

export const WithAnimation = renderChildrenComponentWithContext('WithAnimation', Animation.childContextTypes, 'animation')
