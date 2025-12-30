// School-related TypeScript type definitions

export interface CountryCode {
    id: string;
    code: string;
    digitCount: number;
    flagImage: string;
    createdAt: string;
    updatedAt: string;
}

export interface School {
    id: string;
    schoolName: string;
    schoolCode: string;
    phone: string;
    address: string;
    countryCodeId: string;
    deletedAt: boolean;
    createdAt: string;
    updatedAt: string;
    countryCode?: CountryCode;
    mappings?: SchoolClassGradeMapping[];
}

export interface SchoolClassGradeMapping {
    id: string;
    schoolId: string;
    classId: string;
    gradeId: string;
    isActive: boolean;
    deletedAt: boolean;
    createdAt: string;
    updatedAt: string;
    class?: {
        id: string;
        className: string;
    };
    grade?: {
        id: string;
        gradeName: string;
    };
}

export interface ClassGradeMappingInput {
    classId: string;
    gradeId: string;
}

export interface CreateSchoolData {
    schoolName: string;
    schoolCode: string;
    phone: string;
    address: string;
    countryCodeId: string;
    mappings?: ClassGradeMappingInput[];
}

export interface UpdateSchoolData {
    schoolName?: string;
    schoolCode?: string;
    phone?: string;
    address?: string;
    countryCodeId?: string;
    mappings?: ClassGradeMappingInput[];
}

export interface SchoolResponse {
    success: boolean;
    message: string;
    data: School;
}

export interface SchoolsListResponse {
    success: boolean;
    message: string;
    data: School[];
}

export interface CountryCodeResponse {
    success: boolean;
    message: string;
    data: CountryCode;
}

export interface CountryCodesListResponse {
    success: boolean;
    message: string;
    data: CountryCode[];
}

export interface CountryCodeResponse {
    success: boolean;
    message: string;
    data: CountryCode;
}

export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}
