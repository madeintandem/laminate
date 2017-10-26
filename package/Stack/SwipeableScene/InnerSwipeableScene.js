import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SwipeCatcher } from '../../SwipeCatcher'

export class InnerSwipeableScene extends Component {
  static defaultProps = {
    completeThreshold: 0.5
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    completeThreshold: PropTypes.number,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    setAnimationValue: PropTypes.func.isRequired
  }

  handleMove = ({ percentComplete, velocity }) => {
    this.props.setAnimationValue(1 - percentComplete)
  }

  handleGestureRelease = ({ percentComplete, velocity }) => {
    const { completeThreshold, history, location } = this.props

    if (percentComplete > completeThreshold) {
      history.goBack()
    } else {
      history.replace(location)
    }
  }

  handleGestureTerminate = ({ percentComplete, velocity }) => {
    const { history, location } = this.props
    history.replace(location)
  }

  render () {
    return <SwipeCatcher
      {...this.props}
      onMove={this.handleMove}
      onGestureRelease={this.handleGestureRelease}
      onGestureTerminate={this.handleGestureTerminate}
    />
  }
}
