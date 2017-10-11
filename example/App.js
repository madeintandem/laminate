import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NativeRouter, Route, Switch } from 'react-router-native'
import { Scene } from './Scene'
import { Drawer } from './Drawer'
import { Stack, AnimatedRoute } from 'laminate'

const Scene1 = (props) => (<Scene {...props} text='1' linkTo='/2' backgroundColor='lightgreen' disableBack />)
const Scene2 = (props) => (<Scene {...props} text='2' linkTo='/3' backgroundColor='lightpink' />)
const Scene3 = (props) => (<Scene {...props} text='3' linkTo='/4' backgroundColor='lightskyblue' />)
const Scene4 = (props) => (<Scene {...props} text='4' backgroundColor='lightsalmon' />)

export default class App extends React.Component {
  render () {
    return (
      <NativeRouter initialEntries={['/1']}>
        <View style={styles.container}>
          <Route>
            {({location}) => <Text>{location.pathname}</Text>}
          </Route>
          <AnimatedRoute path='*/drawer' component={Drawer} />
          <Stack initialLocation='/1'>
            <Route path='/1' component={Scene1} />
            <Route path='/2' component={Scene2} />
            <Route path='/3' component={Scene3} />
            <Route path='/4' component={Scene4} />
          </Stack>
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
    marginTop: 40
  }
})
