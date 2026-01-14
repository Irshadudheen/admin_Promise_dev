import { axiosInstance } from "@/config/axios";
import { toast } from "sonner";
import type { AxiosError, AxiosResponse } from "axios";
import type {
    ServiceResponse,
    RoleResponse,
    RolesListResponse,
    CreateRoleData,
    UpdateRoleData,
} from "@/types/role";

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

export const RoleService = {
    /**
     * Get all roles
     * @param includeDeleted - Optional boolean to include soft-deleted roles
     */
    getAllRoles: async (
        includeDeleted?: boolean
    ): Promise<ServiceResponse<RolesListResponse>> => {
        try {
            const params = includeDeleted ? { includeDeleted: true } : {};
            const response: AxiosResponse<RolesListResponse> = await axiosInstance.get(
                "/roles",
                { params }
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get roles error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch roles. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Get role by ID
     * @param roleId - Role ID
     * @param includeDeleted - Optional boolean to include soft-deleted role
     */
    getRoleById: async (
        roleId: string,
        includeDeleted?: boolean
    ): Promise<ServiceResponse<RoleResponse>> => {
        try {
            const params = includeDeleted ? { includeDeleted: true } : {};
            const response: AxiosResponse<RoleResponse> = await axiosInstance.get(
                `/roles/${roleId}`,
                { params }
            );
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Get role error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to fetch role. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Create a new role
     * @param data - Role data
     */
    createRole: async (
        data: CreateRoleData
    ): Promise<ServiceResponse<RoleResponse>> => {
        try {
            const response: AxiosResponse<RoleResponse> = await axiosInstance.post(
                "/roles",
                data
            );
            toast.success("Role created successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Create role error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to create role. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Update a role
     * @param roleId - Role ID
     * @param data - Updated role data
     */
    updateRole: async (
        roleId: string,
        data: UpdateRoleData
    ): Promise<ServiceResponse<RoleResponse>> => {
        try {
            const response: AxiosResponse<RoleResponse> = await axiosInstance.put(
                `/roles/${roleId}`,
                data
            );
            toast.success("Role updated successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Update role error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to update role. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Soft delete a role
     * @param roleId - Role ID
     */
    deleteRole: async (
        roleId: string
    ): Promise<ServiceResponse<RoleResponse>> => {
        try {
            const response: AxiosResponse<RoleResponse> = await axiosInstance.delete(
                `/roles/${roleId}`
            );
            toast.success("Role deleted successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Delete role error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to delete role. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },

    /**
     * Restore a soft-deleted role
     * @param roleId - Role ID
     */
    restoreRole: async (
        roleId: string
    ): Promise<ServiceResponse<RoleResponse>> => {
        try {
            const response: AxiosResponse<RoleResponse> = await axiosInstance.patch(
                `/roles/${roleId}/restore`
            );
            toast.success("Role restored successfully");
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Restore role error:", error);
            const errorMessage = getErrorMessage(
                error,
                "Failed to restore role. Please try again."
            );
            toast.error(errorMessage);
            return { data: null, error: errorMessage };
        }
    },
};
