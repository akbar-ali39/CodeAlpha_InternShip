import { configureStore } from '@reduxjs/toolkit';
import quoteReducer from '../ReduxToolKit/QuoteSlice';

export const store = configureStore({
  reducer: {
    quotes: quoteReducer,
  },
});