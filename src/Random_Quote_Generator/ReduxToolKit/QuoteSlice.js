import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  favorites: [],
  saved: [],
};

const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.favorites.some(quote => quote.text === action.payload.text)) {
        state.favorites.push(action.payload);
        AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    addToSaved: (state, action) => {
      if (!state.saved.some(quote => quote.text === action.payload.text)) {
        state.saved.push(action.payload);
        AsyncStorage.setItem('saved', JSON.stringify(state.saved));
      }
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(
        quote => quote.text !== action.payload.text
      );
      AsyncStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    removeFromSaved: (state, action) => {
      state.saved = state.saved.filter(
        quote => quote.text !== action.payload.text
      );
      AsyncStorage.setItem('saved', JSON.stringify(state.saved));
    },
    setInitialState: (state, action) => {
      state.favorites = action.payload.favorites || [];
      state.saved = action.payload.saved || [];
    },
  },
});

export const {
  addToFavorites,
  addToSaved,
  removeFromFavorites,
  removeFromSaved,
  setInitialState,
} = quoteSlice.actions;

// Load initial state from AsyncStorage
export const initializeQuotes = () => async dispatch => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    const saved = await AsyncStorage.getItem('saved');
    
    dispatch(setInitialState({
      favorites: favorites ? JSON.parse(favorites) : [],
      saved: saved ? JSON.parse(saved) : [],
    }));
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
};

export default quoteSlice.reducer;