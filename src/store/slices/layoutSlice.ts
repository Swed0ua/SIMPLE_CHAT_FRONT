import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LayoutState {
  tabBarHeight: number;
}

const initialState: LayoutState = {
  tabBarHeight: 0,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setTabBarHeight: (state, action: PayloadAction<number>) => {
      state.tabBarHeight = action.payload;
    },
  },
});

export const { setTabBarHeight } = layoutSlice.actions;
export default layoutSlice.reducer;
