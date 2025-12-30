// Auth-related TypeScript type definitions

export interface User {
    id: string;
    email?: string;
    phone?: string;
    userType: string;
    username?: string;
    role?: string;
    profilePicture?: string;
    // Add other user fields as needed
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    phone?: string;
    password?: string;
    email?: string;
}

export interface RegisterCredentials {
    email: string;
    name: string;
    password: string;
    roleId: string;
}

export interface OtpVerificationBody {
    phone?: string;
    email?: string;
    otp: string;
    userType?: string;
}

export interface AuthResponse {
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}

export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}

// Zustand Auth Store Types
export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    role: string | null;
    isLoading: boolean;
    error: string | null;
    signUpError: string | null;
    profileStrength: number | null;
}

export interface AuthActions {
    login: (
        emailOrPhone: string,
        password: string
    ) => Promise<boolean>;





    register: (
        name: string,
        email: string,
        password: string,
        roleId: string
    ) => Promise<boolean>;

    verifyOtp: (body: OtpVerificationBody) => Promise<boolean>;

    logout: () => Promise<{ error: string | null; status: boolean }>;

    refreshAccessToken: () => Promise<string | null>;

    fetchUser: () => Promise<void>;

    setHasHydrated: (state: AuthState) => Promise<void>;

    refreshUser: () => Promise<void>;

    setState: (state: Partial<AuthState>) => void;

    setProfileStrength: (data: { profileStrength: number }) => void;

    updateProfilePicture: (profilePicture: string) => void;

    clearState: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// Redux Auth Slice Types (if using Redux)
export interface ReduxAuthState {
    user: User | null;
    accessToken: string | null;
}

export interface SetAuthPayload {
    user: User;
    accessToken: string;
}
