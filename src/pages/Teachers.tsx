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
import useTeacherStore from '@/store/teacherStore'
import useClassStore from '@/store/classStore'
import useDivisionStore from '@/store/divisionStore'
import useSchoolStore from '@/store/schoolStore'
import useRoleStore from '@/store/roleStore'
import useCountryCodeStore from '@/store/countryCodeStore'
import type { Teacher } from '@/types/teacher'

interface FormData {
    teacherName: string
    teacherCode: string
    phone: string
    countryCodeId: string
    schoolId: string
    classId: string
    gradeId: string
    roleId: string
}

export default function Teachers() {
    const { teachers, isLoading, fetchTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeacherStore()
    const { classes, fetchClasses } = useClassStore()
    const { divisions, fetchDivisions } = useDivisionStore()
    const { schools, fetchSchools } = useSchoolStore()
    const { roles, fetchRoles } = useRoleStore()
    const { countryCodes, fetchCountryCodes } = useCountryCodeStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
    const [formData, setFormData] = useState<FormData>({
        teacherName: '',
        teacherCode: '',
        phone: '',
        countryCodeId: '',
        schoolId: '',
        classId: '',
        gradeId: '',
        roleId: ''
    })
    const { showToast } = useToast()

    // Fetch data on component mount
    useEffect(() => {
        fetchTeachers()
        fetchClasses()
        fetchDivisions()
        fetchSchools()
        fetchRoles()
        fetchCountryCodes()
    }, [fetchTeachers, fetchClasses, fetchDivisions, fetchSchools, fetchRoles, fetchCountryCodes])

    // Auto-select teacher role when roles are loaded
    useEffect(() => {
        if (roles.length > 0 && !formData.roleId) {
            const teacherRole = roles.find(r => r.roleName.toLowerCase() === 'teacher')
            if (teacherRole) {
                setFormData(prev => ({ ...prev, roleId: teacherRole.roleId }))
            }
        }
    }, [roles])

    const filteredTeachers = teachers.filter(teacher =>
        teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.phone.includes(searchTerm)
    )

    const pagination = usePagination({ items: filteredTeachers, initialItemsPerPage: 10 })

    const resetForm = () => {
        setFormData({
            teacherName: '',
            teacherCode: '',
            phone: '',
            countryCodeId: '',
            schoolId: '',
            classId: '',
            gradeId: '',
            roleId: ''
        })
    }

    const handleCreate = async () => {
        if (!formData.teacherName.trim()) {
            showToast('error', 'Teacher name is required')
            return
        }
        if (!formData.teacherCode.trim()) {
            showToast('error', 'Teacher code is required')
            return
        }
        if (!formData.countryCodeId) {
            showToast('error', 'Country code is required')
            return
        }
        if (!formData.phone.trim()) {
            showToast('error', 'Phone number is required')
            return
        }
        if (!formData.schoolId) {
            showToast('error', 'School is required')
            return
        }
        if (!formData.classId) {
            showToast('error', 'Class is required')
            return
        }
        if (!formData.gradeId) {
            showToast('error', 'Division is required')
            return
        }
        if (!formData.roleId) {
            showToast('error', 'Role is required')
            return
        }

        const success = await createTeacher({
            teacherName: formData.teacherName,
            teacherCode: formData.teacherCode,
            phone: formData.phone,
            countryCodeId: formData.countryCodeId,
            schoolId: formData.schoolId,
            classId: formData.classId,
            gradeId: formData.gradeId,
            roleId: formData.roleId
        })

        if (success) {
            setIsCreateModalOpen(false)
            resetForm()
        }
    }

    const handleEdit = async () => {
        if (!selectedTeacher) return
        if (!formData.teacherName.trim()) {
            showToast('error', 'Teacher name is required')
            return
        }
        if (!formData.phone.trim()) {
            showToast('error', 'Phone number is required')
            return
        }

        const success = await updateTeacher(selectedTeacher.id, {
            teacherName: formData.teacherName,
            phone: formData.phone,
            countryCodeId: formData.countryCodeId
        })

        if (success) {
            setIsEditModalOpen(false)
            setSelectedTeacher(null)
            resetForm()
        }
    }

    const handleDelete = async () => {
        if (!selectedTeacher) return

        const success = await deleteTeacher(selectedTeacher.id)

        if (success) {
            setIsDeleteDialogOpen(false)
            setSelectedTeacher(null)
        }
    }

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher)

        setFormData({
            teacherName: teacher.teacherName,
            teacherCode: teacher.teacherCode,
            phone: teacher.phone,
            countryCodeId: teacher.countryCodeId,
            schoolId: teacher.schoolId,
            classId: '',
            gradeId: '',
            roleId: ''
        })
        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (teacher: Teacher) => {
        setSelectedTeacher(teacher)
        setIsDeleteDialogOpen(true)
    }

    const getSchoolNameById = (schoolId: string) => {
        const school = schools.find(s => s.id === schoolId)
        return school ? school.schoolName : schoolId
    }

    if (isLoading && teachers.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    const renderTeacherForm = () => (
        <div className="space-y-6 text-left">
            {/* Teacher Details Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Teacher Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Teacher Name *</label>
                        <Input
                            value={formData.teacherName}
                            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                            placeholder="Enter teacher name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Teacher Code *</label>
                        <Input
                            value={formData.teacherCode}
                            onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                            placeholder="Enter teacher code"
                            disabled={!!selectedTeacher}
                        />
                        {selectedTeacher && (
                            <p className="text-xs text-muted-foreground mt-1">Teacher code cannot be changed</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Country Code *</label>
                        <select
                            value={formData.countryCodeId}
                            onChange={(e) => setFormData({ ...formData, countryCodeId: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select country code</option>
                            {countryCodes.map((cc) => (
                                <option key={cc.id} value={cc.id}>
                                    {cc.code} (+{cc.digitCount} digits)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">School *</label>
                        <select
                            value={formData.schoolId}
                            onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={!!selectedTeacher}
                        >
                            <option value="">Select school</option>
                            {schools.filter(s => !s.deletedAt).map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.schoolName}
                                </option>
                            ))}
                        </select>
                        {selectedTeacher && (
                            <p className="text-xs text-muted-foreground mt-1">School cannot be changed</p>
                        )}
                    </div>

                    {!selectedTeacher && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-2">Class *</label>
                                <select
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select class</option>
                                    {classes.filter(c => !c.deletedAt).map((classItem) => (
                                        <option key={classItem.id} value={classItem.id}>
                                            {classItem.className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Division *</label>
                                <select
                                    value={formData.gradeId}
                                    onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select division</option>
                                    {divisions.filter(d => !d.deletedAt).map((division) => (
                                        <option key={division.id} value={division.id}>
                                            {division.gradeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Role *</label>
                                <select
                                    value={formData.roleId}
                                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select role</option>
                                    {roles.filter(r => !r.deletedAt).map((role) => (
                                        <option key={role.roleId} value={role.roleId}>
                                            {role.roleName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Teachers Management</h1>
                <p className="text-muted-foreground">Manage teachers with class and division assignments</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Teacher
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell className="font-medium">{teacher.teacherName}</TableCell>
                                <TableCell>{teacher.teacherCode}</TableCell>
                                <TableCell>{teacher.phone}</TableCell>
                                <TableCell>{getSchoolNameById(teacher.schoolId)}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.deletedAt
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {teacher.deletedAt ? 'Deleted' : 'Active'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {!teacher.deletedAt && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(teacher)}
                                                    className="gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteDialog(teacher)}
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
                {pagination.currentItems.map((teacher) => (
                    <div key={teacher.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{teacher.teacherName}</h3>
                                <p className="text-sm text-muted-foreground">Code: {teacher.teacherCode}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.deletedAt
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {teacher.deletedAt ? 'Deleted' : 'Active'}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                            <div><strong>Phone:</strong> {teacher.phone}</div>
                            <div><strong>School:</strong> {getSchoolNameById(teacher.schoolId)}</div>
                        </div>
                        {!teacher.deletedAt && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openEditModal(teacher)} className="flex-1 gap-1">
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(teacher)} className="flex-1 gap-1">
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
                onClose={() => {
                    setIsCreateModalOpen(false)
                    resetForm()
                }}
                title="Create New Teacher"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => {
                            setIsCreateModalOpen(false)
                            resetForm()
                        }}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create Teacher'}
                        </Button>
                    </div>
                }
            >
                {renderTeacherForm()}
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedTeacher(null)
                    resetForm()
                }}
                title="Edit Teacher"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => {
                            setIsEditModalOpen(false)
                            setSelectedTeacher(null)
                            resetForm()
                        }}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                {renderTeacherForm()}
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Teacher"
                message={`Are you sure you want to delete teacher "${selectedTeacher?.teacherName}"? This action will soft delete the teacher.`}
            />
        </div>
    )
}
