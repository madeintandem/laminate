import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Text } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    backgroundColor: 'transparent'
  }
})

export class Scene extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render () {
    const { text, backgroundColor } = this.props

    return <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>
        This is scene {text}
      </Text>
    </View>
  }
}
