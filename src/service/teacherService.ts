import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    TeacherResponse,
    TeachersListResponse,
    CreateTeacherByAdminData,
    UpdateTeacherData,
} from "@/types/teacher";

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

export const TeacherService = {
    /**
     * Get all teachers (optionally filtered by schoolId)
     * @param schoolId - Optional school ID to filter teachers
     */
    getAllTeachers: async (schoolId?: string): Promise<ServiceResponse<TeachersListResponse>> => {
        try {
            const params: Record<string, any> = {};
            if (schoolId) params.schoolId = schoolId;

            const response: AxiosResponse<TeachersListResponse> = await axiosInstance.get(
                '/teachers',
                { params }
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get teachers error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch teachers. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Get a single teacher by ID
     * @param teacherId - The ID of the teacher to fetch
     */
    getTeacherById: async (teacherId: string): Promise<ServiceResponse<TeacherResponse>> => {
        try {
            const response: AxiosResponse<TeacherResponse> = await axiosInstance.get(
                `/teachers/${teacherId}`
            );

            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Get teacher error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to fetch teacher. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Create a new teacher by admin with auth and mappings
     * @param teacherData - The teacher data to create
     */
    createTeacherByAdmin: async (teacherData: CreateTeacherByAdminData): Promise<ServiceResponse<TeacherResponse>> => {
        try {
            const response: AxiosResponse<TeacherResponse> = await axiosInstance.post(
                '/teachers/admin/create',
                teacherData
            );

            toast.success('Teacher created successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Create teacher error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to create teacher. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Update an existing teacher
     * @param teacherId - The ID of the teacher to update
     * @param teacherData - The updated teacher data
     */
    updateTeacher: async (
        teacherId: string,
        teacherData: UpdateTeacherData
    ): Promise<ServiceResponse<TeacherResponse>> => {
        try {
            const response: AxiosResponse<TeacherResponse> = await axiosInstance.put(
                `/teachers/${teacherId}`,
                teacherData
            );

            toast.success('Teacher updated successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Update teacher error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to update teacher. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },

    /**
     * Delete (soft delete) a teacher
     * @param teacherId - The ID of the teacher to delete
     */
    deleteTeacher: async (teacherId: string): Promise<ServiceResponse<TeacherResponse>> => {
        try {
            const response: AxiosResponse<TeacherResponse> = await axiosInstance.delete(
                `/teachers/${teacherId}`
            );

            toast.success('Teacher deleted successfully');
            return {
                data: response.data,
                error: null,
            };
        } catch (error) {
            console.error('Delete teacher error:', error);
            const errorMessage = getErrorMessage(
                error,
                'Failed to delete teacher. Please try again.'
            );
            toast.error(errorMessage);
            return {
                data: null,
                error: errorMessage,
            };
        }
    },
};
