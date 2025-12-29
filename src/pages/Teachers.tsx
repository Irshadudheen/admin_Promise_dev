import { useState } from 'react'
import { Eye, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { mockTeachers } from '@/data/mockData'
import type { Teacher } from '@/types'

export default function Teachers() {
    const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
    const [searchTerm, setSearchTerm] = useState('')
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
    const { showToast } = useToast()

    const filteredTeachers = teachers.filter(teacher =>
        teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredTeachers, initialItemsPerPage: 10 })

    const handleDelete = () => {
        if (!selectedTeacher) return
        setTeachers(teachers.filter(t => t.id !== selectedTeacher.id))
        setSelectedTeacher(null)
        showToast('success', 'Teacher deleted successfully!')
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Teachers Management</h1>
                <p className="text-muted-foreground">View and manage teaching staff</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search teachers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Teacher ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">{teacher.id}</TableCell>
                                <TableCell>{teacher.fullName}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>{teacher.subject}</TableCell>
                                <TableCell>{teacher.department}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {teacher.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedTeacher(teacher); setIsViewModalOpen(true) }} className="gap-1">
                                            <Eye className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedTeacher(teacher); setIsDeleteDialogOpen(true) }} className="gap-1">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
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
                {pagination.currentItems.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{teacher.fullName}</h3>
                                <p className="text-sm text-muted-foreground">ID: {teacher.id}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {teacher.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                            <div>
                                <span className="text-muted-foreground">Email:</span>
                                <p className="font-medium">{teacher.email}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Phone:</span>
                                <p className="font-medium">{teacher.phone}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Subject:</span>
                                <p className="font-medium">{teacher.subject}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Department:</span>
                                <p className="font-medium">{teacher.department}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedTeacher(teacher); setIsViewModalOpen(true) }} className="flex-1 gap-1">
                                <Eye className="w-3 h-3" />
                                View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedTeacher(teacher); setIsDeleteDialogOpen(true) }} className="flex-1 gap-1">
                                <Trash2 className="w-3 h-3" />
                                Delete
                            </Button>
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

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Teacher Details">
                {selectedTeacher && (
                    <div className="space-y-3">
                        <div><span className="font-semibold">Teacher ID:</span> {selectedTeacher.id}</div>
                        <div><span className="font-semibold">Full Name:</span> {selectedTeacher.fullName}</div>
                        <div><span className="font-semibold">Email:</span> {selectedTeacher.email}</div>
                        <div><span className="font-semibold">Phone:</span> {selectedTeacher.phone}</div>
                        <div><span className="font-semibold">Subject:</span> {selectedTeacher.subject}</div>
                        <div><span className="font-semibold">Department:</span> {selectedTeacher.department}</div>
                        <div><span className="font-semibold">Join Date:</span> {selectedTeacher.joinDate}</div>
                        <div><span className="font-semibold">Status:</span> {selectedTeacher.status}</div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Teacher"
                message={`Are you sure you want to delete teacher "${selectedTeacher?.fullName}"?`}
            />
        </div>
    )
}
