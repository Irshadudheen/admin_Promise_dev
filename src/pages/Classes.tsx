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
import useClassStore from '@/store/classStore'
import type { Class } from '@/types/class'

export default function Classes() {
    const { classes, isLoading, fetchClasses, createClass, updateClass, deleteClass } = useClassStore()
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedClass, setSelectedClass] = useState<Class | null>(null)
    const [formData, setFormData] = useState({ className: '', gradeLevel: '', description: '' })
    const { showToast } = useToast()

    // Fetch classes on component mount
    useEffect(() => {
        fetchClasses()
    }, [fetchClasses])

    const filteredClasses = classes.filter(cls =>
        cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.gradeLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cls.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredClasses, initialItemsPerPage: 10 })

    const handleCreate = async () => {
        if (!formData.className.trim()) {
            showToast('error', 'Class name is required')
            return
        }
      

        const success = await createClass({
            className: formData.className,
            gradeLevel: formData.gradeLevel,
            description: formData.description || undefined,
        })

        if (success) {
            setIsCreateModalOpen(false)
            setFormData({ className: '', gradeLevel: '', description: '' })
        }
    }

    const handleEdit = async () => {
        if (!selectedClass) return
        if (!formData.className.trim()) {
            showToast('error', 'Class name is required')
            return
        }
        if (!formData.gradeLevel.trim()) {
            showToast('error', 'Grade level is required')
            return
        }

        const success = await updateClass(selectedClass.classId, {
            className: formData.className,
            gradeLevel: formData.gradeLevel,
            description: formData.description || undefined,
        })

        if (success) {
            setIsEditModalOpen(false)
            setSelectedClass(null)
            setFormData({ className: '', gradeLevel: '', description: '' })
        }
    }

    const handleDelete = async () => {
        if (!selectedClass) return

        const success = await deleteClass(selectedClass.classId)

        if (success) {
            setIsDeleteDialogOpen(false)
            setSelectedClass(null)
        }
    }

    const openEditModal = (cls: Class) => {
        setSelectedClass(cls)
        setFormData({ 
            className: cls.className, 
            gradeLevel: cls.gradeLevel, 
            description: cls.description || '' 
        })
        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (cls: Class) => {
        setSelectedClass(cls)
        setIsDeleteDialogOpen(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (isLoading && classes.length === 0) {
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
                <h1 className="text-3xl font-bold text-foreground mb-2">Classes Management</h1>
                <p className="text-muted-foreground">Manage class sections (1A, 1B, 2A, 2B, etc.)</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search classes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Class
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Class Name</TableHead>
                       
                            <TableHead>Created Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((cls) => (
                            <TableRow key={cls.classId}>
                                <TableCell className="font-medium text-lg">{cls.className}</TableCell>
                              
                                
                                <TableCell>{formatDate(cls.createdAt)}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        cls.deletedAt
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {cls.deletedAt ? 'Deleted' : 'Active'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {!cls.deletedAt && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(cls)}
                                                    className="gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteDialog(cls)}
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
                {pagination.currentItems.map((cls) => (
                    <div key={cls.classId} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-xl">{cls.className}</h3>
                                <p className="text-sm text-muted-foreground">Grade {cls.gradeLevel}</p>
                                <p className="text-sm text-muted-foreground">{cls.description || '-'}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                cls.deletedAt
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {cls.deletedAt ? 'Deleted' : 'Active'}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                            Created: {formatDate(cls.createdAt)}
                        </div>
                        {!cls.deletedAt && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openEditModal(cls)} className="flex-1 gap-1">
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(cls)} className="flex-1 gap-1">
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
                title="Create New Class"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Class'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium mb-2">Class Name *</label>
                        <Input
                            value={formData.className}
                            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                            placeholder="Enter class name (e.g., 1A, 2B)"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description"
                        />
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Class"
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
                        <label className="block text-sm font-medium mb-2">Class Name *</label>
                        <Input
                            value={formData.className}
                            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                            placeholder="Enter class name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Grade Level *</label>
                        <Input
                            value={formData.gradeLevel}
                            onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                            placeholder="Enter grade level"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Enter description"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Class"
                message={`Are you sure you want to delete class "${selectedClass?.className}"? This action will soft delete the class.`}
            />
        </div>
    )
}
