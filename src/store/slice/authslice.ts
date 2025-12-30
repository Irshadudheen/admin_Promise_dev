import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { decodeToken, TokenUtils } from '../../utils/tokenUtil';
import type { ReduxAuthState, SetAuthPayload, User } from '@/types/auth';

const initialState: ReduxAuthState = {
  user: decodeToken() as User | null,
  accessToken: TokenUtils.getToken() || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<SetAuthPayload>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      TokenUtils.setToken(action.payload.accessToken);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      TokenUtils.removeToken();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },

    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      TokenUtils.removeToken();
    },
  },
});

export const { setAuth, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;


export type { ReduxAuthState };
