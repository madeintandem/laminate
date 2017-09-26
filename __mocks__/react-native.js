/* eslint-env jest */

class Value {
  constructor (value) {
    this.value = value
  }

  interpolate (args) {
    return { interpolated: this.value, args: args }
  }
}

const View = ({ children }) => children
View.displayName = 'Animated.View'

const Animated = { Value, View }

const Dimensions = { get: jest.fn(() => ({ width: 375, height: 667 })) }

const StyleSheet = { create: jest.fn(styles => styles) }

export {
  Animated,
  Dimensions,
  StyleSheet
}
