import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'
import { Animation } from '../Animation'
import { SceneWrapper } from './SceneWrapper'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  }
})

const allButLast = (collection) => collection.slice(0, collection.length - 1)

export class InnerStack extends Component {
  static propTypes = {
    ...Animation.childContextTypes,
    children: PropTypes.any.isRequired,
    innerRouter: PropTypes.object.isRequired,
    outerRouter: PropTypes.object.isRequired
  }

  static childContextTypes = {
    outerRouter: PropTypes.object.isRequired
  }

  state = {
    scenes: [this.props.children]
  }

  getChildContext () {
    return {
      outerRouter: this.props.outerRouter
    }
  }

  componentDidMount () {
    this.props.animation.play()
  }

  componentWillReceiveProps (nextProps) {
    const { innerRouter: newInnerRouter } = nextProps
    const scenesLength = this.scenes().length
    const { index: historyIndex } = newInnerRouter.history

    switch (newInnerRouter.history.action) {
      case 'REPLACE':
        this.handleReplace(nextProps); break
      case 'PUSH':
        if (scenesLength !== historyIndex + 1) {
          this.handlePush(nextProps)
        }
        break
      case 'POP':
        this.handlePop(nextProps)
        break
    }
  }

  scenes = () => this.state.scenes

  handlePop = (nextProps) => {
    const scenes = this.scenes().slice(0, nextProps.innerRouter.history.index + 1)
    this.props.animation.rewind({
      toValue: scenes.length,
      callback: () => this.setState({ scenes })
    })
  }

  handlePush = (nextProps) => {
    const scenes = [...this.scenes(), nextProps.children]
    this.setState({ scenes })
    setTimeout(() => nextProps.animation.play({ toValue: scenes.length }), 10)
  }

  handleReplace = (nextProps) => {
    const scenes = [...allButLast(this.scenes()), nextProps.children]
    this.setState({ scenes })
  }

  render () {
    return <View style={styles.container}>
      {this.scenes().map((scene, index) => (
        <SceneWrapper
          key={index}
          index={index}
          animationValue={this.props.animation.value}
        >
          {scene}
        </SceneWrapper>
      ))}
    </View>
  }
}
