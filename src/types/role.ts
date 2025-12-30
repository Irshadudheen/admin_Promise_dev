// Role-related TypeScript type definitions

export interface Role {
    roleId: string;
    roleName: string;
    description: string;
    isOtpAllowed: boolean;
    image: string;
    isAdministrative: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateRoleData {
    roleName: string;
    description?: string;
    isOtpAllowed?: boolean;
    image?: string;
    isAdministrative?: boolean;
}

export interface UpdateRoleData {
    roleName?: string;
    description?: string;
    isOtpAllowed?: boolean;
    image?: string;
    isAdministrative?: boolean;
}

export interface RoleResponse {
    success: boolean;
    message: string;
    data: Role;
}

export interface RolesListResponse {
    success: boolean;
    message: string;
    data: Role[];
}

export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}
