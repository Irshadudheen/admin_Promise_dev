// Division-related TypeScript type definitions

export interface Division {
    id: string;
    gradeName: string;
    schoolId?: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDivisionData {
    gradeName: string;
    schoolId?: string;
}

export interface UpdateDivisionData {
    gradeName?: string;
    schoolId?: string;
}

export interface DivisionResponse {
    success: boolean;
    message: string;
    data: Division;
}

export interface DivisionsListResponse {
    success: boolean;
    message: string;
    data: Division[];
}

export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}
