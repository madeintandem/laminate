import { Component } from 'react'
import { Animation } from '../Animation'

export class InnerAnimatedRoute extends Component {
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
    this.props.animation.rewind({ callback: this.clearChildren })
  }

  clearChildren = () => this.setState({ children: null })

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
