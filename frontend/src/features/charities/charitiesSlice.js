// src/features/charities/charitiesSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const charitiesSlice = createSlice({
  name: 'charities',
  initialState: {
    list: [],
  },
  reducers: {
    setCharities: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setCharities } = charitiesSlice.actions;
export default charitiesSlice.reducer;
