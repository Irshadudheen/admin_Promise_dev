import { axiosInstance } from "../config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    OtpVerificationBody,
    User,
} from "@/types/auth";

// Type for API error response
interface ApiErrorResponse {
    message?: string;
    errors?: Array<{ message: string }>;
    error?: string;
}

// Type guard to check if error is AxiosError
const isAxiosError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
    return (error as AxiosError).isAxiosError === true;
};

// Helper function to extract error message
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (isAxiosError(error) && error.response?.data) {
        const data = error.response.data;
        return (
            data.message ||
            data.errors?.[0]?.message ||
            data.error ||
            defaultMessage
        );
    }
    if (error instanceof Error) {
        return error.message;
    }
    return defaultMessage;
};

export const AuthService = {
    loginService: async (
        data: LoginCredentials
    ): Promise<ServiceResponse<AuthResponse>> => {
        try {
            const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
                "/admin/login",
                data,
                { withCredentials: true }
            );
            console.log(response, "the response");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Login error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Login failed. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    registerService: async (
        data: RegisterCredentials
    ): Promise<ServiceResponse<AuthResponse>> => {
        try {
            const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
                "/admin/register",
                data,
                { withCredentials: true }
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Registration failed. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    otpVerificationService: async (
        data: OtpVerificationBody
    ): Promise<ServiceResponse<AuthResponse>> => {
        try {
            const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
                "/auth/verify-otp",
                data
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("OTP verification error:", error);
            const errorMessage = getErrorMessage(
                error,
                "OTP validation failed. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    forgetPasswordService: async (data: {
        phone?: string;
        email?: string;
    }): Promise<ServiceResponse<{ message: string }>> => {
        try {
            const response: AxiosResponse<{ message: string }> =
                await axiosInstance.post("/auth/forgot-password", data);
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Forgot password error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Forgot password service failed. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    fetchUser: async (): Promise<ServiceResponse<User>> => {
        try {
            const response: AxiosResponse<User> = await axiosInstance.get(
                "/auth/me"
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Fetch user error:", error);
            const errorMessage = getErrorMessage(error, "Failed to fetch user data.");
            return { data: null, error: errorMessage };
        }
    },

    logout: async (): Promise<ServiceResponse<null>> => {
        console.log("Logout called");
        try {
            await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
            return { data: null, error: null };
        } catch (error) {
            console.error("Logout error:", error);
            const errorMessage = getErrorMessage(error, "Logout failed.");
            return { data: null, error: errorMessage };
        }
    },

    refreshToken: async (data: {
        refreshToken: string;
    }): Promise<ServiceResponse<{ data: { accessToken: string } }>> => {
        try {
            const response: AxiosResponse<{ data: { accessToken: string } }> =
                await axiosInstance.post("/auth/refresh-token", data, {
                    withCredentials: true,
                });
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Refresh token error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to refresh token."
            );
            return { data: null, error: errorMessage };
        }
    },

    resetPasswordService: async (data: {
        password: string;
        confirmPassword: string;
        token?: string;
    }): Promise<ServiceResponse<{ message: string }>> => {
        try {
            console.log("ResetPasswordService data:", data);
            const response: AxiosResponse<{ message: string }> =
                await axiosInstance.post("/auth/reset-password", data);
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Reset password error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Reset password failed. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },
};

