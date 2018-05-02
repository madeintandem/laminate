import React, { Component } from 'react'
import { Animated, Easing } from 'react-native'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext()

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

  state = {
    animation: new Animated.Value(0)
  }

  animationProps = () => {
    return {
      play: this.play,
      rewind: this.rewind,
      value: this.state.animation
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

  children = () => {
    const { children } = this.props

    if (typeof children === 'function') {
      return <Consumer>{children}</Consumer>
    } else {
      return children
    }
  }

  render () {
    return <Provider value={this.animationProps()}>
      {this.children()}
    </Provider>
  }
}

export const WithAnimation = Consumer
