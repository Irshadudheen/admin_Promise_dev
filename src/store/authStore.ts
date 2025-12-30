import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AuthStore, AuthState, OtpVerificationBody, ServiceResponse, AuthResponse } from '@/types/auth';
import { AuthService } from '@/service/authservice';



const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message),
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  role: null,
  isLoading: true,
  error: null,
  signUpError: null,
  profileStrength: null,
};

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        login: async ( phone, password) => {
          set({ isLoading: true, error: null });
          const { data, error } = await AuthService.loginService({
            
            phone,
            password,
          
          });

          if (error || !data) {
            set({ error: error || 'Login failed', isLoading: false });
            throw new Error(error || 'Login failed');
          }

          toast.success('Logged in successfully.');
          const { user } = data.data;
          const { accessToken, refreshToken } = data.data;

          console.log('accessToken:', accessToken);
          console.log('User detail:', user);

          set({
            user,
            accessToken,
            refreshToken,
            role: user.userType,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        },

       

       

        register: async (authType, userType, phone, email, password, googleToken) => {
          set({ isLoading: true, signUpError: null });

          const { data, error } = await AuthService.registerService({
            authType,
            userType,
            phone,
            email,
            password,
            googleToken,
          });

          if (error || !data) {
            set({ signUpError: error || 'Registration failed', isLoading: false });
            return false;
          }

          toast.success('OTP shared successfully');
          return true;
        },

        verifyOtp: async (body) => {
          set({ isLoading: true, error: null });

          const { data, error } = await AuthService.otpVerificationService(body);

          if (error || !data) {
            set({ error: error || 'OTP verification failed', isLoading: false });
            toast.error('Invalid OTP');
            return false;
          }

          const { user } = data.data;
          const { accessToken, refreshToken } = data.data;

          console.log('accessToken:', accessToken);
          console.log('User detail:', user);

          set({
            user,
            accessToken,
            refreshToken,
            role: user.userType,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success('Account verified successfully!');
          return true;
        },

        logout: async () => {
          set({ isLoading: true, error: null });

          const { error } = await AuthService.logout();

          if (error) {
            set({ error, isLoading: false });
            return { error, status: false };
          }

          await get().clearState();
          return { error: null, status: true };
        },

        refreshAccessToken: async () => {
          set({ error: null });

          if (!get().isAuthenticated) {
            return null;
          }

          const { refreshToken } = get();

          if (!refreshToken) {
            return null;
          }

          const { data, error } = await AuthService.refreshToken({ refreshToken });

          console.log('AuthStore: Token refreshed:', data, error);

          if (error || !data) {
            console.log('Refresh token error', error);
            set({ error: error || 'Token refresh failed', isLoading: false });
            await get().logout();
            return null;
          }

          const { accessToken: newToken } = data.data;
          set({ accessToken: newToken, isLoading: false });
          return newToken;
        },

        fetchUser: async () => {
          const { data: user, error } = await AuthService.fetchUser();

          if (error || !user) {
            set({ error: error || 'Failed to fetch user', isLoading: false });
            return;
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        },

        setHasHydrated: async (state) => {
          if (state.isAuthenticated) {
            await get().refreshAccessToken();
            await get().refreshUser();
            return;
          }

          console.log('AuthStore: No user found, clearing state...');
          set({
            isLoading: false,
            user: null,
            role: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
        },

        refreshUser: async () => {
          const token = get().refreshToken;

          if (!token) {
            set({
              isLoading: false,
              user: null,
              role: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
              error: 'Failed to refresh token',
            });
            return;
          }

          await get().fetchUser();
        },

        setState: ({ isLoading, isAuthenticated, user, accessToken, profileStrength }) => {
          set({ isLoading, isAuthenticated, user, accessToken, profileStrength });
        },

        setProfileStrength: ({ profileStrength }) => {
          set({ profileStrength });
        },

        updateProfilePicture: (profilePicture) => {
          set((state) => ({
            user: state.user ? { ...state.user, profilePicture } : state.user,
          }));
        },

        clearState: async () => {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            role: null,
            error: null,
            signUpError: null,
            profileStrength: null,
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          role: state.role,
          user: state.user,
          profileStrength: state.profileStrength,
        }),
        onRehydrateStorage: () => {
          return (state, error) => {
            if (error) {
              console.error('AuthStore: Failed to rehydrate state:', error);
              state?.clearState();
              return;
            }
            if (state) {
              state.setHasHydrated(state);
            }
          };
        },
      }
    ),
    { name: 'auth-store', enabled: true }
  )
);

export default useAuthStore;
