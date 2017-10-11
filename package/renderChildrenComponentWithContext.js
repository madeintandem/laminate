import { Component } from 'react'
import PropTypes from 'prop-types'

export const renderChildrenComponentWithContext = (name, childContextTypes, key) => {
  class NewComponent extends Component {
    static displayName = name

    static contextTypes = childContextTypes

    static propTypes = {
      children: PropTypes.func.isRequired
    }

    render () {
      return this.props.children(key ? this.context[key] : this.context)
    }
  }

  return NewComponent
}
