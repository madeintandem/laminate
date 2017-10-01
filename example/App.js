import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NativeRouter, Route, Switch } from 'react-router-native'
import { Scene } from './Scene'

const Scene1 = () => (<Scene text='1' linkTo='/2' backgroundColor='lightgreen' disableBack />)
const Scene2 = () => (<Scene text='2' linkTo='/3' backgroundColor='lightpink' />)
const Scene3 = () => (<Scene text='3' linkTo='/4' backgroundColor='lightskyblue' />)
const Scene4 = () => (<Scene text='4' backgroundColor='lightsalmon' />)

export default class App extends React.Component {
  render () {
    return (
      <NativeRouter>
        <View style={styles.container}>
          <Switch>
            <Route path='/2' component={Scene2} />
            <Route path='/3' component={Scene3} />
            <Route path='/4' component={Scene4} />
            <Route path='/' component={Scene1} />
          </Switch>
        </View>
      </NativeRouter>
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
