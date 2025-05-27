import React from 'react';
import "./global.css"
import { Provider } from 'react-redux';
import { MyStore } from './src/FlashCard/ReduxToolkit/MyStore';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/FlashCard/Screen/Home';
import FlashCardFrom from './src/FlashCard/Compents/FlashCardFrom';

const App = () => {

  const Stack=createNativeStackNavigator();
 
  return (
     <Provider store={MyStore}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={Home} options={{headerShown:false}} />
          <Stack.Screen name='FlashCardFrom' component={FlashCardFrom} options={{headerShown:false}} />
        </Stack.Navigator>
      </NavigationContainer>
     </Provider>
  )
}

export default App