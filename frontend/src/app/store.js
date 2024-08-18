// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import charitiesReducer from '../features/charities/charitiesSlice';

export const store = configureStore({
  reducer: {
    charities: charitiesReducer,
  },
});
