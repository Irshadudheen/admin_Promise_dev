import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Division, CreateDivisionData, UpdateDivisionData } from '@/types/division';
import { DivisionService } from '@/service/divisionService';

interface DivisionState {
    divisions: Division[];
    selectedDivision: Division | null;
    isLoading: boolean;
    error: string | null;
}

interface DivisionActions {
    fetchDivisions: (schoolId?: string) => Promise<void>;
    fetchDivisionById: (gradeId: string) => Promise<void>;
    createDivision: (data: CreateDivisionData) => Promise<boolean>;
    updateDivision: (gradeId: string, data: UpdateDivisionData) => Promise<boolean>;
    deleteDivision: (gradeId: string) => Promise<boolean>;
    setSelectedDivision: (division: Division | null) => void;
    clearError: () => void;
}

type DivisionStore = DivisionState & DivisionActions;

const initialState: DivisionState = {
    divisions: [],
    selectedDivision: null,
    isLoading: false,
    error: null,
};

const useDivisionStore = create<DivisionStore>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchDivisions: async (schoolId?: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await DivisionService.getAllDivisions(schoolId);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch divisions', isLoading: false });
                    return;
                }

                set({
                    divisions: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            fetchDivisionById: async (gradeId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await DivisionService.getDivisionById(gradeId);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch division', isLoading: false });
                    return;
                }

                set({
                    selectedDivision: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            createDivision: async (divisionData: CreateDivisionData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await DivisionService.createDivision(divisionData);

                if (error || !data) {
                    set({ error: error || 'Failed to create division', isLoading: false });
                    return false;
                }

                // Refresh divisions list after creation
                const { data: divisionsData } = await DivisionService.getAllDivisions();
                if (divisionsData) {
                    set({ divisions: divisionsData.data });
                }

                set({ isLoading: false, error: null });
                return true;
            },

            updateDivision: async (gradeId: string, divisionData: UpdateDivisionData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await DivisionService.updateDivision(gradeId, divisionData);

                if (error || !data) {
                    set({ error: error || 'Failed to update division', isLoading: false });
                    return false;
                }

                // Update the division in the list
                set((state) => ({
                    divisions: state.divisions.map((division) =>
                        division.id === gradeId ? data.data : division
                    ),
                    selectedDivision: state.selectedDivision?.id === gradeId ? data.data : state.selectedDivision,
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            deleteDivision: async (gradeId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await DivisionService.deleteDivision(gradeId);

                if (error || !data) {
                    set({ error: error || 'Failed to delete division', isLoading: false });
                    return false;
                }

                // Update the division in the list (mark as deleted)
                set((state) => ({
                    divisions: state.divisions.map((division) =>
                        division.id === gradeId ? data.data : division
                    ),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            setSelectedDivision: (division: Division | null) => {
                set({ selectedDivision: division });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        { name: 'division-store', enabled: true }
    )
);

export default useDivisionStore;
