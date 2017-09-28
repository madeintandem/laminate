/* eslint-env jest */

class Value {
  constructor (value) {
    this.value = value
  }

  interpolate (args) {
    return { interpolated: this.value, args: args }
  }
}

const AnimatedView = ({ children }) => children
AnimatedView.displayName = 'Animated.View'

const animatedTimingStart = jest.fn()
const Animated = {
  Value,
  View: AnimatedView,
  timing: jest.fn(() => ({ start: animatedTimingStart })),
  animatedTimingStart
}

const Dimensions = { get: jest.fn(() => ({ width: 375, height: 667 })) }

const PanResponder = { create: jest.fn((args) => ({ panResponder: args })) }

const View = ({ children }) => children

const StyleSheet = { create: jest.fn(styles => styles) }

export {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View
}
