import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Role, CreateRoleData, UpdateRoleData } from '@/types/role';
import { RoleService } from '@/service/roleService';

interface RoleState {
    roles: Role[];
    selectedRole: Role | null;
    isLoading: boolean;
    error: string | null;
}

interface RoleActions {
    fetchRoles: (includeDeleted?: boolean) => Promise<void>;
    fetchRoleById: (roleId: string, includeDeleted?: boolean) => Promise<void>;
    createRole: (data: CreateRoleData) => Promise<boolean>;
    updateRole: (roleId: string, data: UpdateRoleData) => Promise<boolean>;
    deleteRole: (roleId: string) => Promise<boolean>;
    restoreRole: (roleId: string) => Promise<boolean>;
    setSelectedRole: (role: Role | null) => void;
    clearError: () => void;
}

type RoleStore = RoleState & RoleActions;

const initialState: RoleState = {
    roles: [],
    selectedRole: null,
    isLoading: false,
    error: null,
};

const useRoleStore = create<RoleStore>()(
    devtools(
        (set) => ({
            ...initialState,

            fetchRoles: async (includeDeleted = false) => {
                set({ isLoading: true, error: null });

                const { data, error } = await RoleService.getAllRoles(includeDeleted);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch roles', isLoading: false });
                    return;
                }

                set({
                    roles: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            fetchRoleById: async (roleId: string, includeDeleted = false) => {
                set({ isLoading: true, error: null });

                const { data, error } = await RoleService.getRoleById(roleId, includeDeleted);

                if (error || !data) {
                    set({ error: error || 'Failed to fetch role', isLoading: false });
                    return;
                }

                set({
                    selectedRole: data.data,
                    isLoading: false,
                    error: null,
                });
            },

            createRole: async (roleData: CreateRoleData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await RoleService.createRole(roleData);

                if (error || !data) {
                    set({ error: error || 'Failed to create role', isLoading: false });
                    return false;
                }

                // Refresh roles list after creation
                const { data: rolesData } = await RoleService.getAllRoles();
                if (rolesData) {
                    set({ roles: rolesData.data });
                }

                set({ isLoading: false, error: null });
                return true;
            },

            updateRole: async (roleId: string, roleData: UpdateRoleData) => {
                set({ isLoading: true, error: null });

                const { data, error } = await RoleService.updateRole(roleId, roleData);

                if (error || !data) {
                    set({ error: error || 'Failed to update role', isLoading: false });
                    return false;
                }

                // Update the role in the list
                set((state) => ({
                    roles: state.roles.map((role) =>
                        role.roleId === roleId ? data.data : role
                    ),
                    selectedRole: state.selectedRole?.roleId === roleId ? data.data : state.selectedRole,
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            deleteRole: async (roleId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await RoleService.deleteRole(roleId);

                if (error || !data) {
                    set({ error: error || 'Failed to delete role', isLoading: false });
                    return false;
                }

                // Update the role in the list (mark as deleted)
                set((state) => ({
                    roles: state.roles.map((role) =>
                        role.roleId === roleId ? data.data : role
                    ),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            restoreRole: async (roleId: string) => {
                set({ isLoading: true, error: null });

                const { data, error } = await RoleService.restoreRole(roleId);

                if (error || !data) {
                    set({ error: error || 'Failed to restore role', isLoading: false });
                    return false;
                }

                // Update the role in the list (mark as restored)
                set((state) => ({
                    roles: state.roles.map((role) =>
                        role.roleId === roleId ? data.data : role
                    ),
                    isLoading: false,
                    error: null,
                }));

                return true;
            },

            setSelectedRole: (role: Role | null) => {
                set({ selectedRole: role });
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        { name: 'role-store', enabled: true }
    )
);

export default useRoleStore;
