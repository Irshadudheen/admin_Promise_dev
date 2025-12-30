import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authslice';

// NOTE: You have chosen to use Zustand (authStore.ts)
// This Redux store is kept for reference but not actively used
// If you want to use Redux instead, you need to:
// 1. Install react-redux: npm install react-redux
// 2. Wrap your app with <Provider store={store}>
// 3. Use the hooks from hooks.ts

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// For Zustand usage, import from authStore.ts instead:
// import useAuthStore from './authStore';
