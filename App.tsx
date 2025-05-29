import React, { useEffect } from 'react';
import "./global.css"
import AppNavigation from './src/Random_Quote_Generator/Navigation/AppNavigation';
import { Provider } from 'react-redux';
import { store } from './src/Random_Quote_Generator/ReduxToolKit/MyStore';
import {initializeQuotes}  from './src/Random_Quote_Generator/ReduxToolKit/QuoteSlice.js';



const App = () => {
  useEffect(()=>{
    store.dispatch(initializeQuotes())
  },[])
  return (
    <Provider store={store}>
    <AppNavigation />
    </Provider>
  )
}

export default App