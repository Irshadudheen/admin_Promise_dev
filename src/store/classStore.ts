import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Class, CreateClassData, UpdateClassData } from '@/types/class';
import { ClassService } from '@/service/classService';

interface ClassState {
    classes: Class[];
    selectedClass: Class | null;
    isLoading: boolean;
    error: string | null;
}

interface ClassActions {
    fetchClasses: (schoolId?: string, includeDeleted?: boolean) => Promise<void>;
    fetchClassById: (classId: string) => Promise<void>;
    createClass: (data: CreateClassData) => Promise<boolean>;
    updateClass: (classId: string, data: UpdateClassData) => Promise<boolean>;
    deleteClass: (classId: string) => Promise<boolean>;
    setSelectedClass: (classItem: Class | null) => void;
    clearError: () => void;
}

type ClassStore = ClassState & ClassActions;

const initialState: ClassState = {
    classes: [],
    selectedClass: null,
    isLoading: false,
    error: null,
};

const useClassStore = create<ClassStore>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchClasses: async (schoolId, includeDeleted = false) => {
                set({ isLoading: true, error: null });

                const { data, error } = await ClassService.getAllClasses(schoolId, includeDeleted);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch classes', isLoading: false });
                    return;
                }

                set({
                    classes: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            fetchClassById: async (classId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await ClassService.getClassById(classId);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch class', isLoading: false });
                    return;
                }

                set({
                    selectedClass: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            createClass: async (classData: CreateClassData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await ClassService.createClass(classData);

                if (error || !data) {
                    set({ error: error || 'Failed to create class', isLoading: false });
                    return false;
                }

                // Refresh classes list after creation
                const { data: classesData } = await ClassService.getAllClasses();
                if (classesData) {
                    set({ classes: classesData.data });
                }

                set({ isLoading: false, error: null });
                return true;
            },

            updateClass: async (classId: string, classData: UpdateClassData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await ClassService.updateClass(classId, classData);

                if (error || !data) {
                    set({ error: error || 'Failed to update class', isLoading: false });
                    return false;
                }

                // Update the class in the list
                set((state) => ({
                    classes: state.classes.map((classItem) =>
                        classItem.id === classId ? data.data : classItem
                    ),
                    selectedClass: state.selectedClass?.id === classId ? data.data : state.selectedClass,
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            deleteClass: async (classId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await ClassService.deleteClass(classId);

                if (error || !data) {
                    set({ error: error || 'Failed to delete class', isLoading: false });
                    return false;
                }

                // Update the class in the list (mark as deleted)
                set((state) => ({
                    classes: state.classes.map((classItem) =>
                        classItem.id === classId ? data.data : classItem
                    ),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            setSelectedClass: (classItem: Class | null) => {
                set({ selectedClass: classItem });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        { name: 'class-store', enabled: true }
    )
);

export default useClassStore;

