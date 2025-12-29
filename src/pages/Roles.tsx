import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { mockRoles } from '@/data/mockData'
import type { Role } from '@/types'

export default function Roles() {
    const [roles, setRoles] = useState<Role[]>(mockRoles)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [formData, setFormData] = useState({ roleName: '', description: '', status: 'Active' as 'Active' | 'Inactive' })
    const { showToast } = useToast()

    const filteredRoles = roles.filter(role =>
        role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleCreate = () => {
        const newRole: Role = {
            id: `${roles.length + 1}`,
            roleName: formData.roleName,
            description: formData.description,
            createdDate: new Date().toISOString().split('T')[0],
            status: formData.status
        }
        setRoles([...roles, newRole])
        setIsCreateModalOpen(false)
        setFormData({ roleName: '', description: '', status: 'Active' })
        showToast('success', 'Role created successfully!')
    }

    const handleEdit = () => {
        if (!selectedRole) return
        setRoles(roles.map(role =>
            role.id === selectedRole.id
                ? { ...role, roleName: formData.roleName, description: formData.description, status: formData.status }
                : role
        ))
        setIsEditModalOpen(false)
        setSelectedRole(null)
        setFormData({ roleName: '', description: '', status: 'Active' })
        showToast('success', 'Role updated successfully!')
    }

    const handleDelete = () => {
        if (!selectedRole) return
        setRoles(roles.filter(role => role.id !== selectedRole.id))
        setSelectedRole(null)
        showToast('success', 'Role deleted successfully!')
    }

    const openEditModal = (role: Role) => {
        setSelectedRole(role)
        setFormData({ roleName: role.roleName, description: role.description, status: role.status })
        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (role: Role) => {
        setSelectedRole(role)
        setIsDeleteDialogOpen(true)
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
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRoles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">{role.roleName}</TableCell>
                                <TableCell>{role.description}</TableCell>
                                <TableCell>{role.createdDate}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {role.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
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
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Role"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate}>Create Role</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Role Name</label>
                        <Input
                            value={formData.roleName}
                            onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
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
                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
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
                        <Button onClick={handleEdit}>Save Changes</Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Role Name</label>
                        <Input
                            value={formData.roleName}
                            onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
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
                    <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Role"
                message={`Are you sure you want to delete the role "${selectedRole?.roleName}"? This action cannot be undone.`}
            />
        </div>
    )
}
