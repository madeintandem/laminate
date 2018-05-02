import React, { Component } from 'react'

const { Provider, Consumer } = React.createContext()

export class SceneWrapper extends Component {
  sceneWrapperProps = () => {
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
    return <Provider value={this.sceneWrapperProps()}>
      {this.props.children}
    </Provider>
  }
}

export const WithStackAnimation = Consumer
