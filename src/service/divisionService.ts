import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    Division,
    DivisionResponse,
    DivisionsListResponse,
    CreateDivisionData,
    UpdateDivisionData,
} from "@/types/division";

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

export const DivisionService = {
    /**
     * Get all divisions
     * @param schoolId - Optional school ID to filter divisions
     */
    getAllDivisions: async (
        schoolId?: string
    ): Promise<ServiceResponse<DivisionsListResponse>> => {
        try {
            const params = schoolId ? { schoolId } : {};
            const response: AxiosResponse<DivisionsListResponse> = await axiosInstance.get(
                "/grades",
                { params }
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get divisions error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch divisions. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Get division by ID
     * @param gradeId - Division ID
     */
    getDivisionById: async (
        gradeId: string
    ): Promise<ServiceResponse<DivisionResponse>> => {
        try {
            const response: AxiosResponse<DivisionResponse> = await axiosInstance.get(
                `/grades/${gradeId}`
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get division error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch division. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Create a new division
     * @param data - Division data
     */
    createDivision: async (
        data: CreateDivisionData
    ): Promise<ServiceResponse<DivisionResponse>> => {
        try {
            const response: AxiosResponse<DivisionResponse> = await axiosInstance.post(
                "/grades",
                data
            );
            toast.success("Division created successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Create division error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to create division. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Update a division
     * @param gradeId - Division ID
     * @param data - Updated division data
     */
    updateDivision: async (
        gradeId: string,
        data: UpdateDivisionData
    ): Promise<ServiceResponse<DivisionResponse>> => {
        try {
            const response: AxiosResponse<DivisionResponse> = await axiosInstance.put(
                `/grades/${gradeId}`,
                data
            );
            toast.success("Division updated successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Update division error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to update division. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Soft delete a division
     * @param gradeId - Division ID
     */
    deleteDivision: async (
        gradeId: string
    ): Promise<ServiceResponse<DivisionResponse>> => {
        try {
            const response: AxiosResponse<DivisionResponse> = await axiosInstance.delete(
                `/grades/${gradeId}`
            );
            toast.success("Division deleted successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Delete division error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to delete division. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },
};
