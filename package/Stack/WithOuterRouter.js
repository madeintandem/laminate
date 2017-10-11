import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WrapRouter } from './WrapRouter'

export class OuterHistory extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }

  static contextTypes = {
    outerRouter: PropTypes.object.isRequired
  }

  render () {
    return <WrapRouter router={this.context.outerRouter}>
      {this.props.children}
    </WrapRouter>
  }
}
