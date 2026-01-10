import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthLoading: boolean;
}
const initialState: AuthState = {
  user: null,
  session: null,
  isAuthLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
    },
    setIsAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isAuthLoading = action.payload;
    },
    logout: state => {
      state.session = null;
      state.user = null;
    },
  },
});

export const { setSession, setIsAuthLoading, logout } = authSlice.actions;
export default authSlice.reducer;
