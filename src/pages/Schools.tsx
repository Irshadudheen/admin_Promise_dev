import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { Loader } from '@/components/ui/Loader'
import useSchoolStore from '@/store/schoolStore'
import useClassStore from '@/store/classStore'
import useDivisionStore from '@/store/divisionStore'
import useCountryCodeStore from '@/store/countryCodeStore'
import type { School, ClassGradeMappingInput } from '@/types/school'

interface FormData {
    schoolName: string
    schoolCode: string
    countryCodeId: string
    phone: string
    address: string
    selectedClassIds: string[]
    classDivisionMappings: { [classId: string]: string[] } // classId -> divisionIds[]
}

export default function Schools() {
    const { schools, isLoading, fetchSchools, createSchool, updateSchool, deleteSchool } = useSchoolStore()
    const { classes, fetchClasses } = useClassStore()
    const { divisions, fetchDivisions } = useDivisionStore()
    const { countryCodes, fetchCountryCodes } = useCountryCodeStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
    const [formData, setFormData] = useState<FormData>({
        schoolName: '',
        schoolCode: '',
        countryCodeId: '',
        phone: '',
        address: '',
        selectedClassIds: [],
        classDivisionMappings: {}
    })
    const { showToast } = useToast()

    // Fetch data on component mount
    useEffect(() => {
        fetchSchools()
        fetchClasses()
        fetchDivisions()
        fetchCountryCodes()
    }, [fetchSchools, fetchClasses, fetchDivisions, fetchCountryCodes])

    const filteredSchools = schools.filter(school =>
        school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.schoolCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredSchools, initialItemsPerPage: 10 })

    const resetForm = () => {
        setFormData({
            schoolName: '',
            schoolCode: '',
            countryCodeId: '',
            phone: '',
            address: '',
            selectedClassIds: [],
            classDivisionMappings: {}
        })
    }

    const handleClassSelect = (classId: string) => {
        const isSelected = formData.selectedClassIds.includes(classId)

        if (isSelected) {
            // Remove class and its division mappings
            const newSelectedClassIds = formData.selectedClassIds.filter(id => id !== classId)
            const newMappings = { ...formData.classDivisionMappings }
            delete newMappings[classId]

            setFormData({
                ...formData,
                selectedClassIds: newSelectedClassIds,
                classDivisionMappings: newMappings
            })
        } else {
            // Add class
            setFormData({
                ...formData,
                selectedClassIds: [...formData.selectedClassIds, classId],
                classDivisionMappings: {
                    ...formData.classDivisionMappings,
                    [classId]: []
                }
            })
        }
    }

    const handleDivisionToggle = (classId: string, divisionId: string) => {
        const currentDivisions = formData.classDivisionMappings[classId] || []
        const isSelected = currentDivisions.includes(divisionId)

        const newDivisions = isSelected
            ? currentDivisions.filter(id => id !== divisionId)
            : [...currentDivisions, divisionId]

        setFormData({
            ...formData,
            classDivisionMappings: {
                ...formData.classDivisionMappings,
                [classId]: newDivisions
            }
        })
    }

    const buildMappingsArray = (): ClassGradeMappingInput[] => {
        const mappings: ClassGradeMappingInput[] = []

        formData.selectedClassIds.forEach(classId => {
            const divisionIds = formData.classDivisionMappings[classId] || []
            divisionIds.forEach(gradeId => {
                mappings.push({ classId, gradeId })
            })
        })

        return mappings
    }

    const handleCreate = async () => {
        if (!formData.schoolName.trim()) {
            showToast('error', 'School name is required')
            return
        }
        if (!formData.schoolCode.trim()) {
            showToast('error', 'School code is required')
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

        const mappings = buildMappingsArray()

        const success = await createSchool({
            schoolName: formData.schoolName,
            schoolCode: formData.schoolCode,
            countryCodeId: formData.countryCodeId,
            phone: formData.phone,
            address: formData.address || '',
            gradeClassMappings: mappings
        })

        if (success) {
            setIsCreateModalOpen(false)
            resetForm()
        }
    }

    const handleEdit = async () => {
        if (!selectedSchool) return
        if (!formData.schoolName.trim()) {
            showToast('error', 'School name is required')
            return
        }
        if (!formData.schoolCode.trim()) {
            showToast('error', 'School code is required')
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

        const mappings = buildMappingsArray()

        const success = await updateSchool(selectedSchool.id, {
            schoolName: formData.schoolName,
            schoolCode: formData.schoolCode,
            countryCodeId: formData.countryCodeId,
            phone: formData.phone,
            address: formData.address || '',
            gradeClassMappings: mappings
        })

        if (success) {
            setIsEditModalOpen(false)
            setSelectedSchool(null)
            resetForm()
        }
    }

    const handleDelete = async () => {
        if (!selectedSchool) return

        const success = await deleteSchool(selectedSchool.id)

        if (success) {
            setIsDeleteDialogOpen(false)
            setSelectedSchool(null)
        }
    }

    const openEditModal = (school: School) => {
        setSelectedSchool(school)

        // Build class IDs and division mappings from school.mappings
        const selectedClassIds = Array.from(new Set(school.mappings.map(m => m.classId)))
        const classDivisionMappings: { [classId: string]: string[] } = {}

        selectedClassIds.forEach(classId => {
            const divisionsForClass = school.mappings
                .filter(m => m.classId === classId)
                .map(m => m.gradeId)
            classDivisionMappings[classId] = divisionsForClass
        })

        setFormData({
            schoolName: school.schoolName,
            schoolCode: school.schoolCode,
            countryCodeId: school.countryCodeId,
            phone: school.phone,
            address: school.address || '',
            selectedClassIds,
            classDivisionMappings
        })
        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (school: School) => {
        setSelectedSchool(school)
        setIsDeleteDialogOpen(true)
    }

    const getCountryCodeDisplay = (countryCodeId: string) => {
        const countryCode = countryCodes.find(cc => cc.id === countryCodeId)
        return countryCode ? countryCode.code : countryCodeId
    }

    const getClassNameById = (classId: string) => {
        const classItem = classes.find(c => c.id === classId)
        return classItem ? classItem.className : classId
    }

    if (isLoading && schools.length === 0) {
        return (
            <div className="flex items-center justify-center">
                <Loader />
            </div>
        )
    }

    const renderSchoolForm = () => (
        <div className="space-y-6 text-left">
            {/* School Details Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4">School Details</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">School Name *</label>
                        <Input
                            value={formData.schoolName}
                            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                            placeholder="Enter school name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">School Code *</label>
                        <Input
                            value={formData.schoolCode}
                            onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                            placeholder="Enter school code"
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
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter school address"
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px]"
                        />
                    </div>
                </div>
            </div>

            {/* Class Assignment Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Class Assignment</h3>
                <div className="space-y-3">
                    <label className="block text-sm font-medium mb-2">Select Classes</label>
                    <div className="border border-border rounded-md p-3 max-h-48 overflow-y-auto">
                        {classes.filter(c => !c.deletedAt).map((classItem) => (
                            <div key={classItem.id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`class-${classItem.id}`}
                                    checked={formData.selectedClassIds.includes(classItem.id)}
                                    onChange={() => handleClassSelect(classItem.id)}
                                    className="mr-2 w-4 h-4"
                                />
                                <label htmlFor={`class-${classItem.id}`} className="cursor-pointer">
                                    {classItem.className}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Selected Classes Display */}
                    {formData.selectedClassIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.selectedClassIds.map(id => (
                                <span
                                    key={id}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    {getClassNameById(id)}
                                    <button
                                        onClick={() => handleClassSelect(id)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Division Mapping Section */}
            {formData.selectedClassIds.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Division Mapping</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Select divisions for each class
                    </p>
                    <div className="space-y-4">
                        {formData.selectedClassIds.map(classId => (
                            <div key={classId} className="border border-border rounded-md p-4">
                                <h4 className="font-medium mb-3">{getClassNameById(classId)}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {divisions.filter(d => !d.deletedAt).map((division) => (
                                        <div key={division.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`division-${classId}-${division.id}`}
                                                checked={(formData.classDivisionMappings[classId] || []).includes(division.id)}
                                                onChange={() => handleDivisionToggle(classId, division.id)}
                                                className="mr-2 w-4 h-4"
                                            />
                                            <label
                                                htmlFor={`division-${classId}-${division.id}`}
                                                className="cursor-pointer text-sm"
                                            >
                                                {division.gradeName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Schools Management</h1>
                <p className="text-muted-foreground">Manage schools with class and division assignments</p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search schools..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add School
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>School Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Country Code</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((school) => (
                            <TableRow key={school.id}>
                                <TableCell className="font-medium">{school.schoolName}</TableCell>
                                <TableCell>{school.schoolCode}</TableCell>
                                <TableCell>{school.phone}</TableCell>
                                <TableCell>{getCountryCodeDisplay(school.countryCodeId)}</TableCell>
                                <TableCell className="max-w-xs truncate">{school.address || '-'}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${school.deletedAt
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {school.deletedAt ? 'Deleted' : 'Active'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        {!school.deletedAt && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(school)}
                                                    className="gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => openDeleteDialog(school)}
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
                {pagination.currentItems.map((school) => (
                    <div key={school.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{school.schoolName}</h3>
                                <p className="text-sm text-muted-foreground">Code: {school.schoolCode}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${school.deletedAt
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {school.deletedAt ? 'Deleted' : 'Active'}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                            <div><strong>Phone:</strong> {school.phone}</div>
                            <div><strong>Country Code:</strong> {getCountryCodeDisplay(school.countryCodeId)}</div>
                            <div><strong>Address:</strong> {school.address || '-'}</div>
                        </div>
                        {!school.deletedAt && (
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openEditModal(school)} className="flex-1 gap-1">
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(school)} className="flex-1 gap-1">
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
                title="Create New School"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => {
                            setIsCreateModalOpen(false)
                            resetForm()
                        }}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading ? 'Creating...' : 'Create School'}
                        </Button>
                    </div>
                }
            >
                {renderSchoolForm()}
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedSchool(null)
                    resetForm()
                }}
                title="Edit School"
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => {
                            setIsEditModalOpen(false)
                            setSelectedSchool(null)
                            resetForm()
                        }}>Cancel</Button>
                        <Button onClick={handleEdit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                }
            >
                {renderSchoolForm()}
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete School"
                message={`Are you sure you want to delete school "${selectedSchool?.schoolName}"? This action will soft delete the school.`}
            />
        </div>
    )
}
