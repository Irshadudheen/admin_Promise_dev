import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Teacher, CreateTeacherByAdminData, UpdateTeacherData } from '@/types/teacher';
import { TeacherService } from '@/service/teacherService';

interface TeacherState {
    teachers: Teacher[];
    selectedTeacher: Teacher | null;
    isLoading: boolean;
    error: string | null;
}

interface TeacherActions {
    fetchTeachers: (schoolId?: string) => Promise<void>;
    fetchTeacherById: (teacherId: string) => Promise<void>;
    createTeacher: (data: CreateTeacherByAdminData) => Promise<boolean>;
    updateTeacher: (teacherId: string, data: UpdateTeacherData) => Promise<boolean>;
    deleteTeacher: (teacherId: string) => Promise<boolean>;
    setSelectedTeacher: (teacher: Teacher | null) => void;
    clearError: () => void;
}

type TeacherStore = TeacherState & TeacherActions;

const initialState: TeacherState = {
    teachers: [],
    selectedTeacher: null,
    isLoading: false,
    error: null,
};

const useTeacherStore = create<TeacherStore>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchTeachers: async (schoolId?: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await TeacherService.getAllTeachers(schoolId);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch teachers', isLoading: false });
                    return;
                }

                set({
                    teachers: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            fetchTeacherById: async (teacherId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await TeacherService.getTeacherById(teacherId);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch teacher', isLoading: false });
                    return;
                }

                set({
                    selectedTeacher: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            createTeacher: async (teacherData: CreateTeacherByAdminData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await TeacherService.createTeacherByAdmin(teacherData);

                if (error || !data) {
                    set({ error: error || 'Failed to create teacher', isLoading: false });
                    return false;
                }

                // Refresh teachers list after creation
                const { data: teachersData } = await TeacherService.getAllTeachers();
                if (teachersData) {
                    set({ teachers: teachersData.data });
                }

                set({ isLoading: false, error: null });
                return true;
            },

            updateTeacher: async (teacherId: string, teacherData: UpdateTeacherData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await TeacherService.updateTeacher(teacherId, teacherData);

                if (error || !data) {
                    set({ error: error || 'Failed to update teacher', isLoading: false });
                    return false;
                }

                // Update the teacher in the list
                set((state) => ({
                    teachers: state.teachers.map((teacher) =>
                        teacher.id === teacherId ? data.data : teacher
                    ),
                    selectedTeacher: state.selectedTeacher?.id === teacherId ? data.data : state.selectedTeacher,
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            deleteTeacher: async (teacherId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await TeacherService.deleteTeacher(teacherId);

                if (error || !data) {
                    set({ error: error || 'Failed to delete teacher', isLoading: false });
                    return false;
                }

                // Update the teacher in the list (mark as deleted)
                set((state) => ({
                    teachers: state.teachers.map((teacher) =>
                        teacher.id === teacherId ? data.data : teacher
                    ),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            setSelectedTeacher: (teacher: Teacher | null) => {
                set({ selectedTeacher: teacher });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        { name: 'teacher-store', enabled: true }
    )
);

export default useTeacherStore;
