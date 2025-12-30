import { createSlice } from '@reduxjs/toolkit';

export interface AppState {}
const initialState: AppState = {};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {},
});

export default appSlice.reducer;
