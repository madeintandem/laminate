import { Component } from 'react'
import PropTypes from 'prop-types'

export class WrapRouter extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    router: PropTypes.object.isRequired
  }

  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  getChildContext () {
    return {
      router: {
        ...this.context.router,
        ...this.props.router
      }
    }
  }

  render () {
    return this.props.children
  }
}
