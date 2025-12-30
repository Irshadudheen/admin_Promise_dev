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
import type { School, ClassGradeMappingInput } from '@/types/school'

interface FormData {
    schoolName: string;
    schoolCode: string;
    phone: string;
    address: string;
    countryCodeId: string;
}

interface ClassDivisionMapping {
    classId: string;
    className: string;
    selectedDivisions: Set<string>;
}

export default function Schools() {
    const {
        schools,
        countryCodes,
        isLoading,
        fetchSchools,
        fetchCountryCodes,
        createSchool,
        updateSchool,
        deleteSchool
    } = useSchoolStore()

    const { classes, fetchClasses } = useClassStore()
    const { divisions, fetchDivisions } = useDivisionStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null)

    const [formData, setFormData] = useState<FormData>({
        schoolName: '',
        schoolCode: '',
        phone: '',
        address: '',
        countryCodeId: '',
    })

    const [classDivisionMappings, setClassDivisionMappings] = useState<ClassDivisionMapping[]>([])
    const [currentClassSelection, setCurrentClassSelection] = useState<string>('')
    const [currentDivisionSelections, setCurrentDivisionSelections] = useState<Set<string>>(new Set())
    const { showToast } = useToast()

    // Fetch data on component mount
    useEffect(() => {
        fetchSchools()
        fetchCountryCodes()
        fetchClasses()
        fetchDivisions()
    }, [fetchSchools, fetchCountryCodes, fetchClasses, fetchDivisions])

    const filteredSchools = schools.filter(school =>
        school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.schoolCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredSchools, initialItemsPerPage: 10 })

    const resetForm = () => {
        setFormData({
            schoolName: '',
            schoolCode: '',
            phone: '',
            address: '',
            countryCodeId: '',
        })
        setClassDivisionMappings([])
        setCurrentClassSelection('')
        setCurrentDivisionSelections(new Set())
    }



    const handleToggleClass = (classId: string, className: string) => {
        const exists = classDivisionMappings.find(m => m.classId === classId)

        if (exists) {
            // Remove class
            setClassDivisionMappings(classDivisionMappings.filter(m => m.classId !== classId))
            setExpandedClasses(prev => {
                const newSet = new Set(prev)
                newSet.delete(classId)
                return newSet
            })
        } else {
            // Add class
            setClassDivisionMappings([
                ...classDivisionMappings,
                {
                    classId,
                    className,
                    selectedDivisions: new Set()
                }
            ])
        }
    }



    const handleAddMapping = () => {
        if (!currentClassSelection || currentDivisionSelections.size === 0) {
            showToast('error', 'Please select a class and at least one division')
            return
        }

        const selectedClass = classes.find(c => c.classId === currentClassSelection)
        if (!selectedClass) return

        // Check if this class already has a mapping
        const existingIndex = classDivisionMappings.findIndex(m => m.classId === currentClassSelection)

        if (existingIndex >= 0) {
            // Update existing mapping by merging divisions
            const updatedMappings = [...classDivisionMappings]
            const existingDivisions = updatedMappings[existingIndex].selectedDivisions
            const mergedDivisions = new Set([...existingDivisions, ...currentDivisionSelections])
            updatedMappings[existingIndex] = {
                ...updatedMappings[existingIndex],
                selectedDivisions: mergedDivisions
            }
            setClassDivisionMappings(updatedMappings)
            showToast('success', `Updated divisions for ${selectedClass.className}`)
        } else {
            // Add new mapping
            setClassDivisionMappings([
                ...classDivisionMappings,
                {
                    classId: currentClassSelection,
                    className: selectedClass.className,
                    selectedDivisions: new Set(currentDivisionSelections)
                }
            ])
            showToast('success', `Added ${selectedClass.className} with ${currentDivisionSelections.size} division(s)`)
        }

        // Reset current selections
        setCurrentClassSelection('')
        setCurrentDivisionSelections(new Set())
    }

    const handleRemoveMapping = (index: number) => {
        const mapping = classDivisionMappings[index]
        setClassDivisionMappings(classDivisionMappings.filter((_, i) => i !== index))
        showToast('success', `Removed ${mapping.className} mapping`)
    }

    const validateForm = (): boolean => {
        if (!formData.schoolName.trim()) {
            showToast('error', 'School name is required')
            return false
        }
        if (!formData.schoolCode.trim()) {
            showToast('error', 'School code is required')
            return false
        }
        if (!formData.phone.trim()) {
            showToast('error', 'Phone number is required')
            return false
        }
        if (!formData.address.trim()) {
            showToast('error', 'Address is required')
            return false
        }
        if (!formData.countryCodeId) {
            showToast('error', 'Country code is required')
            return false
        }
        return true
    }

    const buildMappingsArray = (): ClassGradeMappingInput[] => {
        const mappings: ClassGradeMappingInput[] = []
        classDivisionMappings.forEach(classMapping => {
            classMapping.selectedDivisions.forEach(gradeId => {
                mappings.push({
                    classId: classMapping.classId,
                    gradeId: gradeId
                })
            })
        })
        return mappings
    }

    const handleCreate = async () => {
        if (!validateForm()) return

        const mappings = buildMappingsArray()

        const success = await createSchool({
            ...formData,
            mappings: mappings.length > 0 ? mappings : undefined
        })

        if (success) {
            setIsCreateModalOpen(false)
            resetForm()
        }
    }

    const handleEdit = async () => {
        if (!selectedSchool) return
        if (!validateForm()) return

        const mappings = buildMappingsArray()

        const success = await updateSchool(selectedSchool.id, {
            ...formData,
            mappings: mappings.length > 0 ? mappings : undefined
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
        setFormData({
            schoolName: school.schoolName,
            schoolCode: school.schoolCode,
            phone: school.phone,
            address: school.address,
            countryCodeId: school.countryCodeId,
        })

        // Build class-division mappings from school data
        if (school.mappings) {
            const mappingsMap = new Map<string, ClassDivisionMapping>()

            school.mappings.forEach(mapping => {
                if (!mapping.class || !mapping.grade) return

                if (!mappingsMap.has(mapping.classId)) {
                    mappingsMap.set(mapping.classId, {
                        classId: mapping.classId,
                        className: mapping.class.className,
                        selectedDivisions: new Set()
                    })
                }

                const classMapping = mappingsMap.get(mapping.classId)!
                classMapping.selectedDivisions.add(mapping.gradeId)
            })

            setClassDivisionMappings(Array.from(mappingsMap.values()))
        }

        setIsEditModalOpen(true)
    }

    const openDeleteDialog = (school: School) => {
        setSelectedSchool(school)
        setIsDeleteDialogOpen(true)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (isLoading && schools.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
            </div>
        )
    }

    const SchoolFormContent = () => (
        <div className="space-y-6 text-left">
            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
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
                            placeholder="Enter unique code"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Country Code *</label>
                        <select
                            value={formData.countryCodeId}
                            onChange={(e) => setFormData({ ...formData, countryCodeId: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select country code</option>
                            {countryCodes.map(cc => (
                                <option key={cc.id} value={cc.id}>
                                    {cc.code} ({cc.digitCount} digits)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter phone number"
                            type="tel"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter school address"
                    />
                </div>
            </div>

            {/* Class-Division Mappings */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Class & Division Mappings (Optional)</h3>

                {/* Add New Mapping Section */}
                <div className="bg-gray-50 border border-border rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium">Add Class-Division Mapping</p>

                    {/* Step 1: Select Class */}
                    <div>
                        <label className="block text-sm font-medium mb-2">1. Select Class</label>
                        <select
                            value={currentClassSelection}
                            onChange={(e) => {
                                setCurrentClassSelection(e.target.value)
                                setCurrentDivisionSelections(new Set())
                            }}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Choose a class...</option>
                            {classes.filter(c => !c.deletedAt).map(cls => (
                                <option key={cls.classId} value={cls.classId}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Select Divisions (only shown when class is selected) */}
                    {currentClassSelection && (
                        <div>
                            <label className="block text-sm font-medium mb-2">2. Select Divisions for this class</label>
                            <div className="grid grid-cols-3 gap-2 p-3 border border-border rounded-md bg-white max-h-[150px] overflow-y-auto">
                                {divisions.filter(d => !d.deletedAt).map(div => (
                                    <label key={div.gradeId} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-50 p-1 rounded">
                                        <input
                                            type="checkbox"
                                            checked={currentDivisionSelections.has(div.gradeId)}
                                            onChange={(e) => {
                                                const newSelections = new Set(currentDivisionSelections)
                                                if (e.target.checked) {
                                                    newSelections.add(div.gradeId)
                                                } else {
                                                    newSelections.delete(div.gradeId)
                                                }
                                                setCurrentDivisionSelections(newSelections)
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span>{div.gradeName}</span>
                                    </label>
                                ))}
                            </div>
                            {currentDivisionSelections.size > 0 && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {currentDivisionSelections.size} division(s) selected
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Add Button */}
                    {currentClassSelection && currentDivisionSelections.size > 0 && (
                        <Button
                            type="button"
                            onClick={handleAddMapping}
                            className="w-full"
                            variant="outline"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add This Mapping
                        </Button>
                    )}
                </div>

                {/* Display Added Mappings */}
                {classDivisionMappings.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Added Mappings ({classDivisionMappings.length})</p>
                        <div className="space-y-2">
                            {classDivisionMappings.map((mapping, index) => (
                                <div key={index} className="flex items-start justify-between p-3 border border-border rounded-lg bg-white">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{mapping.className}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {Array.from(mapping.selectedDivisions).map(divId => {
                                                const div = divisions.find(d => d.gradeId === divId)
                                                return div ? (
                                                    <span key={divId} className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                                                        {div.gradeName}
                                                    </span>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveMapping(index)}
                                        className="ml-2 p-1 hover:bg-red-50 rounded text-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Schools Management</h1>
                <p className="text-muted-foreground">Manage school information and class-division mappings</p>
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
                            <TableHead>School Code</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Classes</TableHead>
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
                                <TableCell className="max-w-[200px] truncate">{school.address}</TableCell>
                                <TableCell>
                                    {school.mappings && school.mappings.length > 0 ? (
                                        <span className="text-sm text-muted-foreground">
                                            {school.mappings.length} mapping(s)
                                        </span>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">No mappings</span>
                                    )}
                                </TableCell>
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
                            <div>
                                <span className="text-muted-foreground">Phone:</span>
                                <p className="font-medium">{school.phone}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Address:</span>
                                <p className="font-medium">{school.address}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Mappings:</span>
                                <p className="font-medium">
                                    {school.mappings && school.mappings.length > 0
                                        ? `${school.mappings.length} class-division mapping(s)`
                                        : 'No mappings'}
                                </p>
                            </div>
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
                size="lg"
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
                <SchoolFormContent />
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
                size="lg"
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
                <SchoolFormContent />
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
