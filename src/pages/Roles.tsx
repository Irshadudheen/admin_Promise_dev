import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { Loader } from '@/components/ui/Loader'
import useRoleStore from '@/store/roleStore'
import type { Role } from '@/types/role'

export default function Roles() {
    const { roles, isLoading, fetchRoles, createRole, updateRole, deleteRole, restoreRole } = useRoleStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [formData, setFormData] = useState({ name: '', description: '' })
    const [showDeleted, setShowDeleted] = useState(false)
    const { showToast } = useToast()

    // Fetch roles on component mount
    useEffect(() => {
        fetchRoles(showDeleted)
    }, [showDeleted, fetchRoles])

    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (role.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredRoles, initialItemsPerPage: 10 })

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            showToast('error', 'Role name is required')
            return
        }

        const success = await createRole({
            roleName: formData.name,
            description: formData.description,
        })

        if (success) {
            setIsCreateModalOpen(false)
            setFormData({ name: '', description: '' })
        }
    }

    const handleEdit = async () => {
        if (!selectedRole) return
        if (!formData.name.trim()) {
            showToast('error', 'Role name is required')
            return
        }

        const success = await updateRole(selectedRole.roleId, {
            roleName: formData.name,
            description: formData.description,
        })

        if (success) {
            setIsEditModalOpen(false)
            setSelectedRole(null)
            setFormData({ name: '', description: '' })
        }
    }

    const handleDelete = async () => {
        if (!selectedRole) return

        const success = await deleteRole(selectedRole.roleId)

        if (success) {
            setIsDeleteDialogOpen(false)
            setSelectedRole(null)
        }
    }

    const handleRestore = async (role: Role) => {
        await restoreRole(role.roleId)
    }

    const openEditModal = (role: Role) => {
        setSelectedRole(role)
        setFormData({ name: role.roleName, description: role.description || '' })
        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (role: Role) => {
        setSelectedRole(role)
        setIsDeleteDialogOpen(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (isLoading && roles.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Roles Management</h1>
                <p className="text-muted-foreground">Manage user roles and permissions</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleted(!showDeleted)}
                            className="gap-2"
                        >
                            {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
                        </Button>
                        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Role
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((role) => (
                            <TableRow key={role.roleId}>
                                <TableCell>
                                    {role.image ? (
                                        <img
                                            src={role.image}
                                            alt={role.roleName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-xs font-medium">
                                                {role.roleName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{role.roleName}</TableCell>
                                <TableCell>{role.description || '-'}</TableCell>
                                <TableCell>{formatDate(role.createdAt)}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.deletedAt
                                        ? 'bg-red-100 text-red-800'
                                        : !role.deletedAt
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {role.deletedAt ? 'Deleted' : !role.deletedAt ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {role.deletedAt ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRestore(role)}
                                                className="gap-1"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                Restore
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(role)}
                                                    className="gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteDialog(role)}
                                                    className="gap-1"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    itemsPerPage={pagination.itemsPerPage}
                    totalItems={pagination.totalItems}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    onPageChange={pagination.goToPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {pagination.currentItems.map((role) => (
                    <div key={role.roleId} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{role.roleName}</h3>
                                <p className="text-sm text-muted-foreground">{role.description || '-'}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.deletedAt
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {role.deletedAt ? 'Deleted' : 'Active'}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                            Created: {formatDate(role.createdAt)}
                        </div>
                        <div className="flex gap-2">
                            {role.deletedAt ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRestore(role)}
                                    className="flex-1 gap-1"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Restore
                                </Button>
                            ) : (
                                <>
                                    <Button size="sm" variant="outline" onClick={() => openEditModal(role)} className="flex-1 gap-1">
                                        <Edit className="w-3 h-3" />
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(role)} className="flex-1 gap-1">
                                        <Trash2 className="w-3 h-3" />
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        itemsPerPage={pagination.itemsPerPage}
                        totalItems={pagination.totalItems}
                        startIndex={pagination.startIndex}
                        endIndex={pagination.endIndex}
                        onPageChange={pagination.goToPage}
                        onItemsPerPageChange={pagination.setItemsPerPage}
                    />
                </div>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Role"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Role'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium mb-2">Role Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter role name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter role description"
                        />
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Role"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium mb-2">Role Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter role name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter role description"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Role"
                message={`Are you sure you want to delete the role "${selectedRole?.roleName}"? This action will soft delete the role.`}
            />
        </div>
    )
}
