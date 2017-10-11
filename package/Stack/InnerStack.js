import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
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

  componentWillReceiveProps (nextProps) {
    const { innerRouter: oldInnerRouter } = this.props
    const { innerRouter: newInnerRouter } = nextProps

    if (newInnerRouter.history.action === 'REPLACE') {
      this.handleReplace(nextProps)
      // history is mutable so this is maybe a problem to work around
    } else if (oldInnerRouter.history.length !== newInnerRouter.history.length) {
      switch (newInnerRouter.history.action) {
        case 'PUSH': this.handlePush(nextProps); break
        case 'POP': this.handlePop(nextProps); break
      }
    }
  }

  scenes = () => this.state.scenes

  handlePop = (nextProps) => {
    const scenes = allButLast(this.scenes())
    this.props.animation.rewind({
      toValue: scenes.length,
      callback: () => this.setState({ scenes })
    })
  }

  handlePush = (nextProps) => {
    const scenes = [...this.scenes(), nextProps.children]
    this.setState({ scenes }, () => nextProps.animation.play({ toValue: scenes.length }))
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
