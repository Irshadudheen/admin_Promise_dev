import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { School, CreateSchoolData, UpdateSchoolData, CountryCode } from '@/types/school';
import { SchoolService, CountryCodeService } from '@/service/schoolService';

interface SchoolState {
    schools: School[];
    selectedSchool: School | null;
    countryCodes: CountryCode[];
    isLoading: boolean;
    error: string | null;
}

interface SchoolActions {
    fetchSchools: () => Promise<void>;
    fetchSchoolById: (schoolId: string) => Promise<void>;
    fetchCountryCodes: () => Promise<void>;
    createSchool: (data: CreateSchoolData) => Promise<boolean>;
    updateSchool: (schoolId: string, data: UpdateSchoolData) => Promise<boolean>;
    deleteSchool: (schoolId: string) => Promise<boolean>;
    setSelectedSchool: (school: School | null) => void;
    clearError: () => void;
}

type SchoolStore = SchoolState & SchoolActions;

const initialState: SchoolState = {
    schools: [],
    selectedSchool: null,
    countryCodes: [],
    isLoading: false,
    error: null,
};

const useSchoolStore = create<SchoolStore>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchSchools: async () => {
                set({ isLoading: true, error: null });

                const { data, error } = await SchoolService.getAllSchools();

                if (error || !data) {
                    set({ error: error || 'Failed to fetch schools', isLoading: false });
                    return;
                }

                set({
                    schools: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            fetchSchoolById: async (schoolId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await SchoolService.getSchoolById(schoolId);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch school', isLoading: false });
                    return;
                }

                set({
                    selectedSchool: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            fetchCountryCodes: async () => {
                const { data, error } = await CountryCodeService.getAllCountryCodes();

                if (error || !data) {
                    console.error('Failed to fetch country codes:', error);
                    return;
                }

                set({
                    countryCodes: data.data,
                });
            },

            createSchool: async (schoolData: CreateSchoolData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await SchoolService.createSchool(schoolData);

                if (error || !data) {
                    set({ error: error || 'Failed to create school', isLoading: false });
                    return false;
                }

                // Refresh schools list after creation
                const { data: schoolsData } = await SchoolService.getAllSchools();
                if (schoolsData) {
                    set({ schools: schoolsData.data });
                }

                set({ isLoading: false, error: null });
                return true;
            },

            updateSchool: async (schoolId: string, schoolData: UpdateSchoolData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await SchoolService.updateSchool(schoolId, schoolData);

                if (error || !data) {
                    set({ error: error || 'Failed to update school', isLoading: false });
                    return false;
                }

                // Update the school in the list
                set((state) => ({
                    schools: state.schools.map((school) =>
                        school.id === schoolId ? data.data : school
                    ),
                    selectedSchool: state.selectedSchool?.id === schoolId ? data.data : state.selectedSchool,
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            deleteSchool: async (schoolId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await SchoolService.deleteSchool(schoolId);

                if (error || !data) {
                    set({ error: error || 'Failed to delete school', isLoading: false });
                    return false;
                }

                // Update the school in the list (mark as deleted)
                set((state) => ({
                    schools: state.schools.map((school) =>
                        school.id === schoolId ? data.data : school
                    ),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            setSelectedSchool: (school: School | null) => {
                set({ selectedSchool: school });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        { name: 'school-store', enabled: true }
    )
);

export default useSchoolStore;
