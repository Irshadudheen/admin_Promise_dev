import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    Class,
    ClassResponse,
    ClassesListResponse,
    CreateClassData,
    UpdateClassData,
} from "@/types/class";

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

export const ClassService = {
    /**
     * Get all classes
     * @param schoolId - Optional school ID to filter classes by school
     * @param includeDeleted - Optional boolean to include soft-deleted classes
     */
    getAllClasses: async (
        schoolId?: string,
        includeDeleted?: boolean
    ): Promise<ServiceResponse<ClassesListResponse>> => {
        try {
            const params: Record<string, any> = {};
            if (schoolId) params.schoolId = schoolId;
            if (includeDeleted) params.includeDeleted = includeDeleted;

            const response: AxiosResponse<ClassesListResponse> = await axiosInstance.get(
                '/classes',
                { params }
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get classes error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch classes. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Get a single class by ID
     * @param classId - The ID of the class to fetch
     */
    getClassById: async (classId: string): Promise<ServiceResponse<ClassResponse>> => {
        try {
            const response: AxiosResponse<ClassResponse> = await axiosInstance.get(
                `/classes/${classId}`
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get class error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch class. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Create a new class
     * @param classData - The class data to create
     */
    createClass: async (classData: CreateClassData): Promise<ServiceResponse<ClassResponse>> => {
        try {
            const response: AxiosResponse<ClassResponse> = await axiosInstance.post(
                '/classes',
                classData
            );

            toast.success('Class created successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Create class error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create class. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Update an existing class
     * @param classId - The ID of the class to update
     * @param classData - The updated class data
     */
    updateClass: async (
        classId: string,
        classData: UpdateClassData
    ): Promise<ServiceResponse<ClassResponse>> => {
        try {
            const response: AxiosResponse<ClassResponse> = await axiosInstance.put(
                `/classes/${classId}`,
                classData
            );

            toast.success('Class updated successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Update class error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update class. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Delete (soft delete) a class
     * @param classId - The ID of the class to delete
     */
    deleteClass: async (classId: string): Promise<ServiceResponse<ClassResponse>> => {
        try {
            const response: AxiosResponse<ClassResponse> = await axiosInstance.delete(
                `/classes/${classId}`
            );

            toast.success('Class deleted successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Delete class error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete class. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};
