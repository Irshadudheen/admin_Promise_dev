// Class-related TypeScript type definitions

export interface Class {
    classId: string;
    className: string;
    gradeLevel: string;
    description?: string;
    schoolId?: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateClassData {
    className: string;
    gradeLevel: string;
    description?: string;
    schoolId?: string;
}

export interface UpdateClassData {
    className?: string;
    gradeLevel?: string;
    description?: string;
    schoolId?: string;
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
