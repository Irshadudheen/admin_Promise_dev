import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    School,
    SchoolResponse,
    SchoolsListResponse,
    CreateSchoolData,
    UpdateSchoolData,
    CountryCode,
    CountryCodesListResponse,
    CountryCodeResponse,
} from "@/types/school";

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

export const SchoolService = {
    /**
     * Get all schools
     */
    getAllSchools: async (): Promise<ServiceResponse<SchoolsListResponse>> => {
        try {
            const response: AxiosResponse<SchoolsListResponse> = await axiosInstance.get(
                "/schools"
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get schools error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch schools. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Get school by ID
     * @param schoolId - School ID
     */
    getSchoolById: async (
        schoolId: string
    ): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.get(
                `/schools/${schoolId}`
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get school error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch school. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Create a new school
     * @param data - School data with mappings
     */
    createSchool: async (
        data: CreateSchoolData
    ): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.post(
                "/schools",
                data
            );
            toast.success("School created successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Create school error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to create school. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Update a school
     * @param schoolId - School ID
     * @param data - Updated school data
     */
    updateSchool: async (
        schoolId: string,
        data: UpdateSchoolData
    ): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.put(
                `/schools/${schoolId}`,
                data
            );
            toast.success("School updated successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Update school error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to update school. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Soft delete a school
     * @param schoolId - School ID
     */
    deleteSchool: async (
        schoolId: string
    ): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.delete(
                `/schools/${schoolId}`
            );
            toast.success("School deleted successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Delete school error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to delete school. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },
};

export const CountryCodeService = {
    /**
     * Get all country codes
     */
    getAllCountryCodes: async (): Promise<ServiceResponse<CountryCodesListResponse>> => {
        try {
            const response: AxiosResponse<CountryCodesListResponse> = await axiosInstance.get(
                "/country-codes"
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get country codes error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch country codes. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Get country code by ID
     * @param id - Country code ID
     */
    getCountryCodeById: async (
        id: string
    ): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.get(
                `/country-codes/${id}`
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get country code error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch country code. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Create a new country code
     * @param data - Country code data
     */
    createCountryCode: async (
        data: { code: string; digitCount: number; flagImage: string }
    ): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.post(
                "/country-codes",
                data
            );
            toast.success("Country code created successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Create country code error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to create country code. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Update a country code
     * @param id - Country code ID
     * @param data - Updated country code data
     */
    updateCountryCode: async (
        id: string,
        data: { code?: string; digitCount?: number; flagImage?: string }
    ): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.put(
                `/country-codes/${id}`,
                data
            );
            toast.success("Country code updated successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Update country code error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to update country code. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Delete a country code
     * @param id - Country code ID
     */
    deleteCountryCode: async (
        id: string
    ): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.delete(
                `/country-codes/${id}`
            );
            toast.success("Country code deleted successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Delete country code error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to delete country code. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },
};
