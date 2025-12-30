import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CountryCode } from '@/types/school';
import { CountryCodeService } from '@/service/schoolService';

interface CountryCodeFormData {
    code: string;
    digitCount: number;
    flagImage: string;
}

interface CountryCodeState {
    countryCodes: CountryCode[];
    selectedCountryCode: CountryCode | null;
    isLoading: boolean;
    error: string | null;
}

interface CountryCodeActions {
    fetchCountryCodes: () => Promise<void>;
    createCountryCode: (data: CountryCodeFormData) => Promise<boolean>;
    updateCountryCode: (id: string, data: CountryCodeFormData) => Promise<boolean>;
    deleteCountryCode: (id: string) => Promise<boolean>;
    setSelectedCountryCode: (countryCode: CountryCode | null) => void;
    clearError: () => void;
}

type CountryCodeStore = CountryCodeState & CountryCodeActions;

const initialState: CountryCodeState = {
    countryCodes: [],
    selectedCountryCode: null,
    isLoading: false,
    error: null,
};

const useCountryCodeStore = create<CountryCodeStore>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchCountryCodes: async () => {
                set({ isLoading: true, error: null });

                const { data, error } = await CountryCodeService.getAllCountryCodes();

                if (error || !data) {
                    set({ error: error || 'Failed to fetch country codes', isLoading: false });
                    return;
                }

                set({
                    countryCodes: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            createCountryCode: async (countryCodeData: CountryCodeFormData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await CountryCodeService.createCountryCode(countryCodeData);

                if (error || !data) {
                    set({ error: error || 'Failed to create country code', isLoading: false });
                    return false;
                }

                // Refresh country codes list after creation
                const { data: codesData } = await CountryCodeService.getAllCountryCodes();
                if (codesData) {
                    set({ countryCodes: codesData.data });
                }

                set({ isLoading: false, error: null });
                return true;
            },

            updateCountryCode: async (id: string, countryCodeData: CountryCodeFormData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await CountryCodeService.updateCountryCode(id, countryCodeData);

                if (error || !data) {
                    set({ error: error || 'Failed to update country code', isLoading: false });
                    return false;
                }

                // Update the country code in the list
                set((state) => ({
                    countryCodes: state.countryCodes.map((cc) =>
                        cc.id === id ? data.data : cc
                    ),
                    selectedCountryCode: state.selectedCountryCode?.id === id ? data.data : state.selectedCountryCode,
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            deleteCountryCode: async (id: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await CountryCodeService.deleteCountryCode(id);

                if (error || !data) {
                    set({ error: error || 'Failed to delete country code', isLoading: false });
                    return false;
                }

                // Remove from list
                set((state) => ({
                    countryCodes: state.countryCodes.filter((cc) => cc.id !== id),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            setSelectedCountryCode: (countryCode: CountryCode | null) => {
                set({ selectedCountryCode: countryCode });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        { name: 'country-code-store', enabled: true }
    )
);

export default useCountryCodeStore;
