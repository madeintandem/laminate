/* eslint-env jest */
import React from 'react'

class Value {
  constructor (value) {
    this.value = value
  }

  interpolate (args) {
    return { interpolated: this.value, args: args }
  }

  setValue (value) {
    this.value = value
  }
}

const AnimatedView = ({ children }) => children
AnimatedView.displayName = 'Animated.View'

const animatedTimingStart = jest.fn((func) => func && func())
const Animated = {
  Value,
  View: AnimatedView,
  timing: jest.fn(() => ({ start: animatedTimingStart })),
  animatedTimingStart
}

const Dimensions = { get: jest.fn(() => ({ width: 375, height: 667 })) }

const Easing = { inOut: jest.fn() }

const PanResponder = { create: jest.fn((args) => ({ panHandlers: args })) }

const View = ({ children }) => <div>{children}</div> // eslint-disable-line

const StyleSheet = { create: jest.fn(styles => styles) }

export {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  View
}
