// Zustand doesn't need custom hooks like Redux
// You can directly use the store in your components

// Example usage:
// import useAuthStore from './authStore';
// 
// function MyComponent() {
//   const user = useAuthStore((state) => state.user);
//   const login = useAuthStore((state) => state.login);
//   return <div>...</div>;
// }

// If you want to use Redux instead, install react-redux:
// npm install react-redux
// Then uncomment the code below:

/*
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
*/

export { };
