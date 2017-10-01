import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Scene } from './Scene'

export default class App extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Scene text='1' backgroundColor='lightgreen' />
        <Scene text='2' backgroundColor='lightpink' />
        <Scene text='3' backgroundColor='lightskyblue' />
        <Scene text='4' backgroundColor='lightsalmon' />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40
  }
})
