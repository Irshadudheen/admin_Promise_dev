import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    SchoolResponse,
    SchoolsListResponse,
    CreateSchoolData,
    UpdateSchoolData,
    CountryCodeResponse,
    CountryCodesListResponse,
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

// School Service
export const SchoolService = {
    /**
     * Get all schools
     */
    getAllSchools: async (): Promise<ServiceResponse<SchoolsListResponse>> => {
        try {
            const response: AxiosResponse<SchoolsListResponse> = await axiosInstance.get(
                '/schools'
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get schools error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch schools. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Get a single school by ID
     * @param schoolId - The ID of the school to fetch
     */
    getSchoolById: async (schoolId: string): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.get(
                `/schools/${schoolId}`
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get school error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch school. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Create a new school
     * @param schoolData - The school data to create
     */
    createSchool: async (schoolData: CreateSchoolData): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.post(
                '/schools',
                schoolData
            );

            toast.success('School created successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Create school error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create school. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Update an existing school
     * @param schoolId - The ID of the school to update
     * @param schoolData - The updated school data
     */
    updateSchool: async (
        schoolId: string,
        schoolData: UpdateSchoolData
    ): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.put(
                `/schools/${schoolId}`,
                schoolData
            );

            toast.success('School updated successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Update school error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update school. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Delete (soft delete) a school
     * @param schoolId - The ID of the school to delete
     */
    deleteSchool: async (schoolId: string): Promise<ServiceResponse<SchoolResponse>> => {
        try {
            const response: AxiosResponse<SchoolResponse> = await axiosInstance.delete(
                `/schools/${schoolId}`
            );

            toast.success('School deleted successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Delete school error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete school. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};

// Country Code Service
export const CountryCodeService = {
    /**
     * Get all country codes
     */
    getAllCountryCodes: async (): Promise<ServiceResponse<CountryCodesListResponse>> => {
        try {
            const response: AxiosResponse<CountryCodesListResponse> = await axiosInstance.get(
                '/country-codes'
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get country codes error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch country codes. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Create a new country code
     * @param countryCodeData - The country code data to create
     */
    createCountryCode: async (countryCodeData: {
        code: string;
        digitCount: number;
        flagImage: string;
    }): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.post(
                '/country-codes',
                countryCodeData
            );

            toast.success('Country code created successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Create country code error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create country code. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Update an existing country code
     * @param id - The ID of the country code to update
     * @param countryCodeData - The updated country code data
     */
    updateCountryCode: async (
        id: string,
        countryCodeData: {
            code: string;
            digitCount: number;
            flagImage: string;
        }
    ): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.put(
                `/country-codes/${id}`,
                countryCodeData
            );

            toast.success('Country code updated successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Update country code error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update country code. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Delete a country code
     * @param id - The ID of the country code to delete
     */
    deleteCountryCode: async (id: string): Promise<ServiceResponse<CountryCodeResponse>> => {
        try {
            const response: AxiosResponse<CountryCodeResponse> = await axiosInstance.delete(
                `/country-codes/${id}`
            );

            toast.success('Country code deleted successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Delete country code error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete country code. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};
