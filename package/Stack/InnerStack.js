import React, { Component } from 'react'
import { matchPath } from 'react-router-native'
import { SceneWrapper } from './SceneWrapper'

const allButLast = (collection) => collection.slice(0, collection.length - 1)

export class InnerStack extends Component {
  state = {
    scenes: [this.props.children]
  }

  componentDidMount () {
    this.props.animation.play()
  }

  componentWillReceiveProps (nextProps) {
    const { router } = nextProps
    if (router.location.key === this.props.router.location.key) {
      return
    }
    if (!this.isRelevantChange(nextProps)) {
      return
    }

    switch (router.history.action) {
      case 'REPLACE':
        this.handleReplace(nextProps); break
      case 'PUSH':
        this.handlePush(nextProps); break
      case 'POP':
        this.handlePop(nextProps); break
    }
  }

  isRelevantChange = (nextProps) => {
    const routes = nextProps.children.props.children
    const oldMatchingRoutes = routes.filter((route) => matchPath(this.props.router.location.pathname, { ...route.props, exact: true }))
    const newMatchingRoutes = routes.filter((route) => matchPath(nextProps.router.location.pathname, { ...route.props, exact: true }))
    return !!newMatchingRoutes.length && !!oldMatchingRoutes.length
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
    this.setState({ scenes }, () => nextProps.animation.play({ toValue: scenes.length }))
  }

  render () {
    return this.scenes().map((scene, index) => (
      <SceneWrapper
        key={index}
        index={index}
        animationValue={this.props.animation.value}
      >
        {scene}
      </SceneWrapper>
    ))
  }
}
