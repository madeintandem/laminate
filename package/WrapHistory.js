import { Component } from 'react'
import PropTypes from 'prop-types'

export class WrapHistory extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    history: PropTypes.any.isRequired
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
        history: {
          ...this.context.router.history,
          ...this.props.history
        }
      }
    }
  }

  render () {
    return this.props.children
  }
}
