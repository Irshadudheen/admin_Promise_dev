// Class-related TypeScript type definitions

export interface Class {
    id: string;
    className: string;
    description?: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateClassData {
    className: string;
    description?: string;

}

export interface UpdateClassData {
    className?: string;
    description?: string;

}

export interface ClassResponse {
    success: boolean;
    message: string;
    data: Class;
}

export interface ClassesListResponse {
    success: boolean;
    message: string;
    data: Class[];
}

export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}
