import React, { Component } from 'react'
import { Route } from 'react-router-native'
import { Animation } from './Animation'

class InnerAnimatedRoute extends Component {
  static propTypes = {
    ...Animation.childContextTypes
  }

  state = {
    children: this.props.children
  }

  componentDidMount () {
    if (this.props.children) {
      this.props.animation.play()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { children: currentChildren } = this.props
    const { children: nextChildren } = nextProps

    if (this.isEntering(currentChildren, nextChildren)) {
      this.enter(nextChildren)
    } else if (this.isExiting(currentChildren, nextChildren)) {
      this.exit()
    } else {
      this.setState({ children: nextChildren })
    }
  }

  enter = (children) => {
    this.setState({ children }, this.props.animation.play)
  }

  exit = () => {
    this.props.animation.rewind({ callback: () => this.setState({ children: null }) })
  }

  isEntering = (currentChildren, nextChildren) => {
    return !currentChildren && nextChildren
  }

  isExiting = (currentChildren, nextChildren) => {
    return currentChildren && !nextChildren
  }

  render () {
    return this.state.children
  }
}

export class AnimatedRoute extends Component {
  static propTypes = {
    ...Route.propTypes
  }

  render () {
    const { component: GivenComponent, ...otherProps } = this.props

    return <Animation {...this.props}>
      {(animation) => (
        <Route {...otherProps}>
          {(routerProps) => (
            <InnerAnimatedRoute animation={animation}>
              {routerProps.match && <GivenComponent {...routerProps} animation={animation.value} />}
            </InnerAnimatedRoute>
          )}
        </Route>
      )}
    </Animation>
  }
}
