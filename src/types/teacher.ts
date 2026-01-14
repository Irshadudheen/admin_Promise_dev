// Teacher-related TypeScript type definitions

export interface Teacher {
    id: string;
    teacherName: string;
    teacherCode: string;
    phone: string;
    countryCodeId: string;
    schoolId: string;
    isActive: boolean;
    deletedAt: boolean;
    createdAt: string;
    updatedAt: string;
    countryCode?: {
        id: string;
        code: string;
    };
    school?: {
        id: string;
        schoolName: string;
        schoolCode: string;
    };
    schools?: TeacherSchoolMapping[];
    roles?: {
        role: {
            id: string;
            roleName: string;
        };
    }[];
}

export interface TeacherSchoolMapping {
    id: string;
    teacherId: string;
    schoolId: string;
    classId: string;
    gradeId: string;
    isActive: boolean;
    deletedAt: boolean;
    createdAt: string;
    updatedAt: string;
    school?: {
        id: string;
        schoolName: string;
        schoolCode: string;
    };
}

export interface CreateTeacherByAdminData {
    teacherName: string;
    teacherCode: string;
    phone: string;
    countryCodeId: string;
    schoolId: string;
    classId: string;
    gradeId: string;
    roleId: string;
}

export interface UpdateTeacherData {
    teacherName?: string;
    phone?: string;
    countryCodeId?: string;
}

export interface TeacherResponse {
    success: boolean;
    message: string;
    data: Teacher;
}

export interface TeachersListResponse {
    success: boolean;
    message: string;
    data: Teacher[];
}

export interface ServiceResponse<T> {
    data: T | null;
    error: string | null;
}
