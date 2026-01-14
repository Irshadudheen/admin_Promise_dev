import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { Loader } from '@/components/ui/Loader'
import useDivisionStore from '@/store/divisionStore'
import type { Division } from '@/types/division'

export default function Grades() {
    const { divisions, isLoading, fetchDivisions, createDivision, updateDivision, deleteDivision } = useDivisionStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedDivision, setSelectedDivision] = useState<Division | null>(null)
    const [formData, setFormData] = useState({ name: '' })
    const { showToast } = useToast()

    // Fetch divisions on component mount
    useEffect(() => {
        fetchDivisions()
    }, [fetchDivisions])

    const filteredDivisions = divisions.filter(division =>
        division.gradeName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredDivisions, initialItemsPerPage: 10 })

    const handleCreate = async () => {
        if (!formData.name.trim()) {
            showToast('error', 'Division name is required')
            return
        }

        const success = await createDivision({
            gradeName: formData.name.toUpperCase(),
        })

        if (success) {
            setIsCreateModalOpen(false)
            setFormData({ name: '' })
        }
    }

    const handleEdit = async () => {
        if (!selectedDivision) return
        if (!formData.name.trim()) {
            showToast('error', 'Division name is required')
            return
        }

        const success = await updateDivision(selectedDivision.id, {
            gradeName: formData.name.toUpperCase(),
        })

        if (success) {
            setIsEditModalOpen(false)
            setSelectedDivision(null)
            setFormData({ name: '' })
        }
    }

    const handleDelete = async () => {
        if (!selectedDivision) return

        const success = await deleteDivision(selectedDivision.id)

        if (success) {
            setIsDeleteDialogOpen(false)
            setSelectedDivision(null)
        }
    }

    const openEditModal = (division: Division) => {
        setSelectedDivision(division)
        setFormData({ name: division.gradeName })
        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (division: Division) => {
        setSelectedDivision(division)
        setIsDeleteDialogOpen(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (isLoading && divisions.length === 0) {
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Divisions Management</h1>
                <p className="text-muted-foreground">Manage school divisions (A, B, C, D, E, F)</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search divisions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Division
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Division</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((division) => (
                            <TableRow key={division.id}>
                                <TableCell className="font-medium text-lg">{division.gradeName}</TableCell>
                                <TableCell>{formatDate(division.createdAt)}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${division.deletedAt
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {division.deletedAt ? 'Deleted' : 'Active'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {!division.deletedAt && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(division)}
                                                    className="gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteDialog(division)}
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
                {pagination.currentItems.map((division) => (
                    <div key={division.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-2xl">{division.gradeName}</h3>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${division.deletedAt
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {division.deletedAt ? 'Deleted' : 'Active'}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                            Created: {formatDate(division.createdAt)}
                        </div>
                        {!division.deletedAt && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openEditModal(division)} className="flex-1 gap-1">
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(division)} className="flex-1 gap-1">
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                </Button>
                            </div>
                        )}
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
                title="Create New Division"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Division'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium mb-2">Division Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter division (e.g., A, B, C)"
                            maxLength={1}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Enter a single letter (A-Z)</p>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Division"
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
                        <label className="block text-sm font-medium mb-2">Division Name *</label>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter division"
                            maxLength={1}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Enter a single letter (A-Z)</p>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Division"
                message={`Are you sure you want to delete division "${selectedDivision?.gradeName}"? This action will soft delete the division.`}
            />
        </div>
    )
}
